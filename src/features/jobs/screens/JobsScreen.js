import React, { useCallback, useState } from "react";
import { Alert, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { colors, layout, radius, spacing } from "../../../theme/index";
import { EmptyState, ErrorState, Skeleton } from "../../../shared/ui/index";
import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";
import { useResponsive } from "../../../shared/hooks/useResponsive";
import { queryKeys } from "../../../core/query/query-keys";
import { getApiErrorMessage } from "../../../core/errors/error-message";
import { completeJob, fetchProviderJobs, startJob } from "../api/jobs.api";
import JobCard from "../components/JobCard";

const TABS = [
  { id: "activos", label: "Activos" },
  { id: "completados", label: "Historial Completados" },
];

export default function JobsScreen() {
  const [tab, setTab] = useState("activos");
  const queryClient = useQueryClient();
  const { isDesktop } = useResponsive();

  const {
    data: jobs = [],
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.providerJobs(tab),
    queryFn: async () => {
      const data = await fetchProviderJobs(tab);
      return Array.isArray(data) ? data : [];
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const refreshJobs = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["jobs", "provider"] });
  }, [queryClient]);

  const startMutation = useMutation({
    mutationFn: startJob,
    onSuccess: () => {
      Alert.alert("Trabajo iniciado", "El estado del servicio cambió a 'En progreso'.");
      refreshJobs();
    },
    onError: (error) => {
      Alert.alert(
        "No pudimos iniciar el trabajo",
        getApiErrorMessage(error, "Intenta nuevamente en unos minutos."),
      );
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeJob,
    onSuccess: () => {
      Alert.alert(
        "¡Trabajo finalizado con éxito!",
        "El servicio ha sido completado. El cliente recibirá una solicitud obligatoria de reseña para calificar tu atención.",
      );
      refreshJobs();
    },
    onError: (error) => {
      Alert.alert(
        "No pudimos finalizar el trabajo",
        getApiErrorMessage(error, "Intenta nuevamente en unos minutos."),
      );
    },
  });

  const handleStartJob = (job) => {
    if (startMutation.isPending || completeMutation.isPending) return;
    const jobId = job.publicacion_id || job.id;
    Alert.alert("Iniciar trabajo", "¿Confirmas que ya vas a iniciar este servicio?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Iniciar", onPress: () => startMutation.mutate(jobId) },
    ]);
  };

  const handleCompleteJob = (job) => {
    if (startMutation.isPending || completeMutation.isPending) return;
    const jobId = job.publicacion_id || job.id;
    Alert.alert(
      "Finalizar trabajo",
      "Confirma que el servicio fue completado. Esta acción notificará al cliente.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Finalizar", onPress: () => completeMutation.mutate(jobId) },
      ],
    );
  };

  const refreshing = isFetching && !isLoading;
  const startingId = startMutation.isPending ? startMutation.variables : null;
  const completingId = completeMutation.isPending ? completeMutation.variables : null;

  return (
    <Screen
      scroll
      backgroundColor={colors.background}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}>
      <AppHeader title="Mis trabajos" maxWidth={layout.content.wide} />

      <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.title}>Historial y Trabajos</Text>
          <Text style={styles.subtitle}>
            Gestiona los servicios contratados por clientes en Valledupar y consulta tu historial
            completado.
          </Text>
        </View>

        <View style={styles.tabsWrapper}>
          <View style={styles.tabs}>
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setTab(item.id)}
                  style={[styles.tab, active && styles.activeTab]}>
                  <Text style={[styles.tabText, active && styles.activeTabText]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.grid}>
            {[1, 2].map((i) => (
              <View key={i} style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                <Skeleton height={180} />
              </View>
            ))}
          </View>
        ) : isError && jobs.length === 0 ? (
          <ErrorState
            title="No pudimos cargar tus trabajos"
            description="Verifica tu conexión e intenta nuevamente."
            onRetry={refetch}
            retrying={isFetching}
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="briefcase-outline"
            title={
              tab === "activos"
                ? "No tienes trabajos activos"
                : "No tienes trabajos completados en tu historial"
            }
            description={
              tab === "activos"
                ? "Cuando un cliente acepte una de tus cotizaciones, el trabajo aparecerá aquí."
                : "Los servicios que marques como finalizados aparecerán en este historial junto a las calificaciones de tus clientes."
            }
          />
        ) : (
          <View style={styles.grid}>
            {jobs.map((job) => (
              <View key={job.id} style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                <JobCard
                  job={job}
                  onStart={handleStartJob}
                  onComplete={handleCompleteJob}
                  starting={startingId === (job.publicacion_id || job.id)}
                  completing={completingId === (job.publicacion_id || job.id)}
                />
              </View>
            ))}
          </View>
        )}

        <Text style={styles.hint}>
          {tab === "activos"
            ? "Tip: Al finalizar el trabajo, presiona 'Finalizar trabajo' para que el cliente califique tu labor obligatoriamente."
            : "Este historial refleja la reputación que los clientes construyen sobre tu perfil profesional en ServIA."}
        </Text>
      </ResponsiveContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },
  heading: {
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  tabsWrapper: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: spacing.xl,
  },
  tabs: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabText: {
    color: colors.primaryDark,
    fontWeight: "700",
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
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.md,
    maxWidth: 620,
  },
});
