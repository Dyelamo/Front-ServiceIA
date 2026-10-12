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

import { fetchProfessionalPublications } from "../../api/requests.api";

import ProfessionalRequestCard from "../../components/ProfessionalRequestCard";

export default function AvailableRequestsScreen({ navigation }) {
  const { isDesktop } = useResponsive();

  const [requests, setRequests] = useState([]);

  const [retrying, setRetrying] = useState(false);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      const data = await fetchProfessionalPublications();

      setRequests(Array.isArray(data) ? data : []);
      setError(false);
    } catch (err) {
      console.error("Error cargando solicitudes profesionales:", err);

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
        <AppHeader title="Solicitudes" maxWidth={layout.content.wide} />

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
        <AppHeader title="Solicitudes" maxWidth={layout.content.wide} />

        <ResponsiveContainer
          maxWidth={layout.content.wide}
          style={styles.container}>
          <ErrorState
            title="No pudimos cargar las solicitudes"
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
      <AppHeader title="Solicitudes" maxWidth={layout.content.wide} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={layout.content.wide}>
          <View style={styles.heading}>
            <Text style={styles.title}>Solicitudes disponibles</Text>

            <Text style={styles.description}>
              Encuentra solicitudes compatibles con tus especialidades y envía
              una propuesta.
            </Text>
          </View>
          {error && requests.length > 0 ? (
            <View style={styles.updateWarning}>
              <Text style={styles.updateWarningTitle}>
                No pudimos actualizar
              </Text>

              <Text style={styles.updateWarningText}>
                Estas son las últimas solicitudes que pudimos cargar. Desliza
                hacia abajo para reintentar.
              </Text>
            </View>
          ) : null}

          {requests.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title="No hay solicitudes disponibles"
              description="Cuando aparezcan solicitudes compatibles con tus especialidades las verás aquí."
            />
          ) : (
            <View style={styles.grid}>
              {requests.map((request) => (
                <View
                  key={request.id}
                  style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                  <ProfessionalRequestCard
                    request={request}
                    onPress={() =>
                      navigation
                        .getParent()
                        ?.navigate("ProfessionalRequestDetail", {
                          request,
                        })
                    }
                  />
                </View>
              ))}
            </View>
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

  description: {
    color: colors.textSecondary,

    fontSize: 14,
    lineHeight: 21,

    marginTop: spacing.xs,

    maxWidth: 620,
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
});
