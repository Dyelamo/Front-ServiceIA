import React, { useCallback, useState } from "react";

import { Alert, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { colors, layout, spacing } from "../../../../theme/index";

import { Button, Card, Divider, EmptyState } from "../../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../../shared/layout/index";

import { useResponsive } from "../../../../shared/hooks/useResponsive";

import RequestStatusBadge from "../../components/RequestStatusBadge";
import ReceivedOfferCard from "../../../offers/components/ReceivedOfferCard";
import {
  acceptOffer,
  fetchOffersForPublication,
} from "../../../offers/api/offers.api";

export default function RequestDetailScreen({ navigation, route }) {
  const { isDesktop } = useResponsive();

  const request = route?.params?.request;
  const publicationId = request?.id || request?.publicacion_id;
  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState(false);
  const [acceptingOfferId, setAcceptingOfferId] = useState(null);
  const [offersRetryCount, setOffersRetryCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadOffers = async () => {
        if (!publicationId) {
          setOffers([]);
          setOffersLoading(false);
          setOffersError(true);
          return;
        }

        setOffersLoading(true);
        try {
          const receivedOffers = await fetchOffersForPublication(publicationId);
          if (active) {
            setOffers(receivedOffers);
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
      };

      loadOffers();

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

        <ResponsiveContainer
          maxWidth={layout.content.medium}
          style={styles.container}>
          <Text style={styles.notFound}>No encontramos la publicación.</Text>
        </ResponsiveContainer>
      </Screen>
    );
  }

  const description =
    request.description || request.descripcion || "Sin descripción";

  const category =
    request.categoryName ||
    request.categoria?.nombre ||
    request.categoria_nombre ||
    request.category ||
    "Servicio";

  const urgency =
    request.urgencyLabel ||
    request.urgencia ||
    request.urgency ||
    "No especificada";

  const status = request.status || request.estado || "publicada";

  const location = request.location || request.ubicacion || "Valledupar, Cesar";

  const createdAt = request.createdAt || request.created_at;

  const handleAcceptOffer = async (offer) => {
    setAcceptingOfferId(offer.id);
    try {
      const result = await acceptOffer(offer.id);
      const conversationId =
        result?.id_conversacion ||
        result?.conversacion_id ||
        result?.conversation_id ||
        offer.conversationId;

      setOffers((currentOffers) =>
        currentOffers.map((item) =>
          item.id === offer.id
            ? {
                ...item,
                status: "aceptada",
                statusLabel: "Aceptada",
                conversationId: conversationId || item.conversationId,
              }
            : item,
        ),
      );

      if (!conversationId) {
        Alert.alert(
          "Oferta aceptada",
          "La postulación fue aceptada, pero el servidor no devolvió el identificador de la conversación.",
        );
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
      Alert.alert(
        "No se pudo aceptar la oferta",
        error?.response?.data?.detail || "Intenta nuevamente.",
      );
    } finally {
      setAcceptingOfferId(null);
    }
  };

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader
        title="Detalle de publicación"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
      />

      <ResponsiveContainer
        maxWidth={layout.content.wide}
        style={styles.container}>
        {/* ENCABEZADO */}

        <View style={[styles.header, !isDesktop && styles.headerMobile]}>
          <View style={styles.headerText}>
            <Text style={styles.category}>{category}</Text>

            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
              {description}
            </Text>
          </View>

          <View style={[styles.status, !isDesktop && styles.statusMobile]}>
            <RequestStatusBadge status={status} />
          </View>
        </View>

        {/* INFORMACIÓN PRINCIPAL */}

        <View style={[styles.columns, !isDesktop && styles.columnsMobile]}>
          <View style={[styles.mainColumn, !isDesktop && styles.fullColumn]}>
            <Card variant="outlined" style={styles.card}>
              <SectionHeader icon="document-text-outline" title="Descripción" />

              <Text style={styles.description}>{description}</Text>
            </Card>
          </View>

          <View
            style={[
              styles.sideColumn,

              !isDesktop && styles.fullColumn,

              !isDesktop && styles.sideMobile,
            ]}>
            <Card variant="outlined" style={styles.card}>
              <SectionHeader
                icon="information-circle-outline"
                title="Información"
              />

              <InfoRow icon="grid-outline" label="Categoría" value={category} />

              <Divider />

              <InfoRow icon="time-outline" label="Urgencia" value={urgency} />

              <Divider />

              <InfoRow
                icon="location-outline"
                label="Ubicación"
                value={location}
              />

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
          <Text style={styles.sectionTitle}>Ofertas recibidas</Text>

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
      </ResponsiveContainer>
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
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

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

    marginBottom: spacing.xxl,
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
