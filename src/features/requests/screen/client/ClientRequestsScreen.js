import React, { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, spacing } from "../../../../theme/index";

import { EmptyState, ErrorState, Skeleton } from "../../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../../shared/layout/index";

import { fetchClientPublications } from "../../api/requests.api";

import RequestCard from "../../components/RequestCard";

export default function ClientRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      setError(false);

      const data = await fetchClientPublications();

      setRequests(data);
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

  if (loading) {
    return (
      <Screen>
        <AppHeader title="Mis publicaciones" />

        <ResponsiveContainer maxWidth={900} style={styles.container}>
          <Skeleton height={150} style={styles.skeleton} />

          <Skeleton height={150} style={styles.skeleton} />

          <Skeleton height={150} />
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <AppHeader title="Mis publicaciones" />

        <ResponsiveContainer maxWidth={900} style={styles.container}>
          <ErrorState
            title="No pudimos cargar tus publicaciones"
            description="Verifica tu conexión e intenta nuevamente."
            onRetry={loadRequests}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader title="Mis publicaciones" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={900}>
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
              <Text style={styles.subtitle}>
                {requests.length}{" "}
                {requests.length === 1 ? "publicación" : "publicaciones"}
              </Text>

              <View style={styles.list}>
                {requests.map((request) => (
                  <RequestCard
                    key={request.id || request.publicacion_id}
                    request={request}
                    onPress={() =>
                      navigation.navigate("RequestDetail", {
                        request,
                      })
                    }
                  />
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

  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.lg,
  },

  list: {
    width: "100%",
  },

  skeleton: {
    marginBottom: spacing.md,
  },
});
