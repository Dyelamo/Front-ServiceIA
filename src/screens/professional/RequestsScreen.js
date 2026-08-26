// src/screens/professional/RequestsScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import AppHeader from "../../components/AppHeader";
import RequestCard from "../../components/RequestCard";
import { MOCK_NEW_REQUESTS } from "../../data/mockData";
import { formatCOP } from "../../utils";
import {
  createProfessionalOffer,
  fetchProfessionalPublications,
  fetchProfessionalOffers,
} from "../../api/requestsService";

const TABS = [
  { id: "nuevas", label: "Nuevas" },
  { id: "ofertas", label: "Ofertas enviadas" },
];

// Forma real que devuelve /publicaciones/publicaciones-categorias-prestador
// (con incluir_usuario=True, incluir_categoria=True del lado del backend):
// { id, descripcion, categoria_id, urgencia, usuario_id, estado,
//   created_at, updated_at,
//   usuario: { nombre_completo, foto_perfil },
//   categoria: { nombre, icono } }
//
// Nota: `publicaciones` hoy NO tiene columna de ubicación/dirección,
// por eso location siempre cae al texto por defecto. Si tu marketplace
// necesita mostrar cercanía, hay que agregar esa columna a futuro.
function normalizeRequest(item) {
  return {
    id: item.id,
    title: item.descripcion || "Solicitud de servicio",
    category: item.categoria?.nombre || "Servicio general",
    categoryIcon: item.categoria?.icono || null,
    description: item.descripcion || "",
    urgency: item.urgencia || "normal",
    location: "Ubicación no especificada",
    time: item.created_at || "Recientemente",
    status: item.estado || "Nueva",
    clientName: item.usuario?.nombre_completo || "Cliente",
    clientPhoto: item.usuario?.foto_perfil || null,
    badge: item.estado || "Nueva",
    badgeType: "warning",
    visitType: item.tipo_visita || "Presencial",
    photos: item.fotos || item.imagenes || [],
  };
}

function normalizeOffer(item) {
  return {
    id: item.id || item.oferta_id,
    publicationTitle:
      item.publicationTitle ||
      item.publicacion?.descripcion ||
      item.publicacion?.title ||
      "Publicación",
    category:
      item.category ||
      item.categoria?.nombre ||
      item.categoria ||
      "Servicio general",
    price: item.price ?? item.precio ?? item.precio_ofertado,
    status: item.status || item.estado || "Enviada",
    time: item.time || item.fecha || item.created_at || "Recientemente",
    availability: item.availability || item.disponibilidad || "No especificada",
    message: item.message || item.mensaje || "Sin mensaje",
  };
}

export default function RequestsScreen() {
  const [tab, setTab] = useState("nuevas");
  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    const [requestsResult, offersResult] = await Promise.allSettled([
      fetchProfessionalPublications(),
      fetchProfessionalOffers(),
    ]);

    setRequests(
      requestsResult.status === "fulfilled" && requestsResult.value.length > 0
        ? requestsResult.value.map(normalizeRequest)
        : MOCK_NEW_REQUESTS,
    );
    const availableRequests =
      requestsResult.status === "fulfilled"
        ? requestsResult.value.map(normalizeRequest)
        : [];
    setOffers(
      offersResult.status === "fulfilled" && offersResult.value.length > 0
        ? offersResult.value.map((offer) => {
            const publication = availableRequests.find(
              (request) =>
                request.id === (offer.publicacion_id || offer.publicacion?.id),
            );
            return normalizeOffer({
              ...offer,
              publicacion: offer.publicacion || publication,
              categoria: offer.categoria || publication?.category,
            });
          })
        : [],
    );
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  function openOfferForm(request) {
    setSelectedRequest(request);
    setPrice("");
    setAvailability("");
    setMessage("");
  }

  function formatPriceInput(value) {
    const digits = value.replace(/\D/g, "");
    return digits ? Number(digits).toLocaleString("es-CO") : "";
  }

  async function submitOffer() {
    if (!selectedRequest || !price || !availability || !message.trim()) {
      Alert.alert(
        "Completa la oferta",
        "Indica precio, disponibilidad y mensaje.",
      );
      return;
    }
    setSubmitting(true);
    try {
      const createdOffer = await createProfessionalOffer({
        publicationId: selectedRequest.id,
        price: price.replace(/\./g, ""),
        availability,
        message: message.trim(),
      });
      setSelectedRequest(null);
      setTab("ofertas");
      await loadData();
      setOffers((currentOffers) => [
        normalizeOffer({
          ...createdOffer,
          id: createdOffer?.id || `local-${selectedRequest.id}`,
          publicacion: { descripcion: selectedRequest.title },
          categoria: { nombre: selectedRequest.category },
          precio_ofertado: Number(price.replace(/\./g, "")),
          disponibilidad: availability,
          mensaje: message.trim(),
          estado: createdOffer?.estado || "Enviada",
          created_at: createdOffer?.created_at || new Date().toISOString(),
        }),
        ...currentOffers.filter((offer) => offer.id !== createdOffer?.id),
      ]);
      Alert.alert("Oferta enviada", "El cliente podrá revisar tu postulación.");
    } catch (error) {
      Alert.alert(
        "No se pudo enviar",
        "Revisa tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            tintColor={colors.primary}
          />
        }>
        <Text style={styles.title}>Solicitudes</Text>
        <Text style={styles.subtitle}>
          Clientes que necesitan un servicio cerca de ti.
        </Text>

        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[styles.tabBtn, tab === t.id && styles.tabBtnActive]}>
              <Text
                style={[styles.tabText, tab === t.id && styles.tabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === "nuevas" ? (
          requests.length > 0 ? (
            requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                ctaLabel="Ver solicitud y enviar oferta"
                onPress={() => openOfferForm(req)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No hay solicitudes en tus categorías todavía.
              </Text>
            </View>
          )
        ) : offers.length > 0 ? (
          offers.map((offer) => (
            <View style={styles.card} key={offer.id}>
              <Text style={styles.cardTitle}>{offer.publicationTitle}</Text>
              <Text style={styles.category}>
                {offer.category} · {offer.time}
              </Text>
              <Text style={styles.status}>{offer.status}</Text>
              {!!offer.price && (
                <Text style={styles.offerDetail}>
                  Oferta: {formatCOP(offer.price)}
                </Text>
              )}
              {!!offer.availability && (
                <Text style={styles.offerDetail}>
                  Disponibilidad: {offer.availability}
                </Text>
              )}
              {!!offer.message && (
                <Text style={styles.offerDetail}>{offer.message}</Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aún no has enviado ofertas.</Text>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={!!selectedRequest}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedRequest(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ScrollView
              contentContainerStyle={styles.modalScroll}
              keyboardShouldPersistTaps="handled">
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Solicitud de servicio</Text>
                <Pressable
                  onPress={() => setSelectedRequest(null)}
                  hitSlop={10}>
                  <Ionicons
                    name="close"
                    size={22}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>

              <View style={styles.publicationPanel}>
                <View style={styles.publicationTop}>
                  <View style={styles.publicationHeading}>
                    <Text style={styles.publicationTitle}>
                      {selectedRequest?.title}
                    </Text>
                    <Text style={styles.clientText}>
                      Solicitado por {selectedRequest?.clientName}
                    </Text>
                  </View>
                  <Text style={styles.todayBadge}>Hoy</Text>
                </View>
                <Text style={styles.publicationDescription}>
                  {selectedRequest?.description}
                </Text>
                <View style={styles.divider} />
                <View style={styles.detailsGrid}>
                  <Detail
                    icon="pricetag-outline"
                    label="Categoría"
                    value={selectedRequest?.category}
                  />
                  <Detail
                    icon="warning-outline"
                    label="Urgencia"
                    value={
                      selectedRequest?.urgency === "alta"
                        ? "Alta"
                        : selectedRequest?.urgency || "Normal"
                    }
                  />
                  <Detail
                    icon="location-outline"
                    label="Ubicación"
                    value={selectedRequest?.location}
                  />
                  <Detail
                    icon="person-outline"
                    label="Visita"
                    value={selectedRequest?.visitType}
                  />
                </View>
                <Text style={styles.photosLabel}>Fotos del cliente</Text>
                <Text style={styles.photosText}>
                  {selectedRequest?.photos?.length
                    ? `${selectedRequest.photos.length} foto(s) adjunta(s)`
                    : "El cliente no adjuntó fotos."}
                </Text>
              </View>

              <View style={styles.offerPanel}>
                <Text style={styles.offerTitle}>Enviar oferta</Text>
                <Text style={styles.offerSubtitle}>
                  Propón tu precio y disponibilidad.
                </Text>
                <Text style={styles.fieldLabel}>Precio del servicio (COP)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="$ 120.000"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={(value) => setPrice(formatPriceInput(value))}
                />
                <View style={styles.priceChips}>
                  {["90000", "120000", "150000"].map((suggestedPrice) => (
                    <Pressable
                      key={suggestedPrice}
                      style={styles.priceChip}
                      onPress={() =>
                        setPrice(formatPriceInput(suggestedPrice))
                      }>
                      <Text style={styles.priceChipText}>
                        ${formatPriceInput(suggestedPrice)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.fieldLabel}>Disponibilidad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Hoy, en 2 horas"
                  value={availability}
                  onChangeText={setAvailability}
                />
                <Text style={styles.fieldLabel}>Mensaje para el cliente</Text>
                <TextInput
                  style={[styles.input, styles.messageInput]}
                  placeholder="Cuéntale cómo puedes ayudarle"
                  multiline
                  value={message}
                  onChangeText={setMessage}
                />
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable
                style={[
                  styles.submitButton,
                  submitting && styles.disabledButton,
                ]}
                onPress={submitOffer}
                disabled={submitting}>
                <Ionicons
                  name="paper-plane-outline"
                  size={16}
                  color={colors.white}
                />
                <Text style={styles.submitText}>
                  {submitting ? "Enviando..." : "Enviar oferta"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: {
    ...typography.h1,
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  tabBtnActive: { backgroundColor: colors.background },
  tabText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  tabTextActive: { color: colors.textPrimary },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: { ...typography.bodyBold, color: colors.textPrimary },
  category: { ...typography.small, color: colors.textSecondary, marginTop: 3 },
  status: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    marginTop: spacing.sm,
  },
  emptyState: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyText: { ...typography.body, color: colors.textSecondary },
  offerDetail: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  modalPublication: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  messageInput: { minHeight: 90, textAlignVertical: "top" },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  disabledButton: { opacity: 0.6 },
  submitText: { ...typography.bodyBold, color: colors.white },
  modalScroll: { padding: spacing.lg, paddingBottom: spacing.md },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  publicationPanel: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  publicationTop: { flexDirection: "row", alignItems: "flex-start" },
  publicationHeading: { flex: 1 },
  publicationTitle: {
    ...typography.h2,
    fontSize: 20,
    color: colors.textPrimary,
  },
  clientText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  todayBadge: {
    ...typography.small,
    color: colors.warning,
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  publicationDescription: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 21,
    marginTop: spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: spacing.md },
  detail: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: spacing.sm,
  },
  detailIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  detailLabel: { ...typography.small, color: colors.textSecondary },
  detailValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
    marginTop: 1,
  },
  photosLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  photosText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  offerPanel: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  offerTitle: { ...typography.bodyBold, color: colors.textPrimary },
  offerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  priceChips: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  priceChip: {
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
  },
  priceChipText: { ...typography.small, color: colors.textSecondary },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
});

function Detail({ icon, label, value }) {
  return (
    <View style={styles.detail}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}
