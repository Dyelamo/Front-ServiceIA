import React, { useCallback, useState, useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { colors, layout, spacing } from "../../../theme/index";

import { EmptyState, ErrorState, Skeleton } from "../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

import { fetchProfessionalOffersWithPublications } from "../api/offers.api";

import OfferCard from "../components/OfferCard";

export default function ProfessionalOffersScreen({ navigation, route }) {
  const { isDesktop } = useResponsive();

  const [showSuccess, setShowSuccess] = useState(false);

  const [offers, setOffers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [retrying, setRetrying] = useState(false);

  const [error, setError] = useState(false);

  const loadOffers = useCallback(async () => {
    try {
      const data = await fetchProfessionalOffersWithPublications();

      setOffers(Array.isArray(data) ? data : []);
      setError(false);
    } catch (err) {
      console.error("Error cargando ofertas:", err);

      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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
      loadOffers();
    }, [loadOffers]),
  );

  const handleRefresh = () => {
    setRefreshing(true);

    loadOffers();
  };

  const handleRetry = async () => {
    setRetrying(true);

    await loadOffers();

    setRetrying(false);
  };

  if (loading) {
    return (
      <Screen>
        <AppHeader title="Ofertas enviadas" maxWidth={layout.content.wide} />
        {showSuccess ? (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={22} color="#15803D" />

            <View style={styles.successContent}>
              <Text style={styles.successTitle}>Oferta enviada</Text>

              <Text style={styles.successText}>
                Tu propuesta fue enviada correctamente al cliente.
              </Text>
            </View>
          </View>
        ) : null}
        <ResponsiveContainer
          maxWidth={layout.content.wide}
          style={styles.container}>
          {showSuccess ? <OfferSentBanner /> : null}
          <View style={styles.grid}>
            {[1, 2, 3, 4].map((item) => (
              <View
                key={item}
                style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                <Skeleton height={260} />
              </View>
            ))}
          </View>
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error && offers.length === 0) {
    return (
      <Screen>
        <AppHeader title="Ofertas enviadas" maxWidth={layout.content.wide} />

        <ResponsiveContainer
          maxWidth={layout.content.wide}
          style={styles.container}>
          {showSuccess ? <OfferSentBanner /> : null}
          <ErrorState
            title="No pudimos cargar tus ofertas"
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
      <AppHeader title="Ofertas enviadas" maxWidth={layout.content.wide} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={layout.content.wide}>
          {showSuccess ? <OfferSentBanner /> : null}
          {error && offers.length > 0 ? (
            <View style={styles.updateWarning}>
              <Text style={styles.updateWarningTitle}>
                No pudimos actualizar
              </Text>

              <Text style={styles.updateWarningText}>
                Tus ofertas siguen visibles con la última información
                disponible.
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
                  {offers.length}{" "}
                  {offers.length === 1 ? "oferta enviada" : "ofertas enviadas"}
                </Text>
              </View>

              <View style={styles.grid}>
                {offers.map((offer) => (
                  <View
                    key={offer.id}
                    style={[
                      styles.wrapper,

                      isDesktop && styles.wrapperDesktop,
                    ]}>
                    <OfferCard offer={offer} />
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

        <Text style={styles.successText}>
          Tu propuesta fue enviada correctamente al cliente.
        </Text>
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
