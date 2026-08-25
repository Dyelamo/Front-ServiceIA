// src/screens/client/ClientRequestsScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import AppHeader from "../../components/AppHeader";
import Badge from "../../components/Badge";
import {
  fetchClientOffers,
  fetchClientPublications,
} from "../../api/requestsService";
import {
  MOCK_CLIENT_OFFERS,
  MOCK_CLIENT_PUBLICATIONS,
} from "../../data/mockData";
import { formatCOP } from "../../utils";

const TABS = [
  {
    id: "publicaciones",
    label: "Mis publicaciones",
    icon: "documents-outline",
  },
  { id: "solicitudes", label: "Solicitudes recibidas", icon: "people-outline" },
];

function normalizePublication(item) {
  return {
    id: item.id || item.publicacion_id,
    title:
      item.title || item.titulo || item.descripcion || "Solicitud de servicio",
    category: item.category || item.categoria || "Servicio general",
    description:
      item.description || item.descripcion || "Sin descripción disponible.",
    location: item.location || item.ubicacion || "Ubicación no especificada",
    time: item.time || item.fecha || "Recientemente",
    status: item.status || item.estado || "Publicada",
    statusType: item.statusType || "success",
    offers:
      item.offers ?? item.solicitudes_count ?? item.solicitudes?.length ?? 0,
  };
}

function normalizeOffer(item) {
  return {
    id: item.id || item.solicitud_id,
    publicationTitle:
      item.publicationTitle ||
      item.publicacion_titulo ||
      item.publicacion?.titulo ||
      "Tu publicación",
    professional:
      item.professional ||
      item.prestador ||
      item.usuario?.nombre ||
      "Prestador de servicio",
    category: item.category || item.categoria || "Servicio general",
    message:
      item.message ||
      item.mensaje ||
      "El prestador ha enviado una solicitud para atender tu publicación.",
    price: item.price ?? item.precio ?? item.valor,
    rating: item.rating ?? item.calificacion,
    time: item.time || item.fecha || "Recientemente",
    status: item.status || item.estado || "Nueva solicitud",
  };
}

export default function ClientRequestsScreen({ navigation }) {
  const [tab, setTab] = useState("publicaciones");
  const [publications, setPublications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    const [publicationsResult, offersResult] = await Promise.allSettled([
      fetchClientPublications(),
      fetchClientOffers(),
    ]);

    setPublications(
      publicationsResult.status === "fulfilled" &&
        publicationsResult.value.length > 0
        ? publicationsResult.value.map(normalizePublication)
        : MOCK_CLIENT_PUBLICATIONS.map(normalizePublication),
    );
    setOffers(
      offersResult.status === "fulfilled" && offersResult.value.length > 0
        ? offersResult.value.map(normalizeOffer)
        : MOCK_CLIENT_OFFERS.map(normalizeOffer),
    );
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

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
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color={colors.primary} />
          <Text style={styles.backText}>Inicio</Text>
        </Pressable>

        <Text style={styles.title}>Mis publicaciones</Text>
        <Text style={styles.subtitle}>
          Sigue tus solicitudes y revisa quién puede ayudarte.
        </Text>

        <View style={styles.tabs}>
          {TABS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setTab(item.id)}
              style={[styles.tab, tab === item.id && styles.tabActive]}>
              <Ionicons
                name={item.icon}
                size={17}
                color={tab === item.id ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  tab === item.id && styles.tabTextActive,
                ]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === "publicaciones" ? (
          publications.length > 0 ? (
            publications.map((publication) => (
              <View style={styles.card} key={publication.id}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleWrap}>
                    <Text style={styles.cardTitle}>{publication.title}</Text>
                    <Text style={styles.category}>{publication.category}</Text>
                  </View>
                  <Badge
                    label={publication.status}
                    type={publication.statusType}
                  />
                </View>
                <Text style={styles.description}>
                  {publication.description}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="location-outline"
                      size={15}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.metaText}>{publication.location}</Text>
                  </View>
                  <Text style={styles.metaText}>{publication.time}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.offerCount}>
                    {publication.offers}{" "}
                    {publication.offers === 1
                      ? "solicitud recibida"
                      : "solicitudes recibidas"}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.primary}
                  />
                </View>
              </View>
            ))
          ) : (
            <EmptyState
              icon="documents-outline"
              text="Aún no has creado publicaciones."
            />
          )
        ) : offers.length > 0 ? (
          offers.map((offer) => (
            <View style={styles.card} key={offer.id}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={18} color={colors.primary} />
                </View>
                <View style={styles.professionalInfo}>
                  <Text style={styles.cardTitle}>{offer.professional}</Text>
                  <Text style={styles.category}>
                    {offer.category} · {offer.time}
                  </Text>
                </View>
                <Badge label={offer.status} type="warning" />
              </View>
              <Text style={styles.publicationLabel}>
                Para: {offer.publicationTitle}
              </Text>
              <Text style={styles.description}>{offer.message}</Text>
              <View style={styles.offerDetails}>
                {offer.price != null && (
                  <Text style={styles.price}>{formatCOP(offer.price)}</Text>
                )}
                {offer.rating != null && (
                  <View style={styles.rating}>
                    <Ionicons name="star" size={15} color={colors.warning} />
                    <Text style={styles.ratingText}>{offer.rating}</Text>
                  </View>
                )}
              </View>
              <Pressable style={styles.primaryAction} onPress={() => {}}>
                <Text style={styles.primaryActionText}>Ver solicitud</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.white} />
              </Pressable>
            </View>
          ))
        ) : (
          <EmptyState
            icon="people-outline"
            text="Todavía no has recibido solicitudes."
          />
        )}
      </ScrollView>
    </View>
  );
}

function EmptyState({ icon, text }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={30} color={colors.textMuted} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    alignSelf: "flex-start",
  },
  backText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    marginLeft: spacing.xs,
  },
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
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  tabActive: { backgroundColor: colors.primaryLight },
  tabText: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },
  tabTextActive: { color: colors.primary },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  cardTitleWrap: { flex: 1, paddingRight: spacing.sm },
  cardTitle: { ...typography.bodyBold, color: colors.textPrimary },
  category: { ...typography.small, color: colors.textSecondary, marginTop: 3 },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: spacing.sm,
  },
  metaText: {
    ...typography.small,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  offerCount: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  professionalInfo: { flex: 1 },
  publicationLabel: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  offerDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  price: { ...typography.bodyBold, color: colors.textPrimary },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.lg,
  },
  ratingText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "700",
    marginLeft: 4,
  },
  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 11,
  },
  primaryActionText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "700",
    marginRight: spacing.sm,
  },
  emptyState: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
