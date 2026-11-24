import React, { useCallback, useMemo, useState } from "react";

import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { colors, layout, spacing } from "../../../../theme/index";

import { EmptyState, ErrorState, Input, Skeleton } from "../../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../../shared/layout/index";

import { useResponsive } from "../../../../shared/hooks/useResponsive";

import { fetchProfessionalPublications } from "../../api/requests.api";
import { queryKeys } from "../../../../core/query/query-keys";

import ProfessionalRequestCard from "../../components/ProfessionalRequestCard";
import { useProfessionalAvailability } from "../../../professional/hooks/useProfessionalAvailability";
import ProfessionalNotificationButton from "../../../notifications/components/ProfessionalNotificationButton";

export default function AvailableRequestsScreen({ navigation }) {
  const { isDesktop } = useResponsive();
  const { isAvailable } = useProfessionalAvailability();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");

  const {
    data: requests = [],
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.professionalRequests,
    queryFn: async () => {
      const data = await fetchProfessionalPublications();
      return Array.isArray(data) ? data : [];
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const refreshing = isFetching && !isLoading;
  const categoryOptions = useMemo(
    () => ["Todas", ...new Set(requests.map((request) => request.categoryName).filter(Boolean))],
    [requests],
  );
  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es-CO");
    return requests.filter((request) => {
      const matchesCategory = category === "Todas" || request.categoryName === category;
      const searchableText = [
        request.description,
        request.descripcion,
        request.categoryName,
        request.location,
        request.barrio,
        request.direccion,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("es-CO");
      return matchesCategory && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });
  }, [category, requests, search]);

  if (isLoading) {
    return (
      <Screen>
        <AppHeader
          title="Solicitudes"
          maxWidth={layout.content.wide}
          action={<ProfessionalNotificationButton navigation={navigation} />}
        />

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
        <AppHeader
          title="Solicitudes"
          maxWidth={layout.content.wide}
          action={<ProfessionalNotificationButton navigation={navigation} />}
        />

        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          <ErrorState
            title="No pudimos cargar las solicitudes"
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
      <AppHeader
        title="Solicitudes"
        maxWidth={layout.content.wide}
        action={<ProfessionalNotificationButton navigation={navigation} />}
      />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={layout.content.wide}>
          {!isAvailable ? (
            <View style={styles.busyNotice}>
              <Text style={styles.busyNoticeTitle}>Tienes un servicio activo</Text>
              <Text style={styles.busyNoticeText}>
                Puedes consultar las solicitudes, pero no enviar nuevas ofertas hasta completar o
                cancelar el servicio actual.
              </Text>
            </View>
          ) : null}
          <View style={styles.heading}>
            <Text style={styles.title}>Solicitudes disponibles</Text>

            <Text style={styles.description}>
              Encuentra solicitudes compatibles con tus especialidades y envía una propuesta.
            </Text>
          </View>
          {requests.length > 0 ? (
            <View style={styles.filters}>
              <Input
                label="Buscar solicitudes"
                placeholder="Servicio, barrio o descripción"
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryFilters}>
                {categoryOptions.map((option) => {
                  const active = option === category;
                  return (
                    <Pressable
                      key={option}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      onPress={() => setCategory(option)}
                      style={[styles.filterChip, active && styles.filterChipActive]}>
                      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
          {isError && requests.length > 0 ? (
            <View style={styles.updateWarning}>
              <Text style={styles.updateWarningTitle}>No pudimos actualizar</Text>

              <Text style={styles.updateWarningText}>
                Estas son las últimas solicitudes que pudimos cargar. Desliza hacia abajo para
                reintentar.
              </Text>
            </View>
          ) : null}

          {requests.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title="No hay solicitudes disponibles"
              description="Cuando aparezcan solicitudes compatibles con tus especialidades las verás aquí."
            />
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              icon="options-outline"
              title="No encontramos coincidencias"
              description="Prueba con otro término o selecciona una categoría diferente."
            />
          ) : (
            <View style={styles.grid}>
              {filteredRequests.map((request) => (
                <View key={request.id} style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                  <ProfessionalRequestCard
                    request={request}
                    onPress={() =>
                      navigation.getParent()?.navigate("ProfessionalRequestDetail", {
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

  busyNotice: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 12,
  },
  busyNoticeTitle: {
    color: "#9A3412",
    fontSize: 14,
    fontWeight: "800",
  },
  busyNoticeText: {
    color: "#9A3412",
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
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
  filters: {
    marginBottom: spacing.xl,
    maxWidth: 680,
  },
  categoryFilters: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: colors.primaryDark,
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
