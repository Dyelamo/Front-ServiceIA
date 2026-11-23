import React, { useCallback, useState, useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";

import { Alert, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { colors, layout, spacing } from "../../../theme/index";

import { EmptyState, ErrorState, Skeleton } from "../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

import {
  fetchProfessionalOffersWithPublications,
  withdrawProfessionalOffer,
} from "../api/offers.api";
import { queryKeys } from "../../../core/query/query-keys";
import { getApiErrorMessage } from "../../../core/errors/error-message";

import OfferCard from "../components/OfferCard";

export default function ProfessionalOffersScreen({ navigation, route }) {
  const { isDesktop } = useResponsive();
  const queryClient = useQueryClient();

  const [showSuccess, setShowSuccess] = useState(false);

  const {
    data: offers = [],
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.professionalOffers,
    queryFn: async () => {
      const data = await fetchProfessionalOffersWithPublications();
      return Array.isArray(data) ? data : [];
    },
  });

  useEffect(() => {
    if (!route?.params?.offerSent) {
      return;
    }

    setShowSuccess(true);

    navigation.setParams({
      offerSent: undefined,
    });

    const timeout = setTimeout(() => {
      setShowSuccess(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [route?.params?.offerSent, navigation]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const refreshing = isFetching && !isLoading;

  const withdrawMutation = useMutation({
    mutationFn: withdrawProfessionalOffer,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.professionalOffers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.professionalRequests }),
        queryClient.invalidateQueries({ queryKey: queryKeys.professionalProfile }),
      ]);
    },
    onError: (error) => {
      Alert.alert("No pudimos retirar la oferta", getApiErrorMessage(error, "Intenta nuevamente."));
    },
  });

  const confirmWithdraw = (offer) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Retirar oferta\n\nLa propuesta dejará de estar disponible para el cliente. Esta acción no se puede deshacer.",
      );

      if (confirmed) {
        withdrawMutation.mutate(offer.id);
      }
      return;
    }

    Alert.alert(
      "Retirar oferta",
      "La propuesta dejará de estar disponible para el cliente. Esta acción no se puede deshacer.",
      [
        { text: "Conservar", style: "cancel" },
        {
          text: "Retirar",
          style: "destructive",
          onPress: () => withdrawMutation.mutate(offer.id),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <Screen>
        <AppHeader title="Ofertas enviadas" maxWidth={layout.content.wide} />
        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          {showSuccess ? <OfferSentBanner /> : null}
          <View style={styles.grid}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                <Skeleton height={260} />
              </View>
            ))}
          </View>
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (isError && offers.length === 0) {
    return (
      <Screen>
        <AppHeader title="Ofertas enviadas" maxWidth={layout.content.wide} />

        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          {showSuccess ? <OfferSentBanner /> : null}
          <ErrorState
            title="No pudimos cargar tus ofertas"
            description="Intenta nuevamente."
            onRetry={refetch}
            retrying={isFetching}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={colors.background}>
      <AppHeader title="Ofertas enviadas" maxWidth={layout.content.wide} />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={layout.content.wide}>
          {showSuccess ? <OfferSentBanner /> : null}
          {isError && offers.length > 0 ? (
            <View style={styles.updateWarning}>
              <Text style={styles.updateWarningTitle}>No pudimos actualizar</Text>

              <Text style={styles.updateWarningText}>
                Tus ofertas siguen visibles con la última información disponible.
              </Text>
            </View>
          ) : null}
          {offers.length === 0 ? (
            <EmptyState
              icon="paper-plane-outline"
              title="Aún no has enviado ofertas"
              description="Las propuestas que envíes aparecerán aquí."
            />
          ) : (
            <>
              <View style={styles.heading}>
                <Text style={styles.title}>Mis ofertas</Text>

                <Text style={styles.description}>
                  {offers.length} {offers.length === 1 ? "oferta enviada" : "ofertas enviadas"}
                </Text>
              </View>

              <View style={styles.grid}>
                {offers.map((offer) => (
                  <View key={offer.id} style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                    <OfferCard
                      offer={offer}
                      withdrawing={
                        withdrawMutation.isPending && withdrawMutation.variables === offer.id
                      }
                      onWithdraw={() => confirmWithdraw(offer)}
                      onMessage={() =>
                        navigation.navigate("Chat", {
                          conversationId: offer.conversationId,
                          partnerId: offer.publication?.userId,
                          partnerName: "Cliente",
                          publicationTitle: offer.publication?.description,
                        })
                      }
                    />
                  </View>
                ))}
              </View>
            </>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </Screen>
  );
}

function OfferSentBanner() {
  return (
    <View style={styles.successBanner}>
      <Ionicons name="checkmark-circle" size={22} color="#15803D" />

      <View style={styles.successContent}>
        <Text style={styles.successTitle}>Oferta enviada</Text>

        <Text style={styles.successText}>Tu propuesta fue enviada correctamente al cliente.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },

  scrollContent: {
    paddingVertical: spacing.xxl,
  },

  heading: {
    marginBottom: spacing.xl,
  },

  title: {
    color: colors.text,

    fontSize: 24,
    fontWeight: "800",
  },

  description: {
    color: colors.textSecondary,

    fontSize: 14,

    marginTop: spacing.xs,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  wrapper: {
    width: "100%",

    padding: 6,

    marginBottom: spacing.sm,
  },

  wrapperDesktop: {
    width: "50%",
  },

  successBanner: {
    flexDirection: "row",

    alignItems: "flex-start",

    marginBottom: spacing.xl,

    padding: spacing.lg,

    backgroundColor: "#F0FDF4",

    borderWidth: 1,

    borderColor: "#BBF7D0",

    borderRadius: 12,
  },

  successContent: {
    flex: 1,

    marginLeft: spacing.sm,
  },

  successTitle: {
    color: "#15803D",

    fontSize: 14,

    fontWeight: "700",
  },

  successText: {
    color: "#166534",

    fontSize: 13,

    lineHeight: 19,

    marginTop: 2,
  },
  updateWarning: {
    marginBottom: spacing.lg,

    padding: spacing.md,

    backgroundColor: "#FFF7ED",

    borderWidth: 1,

    borderColor: "#FED7AA",

    borderRadius: 12,
  },

  updateWarningTitle: {
    color: "#9A3412",

    fontSize: 13,

    fontWeight: "700",
  },

  updateWarningText: {
    color: "#9A3412",

    fontSize: 12,

    lineHeight: 18,

    marginTop: 3,
  },
});
