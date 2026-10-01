import React, { useCallback, useState } from "react";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { colors, radius, spacing } from "../../../theme/index";

import { EmptyState, ErrorState, Skeleton } from "../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout/index";

import {
  fetchProfessionalOffersWithPublications,
} from "../api/offers.api";

import OfferCard from "../components/OfferCard";

export default function ProfessionalOffersScreen() {
  const [offers, setOffers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(false);

  const loadOffers = useCallback(async () => {
    try {
      setError(false);

      const data = await fetchProfessionalOffersWithPublications();

      console.log("OFERTAS PROFESIONAL:", data);

      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando ofertas:", err);

      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOffers();
    }, [loadOffers]),
  );

  if (loading) {
    return (
      <Screen>
        <AppHeader title="Ofertas enviadas" />

        <ResponsiveContainer maxWidth={900} style={styles.container}>
          <Skeleton height={140} style={styles.skeleton} />

          <Skeleton height={140} />
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <AppHeader title="Ofertas enviadas" />

        <ResponsiveContainer maxWidth={900} style={styles.container}>
          <ErrorState
            title="No pudimos cargar tus ofertas"
            onRetry={loadOffers}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader title="Ofertas enviadas" />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadOffers();
            }}
          />
        }>
        <ResponsiveContainer maxWidth={900} style={styles.container}>
          {offers.length === 0 ? (
            <EmptyState
              icon="paper-plane-outline"
              title="Aún no has enviado ofertas"
              description="Las propuestas que envíes aparecerán aquí."
            />
          ) : (
            offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
          )}
        </ResponsiveContainer>
      </ScrollView>
    </Screen>
  );
}

function OfferItem({ offer }) {
  const price = offer.precio_ofertado ?? offer.precio ?? offer.price;

  const availability =
    offer.disponibilidad ?? offer.availability ?? "No especificada";

  const message = offer.mensaje ?? offer.message ?? "";

  const status = offer.estado ?? offer.status ?? "pendiente";

  return (
    <View style={styles.offerCard}>
      <View style={styles.offerHeader}>
        <Text style={styles.offerPrice}>{formatCurrency(price)}</Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <Text style={styles.availability}>Disponibilidad: {availability}</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

function formatCurrency(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "$0";
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(number);
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },

  skeleton: {
    marginBottom: spacing.md,
  },

  offerCard: {
    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.lg,

    padding: spacing.lg,

    marginBottom: spacing.md,
  },

  offerHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  offerPrice: {
    color: colors.text,

    fontSize: 20,
    fontWeight: "800",
  },

  statusBadge: {
    backgroundColor: colors.primaryLight,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.xs,

    borderRadius: radius.pill,
  },

  statusText: {
    color: colors.primaryDark,

    fontWeight: "700",
    fontSize: 12,
    textTransform: "capitalize",
  },

  availability: {
    color: colors.textSecondary,

    marginTop: spacing.md,

    fontSize: 13,
  },

  message: {
    color: colors.text,

    marginTop: spacing.md,

    fontSize: 14,
    lineHeight: 20,
  },
});
