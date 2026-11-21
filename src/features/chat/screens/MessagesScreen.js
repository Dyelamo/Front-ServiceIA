import React, { useCallback, useContext, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { AppModeContext } from "../../app-mode/context/AppModeContext";
import { fetchClientPublications } from "../../requests/api/requests.api";
import { fetchOffersForPublication, fetchProfessionalOffersWithPublications } from "../../offers/api/offers.api";
import { EmptyState, ErrorState, Skeleton } from "../../../shared/ui";
import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout";
import { colors, layout, radius, spacing } from "../../../theme";

export default function MessagesScreen({ navigation }) {
  const { mode } = useContext(AppModeContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      let acceptedOffers = [];
      if (mode === "profesional") {
        acceptedOffers = await fetchProfessionalOffersWithPublications();
      } else {
        const publications = await fetchClientPublications();
        const offersByPublication = await Promise.all(
          publications.map((publication) =>
            fetchOffersForPublication(publication.id),
          ),
        );
        acceptedOffers = offersByPublication.flat().map((offer) => {
          const publication = publications.find(
            (item) => item.id === offer.publicationId,
          );
          return { ...offer, publication };
        });
      }

      setConversations(
        acceptedOffers.filter(
          (offer) =>
            (offer.status === "aceptada" || offer.status === "aceptado") &&
            offer.conversationId,
        ),
      );
      setError(false);
    } catch (loadError) {
      console.error("Error cargando conversaciones:", loadError);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mode]);

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [loadConversations]),
  );

  const handleRetry = async () => {
    setRetrying(true);
    await loadConversations();
    setRetrying(false);
  };

  const openConversation = (offer) => {
    const isProfessional = mode === "profesional";
    const partnerId = isProfessional
      ? offer.publication?.userId
      : offer.providerId;

    if (!partnerId || !offer.conversationId) {
      return;
    }

    navigation.navigate("Chat", {
      conversationId: offer.conversationId,
      partnerId,
      partnerName: isProfessional
        ? "Cliente"
        : offer.provider?.nombre_completo ||
          offer.provider?.usuario?.nombre_completo ||
          "Profesional",
      publicationTitle: offer.publication?.description,
    });
  };

  if (loading) {
    return (
      <Screen>
        <AppHeader title="Mensajes" maxWidth={layout.content.wide} />
        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          <Skeleton height={92} />
          <Skeleton height={92} />
          <Skeleton height={92} />
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <Screen>
        <AppHeader title="Mensajes" maxWidth={layout.content.wide} />
        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          <ErrorState
            title="No pudimos cargar tus conversaciones"
            description="Intenta nuevamente."
            onRetry={handleRetry}
            retrying={retrying}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={colors.background}>
      <AppHeader title="Mensajes" maxWidth={layout.content.wide} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadConversations();
            }}
          />
        }
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={layout.content.wide}>
          {error ? (
            <Text style={styles.warning}>
              No pudimos actualizar la lista. Mostramos los datos disponibles.
            </Text>
          ) : null}
          {conversations.length === 0 ? (
            <EmptyState
              icon="chatbubbles-outline"
              title="Aún no tienes mensajes"
              description={
                mode === "profesional"
                  ? "Las conversaciones aparecerán cuando un cliente acepte una de tus ofertas."
                  : "Cuando aceptes una oferta podrás iniciar una conversación desde su publicación."
              }
            />
          ) : (
            conversations.map((offer) => {
              const isProfessional = mode === "profesional";
              const partnerId = isProfessional
                ? offer.publication?.userId
                : offer.providerId;
              const partnerName = isProfessional
                ? "Cliente"
                : offer.provider?.nombre_completo ||
                  offer.provider?.usuario?.nombre_completo ||
                  "Profesional";
              return (
                <Pressable
                  key={offer.conversationId}
                  disabled={!partnerId}
                  onPress={() => openConversation(offer)}
                  style={({ pressed }) => [
                    styles.conversationCard,
                    pressed && styles.pressed,
                    !partnerId && styles.disabled,
                  ]}>
                  <View style={styles.avatar}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.conversationContent}>
                    <Text style={styles.partnerName}>{partnerName}</Text>
                    <Text numberOfLines={1} style={styles.publication}>
                      {offer.publication?.description || "Publicación"}
                    </Text>
                    <Text style={styles.offerSummary}>
                      Oferta aceptada · {formatCurrency(offer.price)}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              );
            })
          )}
        </ResponsiveContainer>
      </ScrollView>
    </Screen>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  scrollContent: {
    paddingVertical: spacing.xl,
  },
  conversationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },
  conversationContent: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  partnerName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  publication: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  offerSummary: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  warning: {
    color: "#9A3412",
    backgroundColor: "#FFF7ED",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
});
