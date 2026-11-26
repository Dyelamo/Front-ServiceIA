import React, { useCallback, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

import { colors, layout, radius, spacing } from "../../../../theme/index";
import { Button, Card, Divider, EmptyState } from "../../../../shared/ui/index";
import { AppHeader, ResponsiveContainer, Screen } from "../../../../shared/layout/index";
import { useResponsive } from "../../../../shared/hooks/useResponsive";

import RequestStatusBadge from "../../components/RequestStatusBadge";
import EditRequestLocation from "../../components/EditRequestLocation";
import ReceivedOfferCard from "../../../offers/components/ReceivedOfferCard";
import { acceptOffer, fetchOffersForPublication } from "../../../offers/api/offers.api";
import {
  cancelServiceRequest,
  completeServiceRequest,
  fetchPublicationById,
} from "../../api/requests.api";
import { fetchPublicationReview } from "../../../reviews/api/reviews.api";
import MandatoryReviewModal from "../../../reviews/components/MandatoryReviewModal";
import { useRequestDraft } from "../../context/RequestDraftContext";
import CancellationModal from "../../../jobs/components/CancellationModal";
import { useAlertModal } from "../../../../core/alerts/AlertModalContext";
import { canCancelPublication } from "../../../../core/domain/statuses";
import { queryKeys } from "../../../../core/query/query-keys";
import { getApiErrorMessage } from "../../../../core/errors/error-message";

export default function RequestDetailScreen({ navigation, route }) {
  const { isDesktop } = useResponsive();
  const queryClient = useQueryClient();
  const { updateDraft } = useRequestDraft();
  const { showAlert, showConfirm } = useAlertModal();

  const initialRequest = route?.params?.request;
  const [updatedRequest, setUpdatedRequest] = useState(null);
  const request =
    updatedRequest?.id === initialRequest?.id && updatedRequest ? updatedRequest : initialRequest;
  const publicationId = request?.id || request?.publicacion_id;
  const [currentStatus, setCurrentStatus] = useState(
    request?.status || request?.estado || "publicada",
  );
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState(false);
  const [acceptingOfferId, setAcceptingOfferId] = useState(null);
  const [offersRetryCount, setOffersRetryCount] = useState(0);
  const [showCancellation, setShowCancellation] = useState(false);
  const [cancellingService, setCancellingService] = useState(false);

  // Estados del módulo de Reseñas Obligatorias
  const [review, setReview] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(
    Boolean(request?.ha_sido_calificada || request?.haSidoCalificada),
  );
  const [completingService, setCompletingService] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadData = async (_retryKey) => {
        if (!publicationId) {
          setOffers([]);
          setOffersLoading(false);
          setOffersError(true);
          return;
        }

        setOffersLoading(true);
        try {
          const [receivedOffers, updatedPublication] = await Promise.all([
            fetchOffersForPublication(publicationId),
            fetchPublicationById(publicationId),
          ]);
          if (active) {
            setOffers(receivedOffers);
            setUpdatedRequest(updatedPublication);
            setCurrentStatus(updatedPublication?.status || updatedPublication?.estado || "activo");
            setOffersError(false);
          }
        } catch (error) {
          console.error("Error cargando ofertas recibidas:", error);
          if (active) {
            setOffersError(true);
          }
        } finally {
          if (active) {
            setOffersLoading(false);
          }
        }

        // Consultar reseña existente
        try {
          const existingReview = await fetchPublicationReview(publicationId);
          if (active && existingReview) {
            setReview(existingReview);
            setHasReviewed(true);
          }
        } catch (e) {
          console.error("Error cargando reseña:", e);
        }
      };

      loadData(offersRetryCount);

      return () => {
        active = false;
      };
    }, [offersRetryCount, publicationId]),
  );

  if (!request) {
    return (
      <Screen>
        <AppHeader
          title="Publicación"
          onBack={() => navigation.goBack()}
          maxWidth={layout.content.wide}
        />

        <ResponsiveContainer maxWidth={layout.content.medium} style={styles.container}>
          <Text style={styles.notFound}>No encontramos la publicación.</Text>
        </ResponsiveContainer>
      </Screen>
    );
  }

  const description = request.description || request.descripcion || "Sin descripción";

  const category =
    request.categoryName ||
    request.categoria?.nombre ||
    request.categoria_nombre ||
    request.category ||
    "Servicio";

  const urgency = request.urgencyLabel || request.urgencia || request.urgency || "No especificada";

  const location =
    request.location ||
    (request.barrio ? `${request.barrio}, Valledupar` : request.direccion) ||
    "Valledupar, Cesar";

  const createdAt = request.createdAt || request.created_at;

  const acceptedOffer = offers.find((o) => o.status === "aceptada" || o.status === "aceptado");

  const isCompleted = currentStatus === "terminado" || currentStatus === "completada";
  const hasActiveAgreement =
    ["acuerdo", "en_progreso", "pendiente_confirmacion"].includes(currentStatus) &&
    Boolean(acceptedOffer);
  const canCompleteService = currentStatus === "pendiente_confirmacion" && Boolean(acceptedOffer);
  const canCancelService = canCancelPublication(currentStatus);
  const isOpenRequest = currentStatus === "activo";
  const cancelLabel = isOpenRequest ? "Cancelar solicitud" : "Cancelar servicio";

  const refreshRelatedData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.clientRequests }),
      queryClient.invalidateQueries({ queryKey: queryKeys.publicationOffers(publicationId) }),
      queryClient.invalidateQueries({ queryKey: ["jobs", "provider"] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.professionalProfile }),
      queryClient.invalidateQueries({ queryKey: ["conversations"] }),
    ]);
  };

  const handleAcceptOffer = async (offer) => {
    setAcceptingOfferId(offer.id);
    try {
      const result = await acceptOffer(offer.id);
      const conversationId =
        result?.id_conversacion ||
        result?.conversacion_id ||
        result?.conversation_id ||
        offer.conversationId;

      setCurrentStatus("acuerdo");
      setOffers((currentOffers) =>
        currentOffers.map((item) =>
          item.id === offer.id
            ? {
                ...item,
                status: "aceptada",
                statusLabel: "Aceptada",
                conversationId: conversationId || item.conversationId,
              }
            : item.status === "pendiente" || item.status === "en_espera"
              ? { ...item, status: "rechazada", statusLabel: "No seleccionada" }
              : item,
        ),
      );
      await refreshRelatedData();

      if (!conversationId) {
        showAlert({
          title: "Oferta aceptada",
          message: "La postulación fue aceptada y el servicio pasó a 'Acuerdo'.",
          variant: "success",
        });
        return;
      }

      navigation.navigate("Chat", {
        conversationId,
        partnerId: offer.providerId,
        partnerName:
          offer.provider?.nombre_completo ||
          offer.provider?.usuario?.nombre_completo ||
          "Profesional",
        publicationTitle: description,
      });
    } catch (error) {
      console.error("Error aceptando oferta:", error);
      showAlert({
        title: "No se pudo aceptar la oferta",
        message:
          error?.response?.status === 409
            ? "La oferta, la solicitud o la disponibilidad del profesional cambió. Actualiza las ofertas e intenta de nuevo."
            : getApiErrorMessage(error, "Intenta nuevamente."),
        variant: "error",
      });
    } finally {
      setAcceptingOfferId(null);
    }
  };

  const handleCompleteService = async () => {
    setCompletingService(true);
    try {
      await completeServiceRequest(publicationId);
      setCurrentStatus("terminado");
      await refreshRelatedData();
      // Despliega inmediatamente la calificación obligatoria
      setShowReviewModal(true);
    } catch (error) {
      console.error("Error al finalizar servicio:", error);
      showAlert({
        title: "No pudimos finalizar el servicio",
        message: getApiErrorMessage(error, "Intenta nuevamente."),
        variant: "error",
      });
    } finally {
      setCompletingService(false);
    }
  };

  const handleCancelService = async (reason) => {
    setCancellingService(true);
    try {
      await cancelServiceRequest({ publicationId, reason });
      setCurrentStatus("cancelado");
      setShowCancellation(false);
      await refreshRelatedData();
      showAlert({
        title: isOpenRequest ? "Solicitud cancelada" : "Servicio cancelado",
        message: isOpenRequest
          ? "La publicación ya no recibirá ofertas."
          : "El profesional fue notificado y el chat se cerró.",
        variant: "info",
      });
    } catch (error) {
      showAlert({
        title: "No pudimos cancelar el servicio",
        message: getApiErrorMessage(error, "Intenta nuevamente."),
        variant: "error",
      });
    } finally {
      setCancellingService(false);
    }
  };

  const providerName =
    acceptedOffer?.provider?.nombre_completo ||
    acceptedOffer?.provider?.usuario?.nombre_completo ||
    "el profesional";
  const providerId = acceptedOffer?.providerId || acceptedOffer?.prestador_id || "";

  const handleDuplicateRequest = () => {
    updateDraft({
      description,
      categoryId: request?.categoryId || request?.categoria_id,
      categoryName: category,
      urgency: request?.urgency || request?.urgencia || "",
      urgencyLabel: urgency,
      location,
      city: request?.ciudad || "Valledupar",
      barrio: request?.barrio || "Centro",
      address: request?.direccion || "",
      reference: request?.referencia || "",
      latitud: request?.latitud || null,
      longitud: request?.longitud || null,
      photos: [],
    });
    navigation.navigate("CreateRequestDescription");
  };

  const openCancellationModal = () => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.activeElement?.blur?.();
    }
    setShowCancellation(true);
  };

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader
        title="Detalle de publicación"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
        action={
          <Button
            fullWidth={false}
            size="sm"
            variant="outline"
            onPress={handleDuplicateRequest}
            leftIcon={<Ionicons name="copy-outline" size={16} color={colors.text} />}>
            Repetir
          </Button>
        }
      />

      <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
        {/* ENCABEZADO */}
        <View style={[styles.header, !isDesktop && styles.headerMobile]}>
          <View style={styles.headerText}>
            <Text style={styles.category}>{category}</Text>
            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>{description}</Text>
          </View>

          <View style={[styles.status, !isDesktop && styles.statusMobile]}>
            <RequestStatusBadge status={currentStatus} />
          </View>
        </View>

        {/* ALERTA DE RESEÑA OBLIGATORIA */}
        {isCompleted && !hasReviewed ? (
          <View style={styles.mandatoryAlert}>
            <Ionicons name="alert-circle" size={24} color="#B45309" />
            <View style={styles.mandatoryAlertTextWrapper}>
              <Text style={styles.mandatoryAlertTitle}>
                ¡Servicio Completado! Reseña obligatoria pendiente
              </Text>
              <Text style={styles.mandatoryAlertSubtitle}>
                Debes calificar a {providerName} para cerrar formalmente el proceso en ServIA.
              </Text>
            </View>
            <Button
              size="small"
              onPress={() => setShowReviewModal(true)}
              style={styles.mandatoryAlertButton}
              leftIcon={<Ionicons name="star" size={16} color="#FFFFFF" />}>
              Calificar ahora
            </Button>
          </View>
        ) : null}

        {/* TARJETA DE RESEÑA REGISTRADA */}
        {isCompleted && hasReviewed && review ? (
          <Card variant="outlined" style={styles.reviewCompletedCard}>
            <View style={styles.reviewCompletedHeader}>
              <View style={styles.reviewCompletedTitleRow}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.reviewCompletedTitle}>
                  Calificación que le otorgaste al profesional:
                </Text>
              </View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= review.calificacion ? "star" : "star-outline"}
                    size={16}
                    color="#F59E0B"
                  />
                ))}
                <Text style={styles.reviewScoreBadge}>{review.calificacion}.0 / 5.0</Text>
              </View>
            </View>
            <Text style={styles.reviewCompletedComment}>{`"${review.comentario}"`}</Text>
          </Card>
        ) : null}

        {/* INFORMACIÓN PRINCIPAL */}
        <View style={[styles.columns, !isDesktop && styles.columnsMobile]}>
          <View style={[styles.mainColumn, !isDesktop && styles.fullColumn]}>
            <Card variant="outlined" style={styles.card}>
              <SectionHeader icon="document-text-outline" title="Descripción" />
              <Text style={styles.description}>{description}</Text>
            </Card>

            {hasActiveAgreement ? (
              <View style={styles.completeActionBox}>
                <View style={styles.serviceProgressHeader}>
                  <View style={styles.serviceProgressIcon}>
                    <Ionicons
                      name={canCompleteService ? "checkmark-done-outline" : "time-outline"}
                      size={21}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.serviceProgressCopy}>
                    <Text style={styles.serviceProgressTitle}>
                      {canCompleteService
                        ? "El profesional terminó el trabajo"
                        : currentStatus === "en_progreso"
                          ? "Servicio en progreso"
                          : "Oferta aceptada"}
                    </Text>
                    <Text style={styles.serviceProgressText}>
                      {canCompleteService
                        ? `Confirma únicamente si ${providerName} realmente terminó el servicio de forma satisfactoria.`
                        : currentStatus === "en_progreso"
                          ? `${providerName} está realizando el trabajo. Podrás confirmarlo cuando lo marque como realizado.`
                          : `Esperando que ${providerName} marque el inicio del trabajo.`}
                    </Text>
                  </View>
                </View>
                {canCompleteService ? (
                  <Button
                    onPress={() =>
                      showConfirm({
                        title: "Confirmar servicio terminado",
                        message:
                          "Confirma solamente si el profesional terminó realmente el trabajo. Después podrás calificarlo.",
                        cancelLabel: "Volver",
                        confirmLabel: "Confirmar",
                        variant: "info",
                        onConfirm: handleCompleteService,
                      })
                    }
                    loading={completingService}
                    leftIcon={<Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />}>
                    Confirmar servicio terminado y calificar
                  </Button>
                ) : null}
              </View>
            ) : null}
          </View>

          <View
            style={[
              styles.sideColumn,
              !isDesktop && styles.fullColumn,
              !isDesktop && styles.sideMobile,
            ]}>
            <Card variant="outlined" style={styles.card}>
              <SectionHeader icon="information-circle-outline" title="Información y Ubicación" />

              <InfoRow icon="grid-outline" label="Categoría" value={category} />
              <Divider />
              <InfoRow icon="time-outline" label="Urgencia" value={urgency} />
              <Divider />
              <InfoRow icon="location-outline" label="Dirección del servicio" value={location} />
              {request.referencia ? (
                <InfoRow icon="flag-outline" label="Referencia" value={request.referencia} />
              ) : null}
              {currentStatus === "activo" ? (
                <EditRequestLocation
                  key={publicationId}
                  request={request}
                  onSaved={(updated) => {
                    setUpdatedRequest(updated);
                    queryClient.invalidateQueries({ queryKey: queryKeys.clientRequests });
                    queryClient.invalidateQueries({ queryKey: queryKeys.professionalRequests });
                    queryClient.invalidateQueries({
                      queryKey: queryKeys.publicationDetail(publicationId),
                    });
                    setOffersRetryCount((value) => value + 1);
                  }}
                />
              ) : null}

              {createdAt ? (
                <>
                  <Divider />
                  <InfoRow
                    icon="calendar-outline"
                    label="Publicada"
                    value={formatDate(createdAt)}
                  />
                </>
              ) : null}
            </Card>
          </View>
        </View>

        {/* OFERTAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ofertas y Prestadores</Text>

          {offersLoading ? (
            <Card variant="outlined" style={styles.offersCard}>
              <Text style={styles.offersMessage}>Cargando ofertas...</Text>
            </Card>
          ) : offersError ? (
            <Card variant="outlined" style={styles.offersCard}>
              <Text style={styles.offersMessage}>
                No pudimos cargar las ofertas de esta publicación.
              </Text>
              <Button
                variant="outline"
                size="sm"
                onPress={() => setOffersRetryCount((count) => count + 1)}
                style={styles.retryButton}>
                Reintentar
              </Button>
            </Card>
          ) : offers.length === 0 ? (
            <Card variant="outlined" style={styles.offersCard}>
              <EmptyState
                compact
                icon="people-outline"
                title="Aún no hay ofertas"
                description="Cuando un profesional envíe una propuesta, aparecerá aquí."
              />
            </Card>
          ) : (
            <View>
              {offers.map((offer) => (
                <ReceivedOfferCard
                  key={offer.id}
                  offer={offer}
                  accepting={acceptingOfferId === offer.id}
                  onAccept={() => handleAcceptOffer(offer)}
                  onViewProfile={() =>
                    navigation.navigate("WorkerProfile", {
                      workerId: offer.providerId || offer.provider?.id,
                      workerName:
                        offer.provider?.nombre_completo ||
                        offer.provider?.usuario?.nombre_completo ||
                        "Profesional",
                      provider: offer.provider,
                      distanceKm: offer.distanceKm,
                    })
                  }
                  onMessage={() =>
                    navigation.navigate("Chat", {
                      conversationId: offer.conversationId,
                      partnerId: offer.providerId,
                      partnerName:
                        offer.provider?.nombre_completo ||
                        offer.provider?.usuario?.nombre_completo ||
                        "Profesional",
                      publicationTitle: description,
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>
        {canCancelService ? (
          <View style={styles.cancelAction}>
            <Button
              variant="outline"
              size="sm"
              fullWidth={false}
              onPress={openCancellationModal}
              leftIcon={<Ionicons name="close-circle-outline" size={17} color={colors.error} />}
              style={styles.cancelButton}>
              {cancelLabel}
            </Button>
          </View>
        ) : null}
      </ResponsiveContainer>

      {/* MODAL BLOQUEANTE DE RESEÑA OBLIGATORIA (No se puede omitir) */}
      <MandatoryReviewModal
        visible={showReviewModal || (isCompleted && !hasReviewed && Boolean(providerId))}
        publicationId={publicationId}
        providerId={providerId}
        providerName={providerName}
        publicationTitle={description}
        onSuccess={(newReview) => {
          setReview(newReview);
          setHasReviewed(true);
          setShowReviewModal(false);
        }}
      />
      <CancellationModal
        visible={showCancellation}
        isOpenRequest={isOpenRequest}
        loading={cancellingService}
        onClose={() => !cancellingService && setShowCancellation(false)}
        onConfirm={handleCancelService}
      />
    </Screen>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },
  notFound: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  headerMobile: {
    flexDirection: "column",
  },
  headerText: {
    flex: 1,
    maxWidth: 800,
  },
  category: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "800",
  },
  titleDesktop: {
    fontSize: 30,
    lineHeight: 39,
  },
  status: {
    marginLeft: spacing.xl,
  },
  statusMobile: {
    marginLeft: 0,
    marginTop: spacing.md,
  },
  cancelAction: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "flex-start",
    paddingTop: spacing.lg,
    marginTop: spacing.lg,
  },
  cancelButton: {
    borderColor: colors.error,
  },
  mandatoryAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#F59E0B",
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
    flexWrap: "wrap",
  },
  mandatoryAlertTextWrapper: {
    flex: 1,
    minWidth: 220,
  },
  mandatoryAlertTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400E",
  },
  mandatoryAlertSubtitle: {
    fontSize: 13,
    color: "#B45309",
    marginTop: 2,
  },
  mandatoryAlertButton: {
    backgroundColor: "#D97706",
  },
  reviewCompletedCard: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  reviewCompletedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: spacing.xs,
  },
  reviewCompletedTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reviewCompletedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#065F46",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  reviewScoreBadge: {
    fontSize: 13,
    fontWeight: "700",
    color: "#065F46",
    marginLeft: 6,
  },
  reviewCompletedComment: {
    fontSize: 14,
    color: "#047857",
    fontStyle: "italic",
    marginTop: 4,
  },
  columns: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xl,
  },
  columnsMobile: {
    flexDirection: "column",
    gap: 0,
  },
  mainColumn: {
    flex: 2,
  },
  sideColumn: {
    flex: 1,
    minWidth: 300,
  },
  fullColumn: {
    width: "100%",
    minWidth: 0,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },
  sideMobile: {
    marginTop: spacing.lg,
  },
  card: {
    width: "100%",
    padding: spacing.xl,
  },
  completeActionBox: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  completeActionPrompt: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  serviceProgressHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  serviceProgressIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
  },
  serviceProgressCopy: {
    flex: 1,
    marginLeft: spacing.md,
  },
  serviceProgressTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  serviceProgressText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginLeft: spacing.md,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  infoValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  section: {
    marginTop: spacing.xxxl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: spacing.lg,
  },
  offersCard: {
    padding: spacing.xl,
  },
  offersMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: spacing.md,
  },
});
