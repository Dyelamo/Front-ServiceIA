import React, {
  useCallback,
  useState,
} from "react";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  colors,
  layout,
  spacing,
} from "../../../theme/index";

import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout/index";

import {
  useResponsive,
} from "../../../shared/hooks/useResponsive";

import {
  fetchProfessionalOffersWithPublications,
} from "../api/offers.api";

import OfferCard
  from "../components/OfferCard";

export default function ProfessionalOffersScreen() {
  const {
    isDesktop,
  } = useResponsive();

  const [
    offers,
    setOffers,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState(false);

  const loadOffers =
    useCallback(async () => {
      try {
        setError(false);

        const data =
          await fetchProfessionalOffersWithPublications();

        setOffers(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Error cargando ofertas:",
          err
        );

        setError(true);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadOffers();
    }, [loadOffers])
  );

  const handleRefresh = () => {
    setRefreshing(true);

    loadOffers();
  };

  if (loading) {
    return (
      <Screen>
        <AppHeader
          title="Ofertas enviadas"
          maxWidth={
            layout.content.wide
          }
        />

        <ResponsiveContainer
          maxWidth={
            layout.content.wide
          }
          style={styles.container}
        >
          <View style={styles.grid}>
            {[1, 2, 3, 4].map(
              (item) => (
                <View
                  key={item}
                  style={[
                    styles.wrapper,

                    isDesktop &&
                      styles.wrapperDesktop,
                  ]}
                >
                  <Skeleton
                    height={260}
                  />
                </View>
              )
            )}
          </View>
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <AppHeader
          title="Ofertas enviadas"
          maxWidth={
            layout.content.wide
          }
        />

        <ResponsiveContainer
          maxWidth={
            layout.content.wide
          }
          style={styles.container}
        >
          <ErrorState
            title="No pudimos cargar tus ofertas"
            description="Intenta nuevamente."
            onRetry={
              loadOffers
            }
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen
      backgroundColor={
        colors.background
      }
    >
      <AppHeader
        title="Ofertas enviadas"
        maxWidth={
          layout.content.wide
        }
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
          />
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <ResponsiveContainer
          maxWidth={
            layout.content.wide
          }
        >
          {offers.length === 0 ? (
            <EmptyState
              icon="paper-plane-outline"
              title="Aún no has enviado ofertas"
              description="Las propuestas que envíes aparecerán aquí."
            />
          ) : (
            <>
              <View
                style={styles.heading}
              >
                <Text
                  style={styles.title}
                >
                  Mis ofertas
                </Text>

                <Text
                  style={
                    styles.description
                  }
                >
                  {offers.length}{" "}
                  {offers.length === 1
                    ? "oferta enviada"
                    : "ofertas enviadas"}
                </Text>
              </View>

              <View style={styles.grid}>
                {offers.map(
                  (offer) => (
                    <View
                      key={offer.id}
                      style={[
                        styles.wrapper,

                        isDesktop &&
                          styles.wrapperDesktop,
                      ]}
                    >
                      <OfferCard
                        offer={offer}
                      />
                    </View>
                  )
                )}
              </View>
            </>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical:
      spacing.xxl,
  },

  scrollContent: {
    paddingVertical:
      spacing.xxl,
  },

  heading: {
    marginBottom:
      spacing.xl,
  },

  title: {
    color: colors.text,

    fontSize: 24,
    fontWeight: "800",
  },

  description: {
    color:
      colors.textSecondary,

    fontSize: 14,

    marginTop:
      spacing.xs,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  wrapper: {
    width: "100%",

    padding: 6,

    marginBottom:
      spacing.sm,
  },

  wrapperDesktop: {
    width: "50%",
  },
});