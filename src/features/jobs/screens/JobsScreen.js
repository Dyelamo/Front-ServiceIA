import React, { useCallback, useState } from "react";
import { Platform, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { colors, layout, radius, spacing } from "../../../theme/index";
import { EmptyState, ErrorState, Skeleton } from "../../../shared/ui/index";
import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";
import { useResponsive } from "../../../shared/hooks/useResponsive";
import { useAlertModal } from "../../../core/alerts/AlertModalContext";
import { queryKeys } from "../../../core/query/query-keys";
import { getApiErrorMessage } from "../../../core/errors/error-message";
import { cancelJob, completeJob, fetchProviderJobs, startJob } from "../api/jobs.api";
import JobCard from "../components/JobCard";
import CancellationModal from "../components/CancellationModal";
import ProfessionalNotificationButton from "../../notifications/components/ProfessionalNotificationButton";

const TABS = [
  { id: "activos", label: "Activos" },
  { id: "historial", label: "Historial" },
];

export default function JobsScreen({ navigation }) {
  const [tab, setTab] = useState("activos");
  const [jobToCancel, setJobToCancel] = useState(null);
  const queryClient = useQueryClient();
  const { isDesktop } = useResponsive();
  const { showAlert, showConfirm } = useAlertModal();

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
    refetchInterval: tab === "activos" ? 15_000 : false,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const refreshJobs = useCallback(() => {
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["jobs", "provider"] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.professionalProfile }),
      queryClient.invalidateQueries({ queryKey: queryKeys.professionalOffers }),
      queryClient.invalidateQueries({ queryKey: queryKeys.clientRequests }),
      queryClient.invalidateQueries({ queryKey: ["conversations"] }),
    ]);
  }, [queryClient]);

  const startMutation = useMutation({
    mutationFn: startJob,
    onSuccess: () => {
      showAlert({
        title: "Trabajo iniciado",
        message: "El estado del servicio cambió a 'En progreso'.",
        variant: "success",
      });
      refreshJobs();
    },
    onError: (error) => {
      showAlert({
        title: "No pudimos iniciar el trabajo",
        message: getApiErrorMessage(error, "Intenta nuevamente en unos minutos."),
        variant: "error",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeJob,
    onSuccess: () => {
      showAlert({
        title: "Trabajo marcado como realizado",
        message:
          "El cliente debe confirmar que el servicio terminó. Hasta entonces seguirá apareciendo como trabajo activo.",
        variant: "success",
      });
      refreshJobs();
    },
    onError: (error) => {
      showAlert({
        title: "No pudimos finalizar el trabajo",
        message: getApiErrorMessage(error, "Intenta nuevamente en unos minutos."),
        variant: "error",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelJob,
    onSuccess: () => {
      setJobToCancel(null);
      showAlert({
        title: "Servicio cancelado",
        message: "La otra persona fue notificada y el chat se cerró.",
        variant: "info",
      });
      refreshJobs();
    },
    onError: (error) => {
      showAlert({
        title: "No pudimos cancelar el servicio",
        message: getApiErrorMessage(error, "Intenta nuevamente en unos minutos."),
        variant: "error",
      });
    },
  });

  const handleStartJob = (job) => {
    if (startMutation.isPending || completeMutation.isPending || cancelMutation.isPending) return;
    const jobId = job.publicacion_id || job.id;
    showConfirm({
      title: "Iniciar trabajo",
      message: "¿Confirmas que ya vas a iniciar este servicio?",
      confirmLabel: "Iniciar",
      cancelLabel: "Volver",
      variant: "info",
      onConfirm: () => startMutation.mutate(jobId),
    });
  };

  const handleCompleteJob = (job) => {
    if (startMutation.isPending || completeMutation.isPending || cancelMutation.isPending) return;
    const jobId = job.publicacion_id || job.id;
    showConfirm({
      title: "Marcar trabajo como realizado",
      message:
        "El cliente será notificado y deberá confirmar que el servicio terminó. Seguirás ocupado hasta su confirmación.",
      confirmLabel: "Marcar realizado",
      cancelLabel: "Volver",
      variant: "info",
      onConfirm: () => completeMutation.mutate(jobId),
    });
  };

  const handleOpenCancellation = (job) => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.activeElement?.blur?.();
    }
    setJobToCancel(job);
  };

  const refreshing = isFetching && !isLoading;
  const startingId = startMutation.isPending ? startMutation.variables : null;
  const completingId = completeMutation.isPending ? completeMutation.variables : null;
  const cancellingId = cancelMutation.isPending ? cancelMutation.variables?.publicationId : null;

  return (
    <Screen
      scroll
      backgroundColor={colors.background}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}>
      <AppHeader
        title="Mis trabajos"
        maxWidth={layout.content.wide}
        action={<ProfessionalNotificationButton navigation={navigation} />}
      />

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
                : "Aún no tienes trabajos en tu historial"
            }
            description={
              tab === "activos"
                ? "Cuando un cliente acepte una de tus cotizaciones, el trabajo aparecerá aquí."
                : "Los servicios completados o cancelados aparecerán aquí con su estado y detalles."
            }
          />
        ) : (
          <View style={styles.grid}>
            {jobs.map((job) => (
              <View key={job.id} style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                <JobCard
                  job={job}
                  onRoute={(selectedJob) =>
                    navigation.getParent()?.navigate("ServiceRoute", {
                      publicationId: selectedJob.publicacion_id || selectedJob.id,
                    })
                  }
                  onStart={handleStartJob}
                  onComplete={handleCompleteJob}
                  onCancel={handleOpenCancellation}
                  starting={startingId === (job.publicacion_id || job.id)}
                  completing={completingId === (job.publicacion_id || job.id)}
                  cancelling={cancellingId === (job.publicacion_id || job.id)}
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

      <CancellationModal
        visible={Boolean(jobToCancel)}
        loading={cancelMutation.isPending}
        onClose={() => !cancelMutation.isPending && setJobToCancel(null)}
        onConfirm={(reason) =>
          cancelMutation.mutate({
            publicationId: jobToCancel?.publicacion_id || jobToCancel?.id,
            reason,
          })
        }
      />
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
