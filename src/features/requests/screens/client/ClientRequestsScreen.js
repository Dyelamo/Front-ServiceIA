import React, { useCallback, useMemo, useState } from "react";

import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { colors, layout, spacing } from "../../../../theme/index";

import { EmptyState, ErrorState, Input, Skeleton } from "../../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../../shared/layout/index";

import { useResponsive } from "../../../../shared/hooks/useResponsive";

import { fetchClientPublications } from "../../api/requests.api";
import { queryKeys } from "../../../../core/query/query-keys";

import RequestCard from "../../components/RequestCard";

const STATUS_FILTERS = [
  { id: "todos", label: "Todas", statuses: null },
  { id: "abiertas", label: "Abiertas", statuses: ["activo", "publicada", "con_ofertas"] },
  {
    id: "curso",
    label: "En curso",
    statuses: ["acuerdo", "en_progreso", "pendiente_confirmacion"],
  },
  {
    id: "completadas",
    label: "Completadas",
    statuses: ["terminado", "completado", "completada"],
  },
  { id: "canceladas", label: "Canceladas", statuses: ["cancelado", "cancelada"] },
];

export default function ClientRequestsScreen({ navigation }) {
  const { isDesktop } = useResponsive();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const {
    data: requests = [],
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.clientRequests,
    queryFn: async () => {
      const data = await fetchClientPublications();
      return Array.isArray(data) ? data : [];
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const refreshing = isFetching && !isLoading;
  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es");
    const selectedFilter = STATUS_FILTERS.find((filter) => filter.id === statusFilter);

    return requests.filter((request) => {
      const matchesStatus =
        !selectedFilter?.statuses || selectedFilter.statuses.includes(request.status);
      const searchableText = [request.description, request.categoryName, request.location]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("es");

      return matchesStatus && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });
  }, [requests, search, statusFilter]);

  if (isLoading) {
    return (
      <Screen>
        <AppHeader title="Mis publicaciones" maxWidth={layout.content.wide} />

        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          <View style={styles.grid}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                <Skeleton height={190} />
              </View>
            ))}
          </View>
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (isError && requests.length === 0) {
    return (
      <Screen>
        <AppHeader title="Mis publicaciones" maxWidth={layout.content.wide} />

        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          <ErrorState
            title="No pudimos cargar tus publicaciones"
            description="Verifica tu conexión e intenta nuevamente."
            onRetry={refetch}
            retrying={isFetching}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={colors.background}>
      <AppHeader title="Mis publicaciones" maxWidth={layout.content.wide} />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={layout.content.wide}>
          <View style={styles.filters}>
            <Input
              accessibilityLabel="Buscar publicaciones"
              placeholder="Buscar por servicio, descripción o ubicación"
              value={search}
              onChangeText={setSearch}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChips}>
              {STATUS_FILTERS.map((filter) => {
                const selected = statusFilter === filter.id;

                return (
                  <Pressable
                    key={filter.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setStatusFilter(filter.id)}
                    style={[styles.filterChip, selected && styles.filterChipSelected]}>
                    <Text
                      style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
                      {filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {isError && requests.length > 0 ? (
            <View style={styles.updateWarning}>
              <Text style={styles.updateWarningTitle}>No pudimos actualizar</Text>

              <Text style={styles.updateWarningText}>
                Mostramos la última información disponible. Desliza hacia abajo para intentarlo
                nuevamente.
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
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title="No encontramos coincidencias"
              description="Prueba con otra búsqueda o cambia el filtro seleccionado."
              actionLabel="Limpiar filtros"
              onAction={() => {
                setSearch("");
                setStatusFilter("todos");
              }}
            />
          ) : (
            <>
              <View style={styles.heading}>
                <View>
                  <Text style={styles.title}>Tus solicitudes</Text>

                  <Text style={styles.subtitle}>
                    {filteredRequests.length}{" "}
                    {filteredRequests.length === 1 ? "publicación" : "publicaciones"}
                  </Text>
                </View>
              </View>

              <View style={styles.grid}>
                {filteredRequests.map((request) => (
                  <View
                    key={request.id || request.publicacion_id}
                    style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
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

  filters: {
    marginBottom: spacing.xl,
  },

  filterChips: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },

  filterChip: {
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },

  filterChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  filterChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  filterChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
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
