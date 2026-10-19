import React, { useCallback, useState } from "react";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { colors, layout, spacing } from "../../../../theme/index";

import { EmptyState, ErrorState, Skeleton } from "../../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../../shared/layout/index";

import { useResponsive } from "../../../../shared/hooks/useResponsive";

import { fetchClientPublications } from "../../api/requests.api";

import RequestCard from "../../components/RequestCard";

export default function ClientRequestsScreen({ navigation }) {
  const { isDesktop } = useResponsive();

  const [requests, setRequests] = useState([]);

  const [retrying, setRetrying] = useState(false);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      const data = await fetchClientPublications();

      setRequests(Array.isArray(data) ? data : []);
      setError(false);
    } catch (err) {
      console.error("Error cargando publicaciones:", err);

      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [loadRequests]),
  );

  const handleRefresh = () => {
    setRefreshing(true);

    loadRequests();
  };

  const handleRetry = async () => {
    setRetrying(true);

    await loadRequests();

    setRetrying(false);
  };

  if (loading) {
    return (
      <Screen>
        <AppHeader title="Mis publicaciones" maxWidth={layout.content.wide} />

        <ResponsiveContainer
          maxWidth={layout.content.wide}
          style={styles.container}>
          <View style={styles.grid}>
            {[1, 2, 3, 4].map((item) => (
              <View
                key={item}
                style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                <Skeleton height={190} />
              </View>
            ))}
          </View>
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error && requests.length === 0) {
    return (
      <Screen>
        <AppHeader title="Mis publicaciones" maxWidth={layout.content.wide} />

        <ResponsiveContainer
          maxWidth={layout.content.wide}
          style={styles.container}>
          <ErrorState
            title="No pudimos cargar tus publicaciones"
            description="Verifica tu conexión e intenta nuevamente."
            onRetry={handleRetry}
            retrying={retrying}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={colors.background}>
      <AppHeader title="Mis publicaciones" maxWidth={layout.content.wide} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={layout.content.wide}>
          {error && requests.length > 0 ? (
            <View style={styles.updateWarning}>
              <Text style={styles.updateWarningTitle}>
                No pudimos actualizar
              </Text>

              <Text style={styles.updateWarningText}>
                Mostramos la última información disponible. Desliza hacia abajo
                para intentarlo nuevamente.
              </Text>
            </View>
          ) : null}
          {requests.length === 0 ? (
            <EmptyState
              icon="document-text-outline"
              title="Todavía no tienes publicaciones"
              description="Cuando publiques una solicitud aparecerá aquí."
              actionLabel="Publicar una solicitud"
              onAction={() => navigation.navigate("CreateRequestDescription")}
            />
          ) : (
            <>
              <View style={styles.heading}>
                <View>
                  <Text style={styles.title}>Tus solicitudes</Text>

                  <Text style={styles.subtitle}>
                    {requests.length}{" "}
                    {requests.length === 1 ? "publicación" : "publicaciones"}
                  </Text>
                </View>
              </View>

              <View style={styles.grid}>
                {requests.map((request) => (
                  <View
                    key={request.id || request.publicacion_id}
                    style={[
                      styles.wrapper,

                      isDesktop && styles.wrapperDesktop,
                    ]}>
                    <RequestCard
                      request={request}
                      onPress={() =>
                        navigation.navigate("RequestDetail", {
                          request,
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

  subtitle: {
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