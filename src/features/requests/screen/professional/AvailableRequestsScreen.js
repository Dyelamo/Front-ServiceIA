import React, {
  useCallback,
  useState,
} from "react";

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  colors,
  spacing,
} from "../../../../theme/index";

import {
  EmptyState,
  ErrorState,
  Skeleton,
} from "../../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../../shared/layout/index";

import {
  fetchProfessionalPublications,
} from "../../api/requests.api";

import ProfessionalRequestCard
  from "../../components/ProfessionalRequestCard";

export default function AvailableRequestsScreen({
  navigation,
}) {
  const [
    requests,
    setRequests,
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

  const loadRequests =
    useCallback(async () => {
      try {
        setError(false);

        const data =
          await fetchProfessionalPublications();

        setRequests(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Error cargando solicitudes profesionales:",
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
      loadRequests();
    }, [loadRequests])
  );

  if (loading) {
    return (
      <Screen>
        <AppHeader
          title="Solicitudes"
        />

        <ResponsiveContainer
          maxWidth={900}
          style={styles.container}
        >
          <Skeleton
            height={160}
            style={styles.skeleton}
          />

          <Skeleton
            height={160}
            style={styles.skeleton}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <AppHeader
          title="Solicitudes"
        />

        <ResponsiveContainer
          maxWidth={900}
          style={styles.container}
        >
          <ErrorState
            title="No pudimos cargar las solicitudes"
            description="Intenta nuevamente."
            onRetry={
              loadRequests
            }
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader
        title="Solicitudes"
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={() => {
              setRefreshing(true);

              loadRequests();
            }}
          />
        }
      >
        <ResponsiveContainer
          maxWidth={900}
          style={styles.container}
        >
          <Text
            style={
              styles.description
            }
          >
            Solicitudes disponibles
            según tus especialidades.
          </Text>

          {requests.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title="No hay solicitudes disponibles"
              description="Cuando aparezcan solicitudes compatibles con tus especialidades las verás aquí."
            />
          ) : (
            requests.map(
              (request) => (
                <ProfessionalRequestCard
                  key={request.id}
                  request={
                    request
                  }
                  onPress={() =>
                    navigation
                      .getParent()
                      ?.navigate(
                        "ProfessionalRequestDetail",
                        {
                          request,
                        }
                      )
                  }
                />
              )
            )
          )}
        </ResponsiveContainer>
      </ScrollView>
    </Screen>
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingVertical:
        spacing.xxl,
    },

    description: {
      color:
        colors.textSecondary,

      fontSize: 14,

      marginBottom:
        spacing.xxl,
    },

    skeleton: {
      marginBottom:
        spacing.md,
    },
  });