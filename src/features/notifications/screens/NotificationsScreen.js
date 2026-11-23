import React, { useCallback, useContext, useState } from "react";
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { colors, layout, radius, spacing } from "../../../theme/index";
import { ErrorState, Skeleton } from "../../../shared/ui/index";
import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";
import { useResponsive } from "../../../shared/hooks/useResponsive";
import { queryKeys } from "../../../core/query/query-keys";
import { AppModeContext } from "../../app-mode/context/AppModeContext";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notifications.api";
import { openNotificationDestination } from "../navigation/notification-router";

export default function NotificationsScreen({ navigation }) {
  const { isDesktop } = useResponsive();
  const { mode } = useContext(AppModeContext);
  const [openingId, setOpeningId] = useState(null);
  const queryClient = useQueryClient();
  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: queryKeys.notifications(mode),
    queryFn: () => fetchNotifications(mode),
  });

  const notifications = data?.notificaciones || [];
  const unreadCount = data?.no_leidas || 0;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const updateNotifications = useCallback(
    (updater) => {
      queryClient.setQueryData(queryKeys.notifications(mode), (current) => {
        const safeCurrent = current || { notificaciones: [], no_leidas: 0 };
        return updater(safeCurrent);
      });
    },
    [mode, queryClient],
  );

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_result, variables) => {
      updateNotifications((current) => ({
        ...current,
        notificaciones: current.notificaciones.map((item) =>
          item.id === variables.notificationId ? { ...item, leida: true } : item,
        ),
        no_leidas: Math.max(0, (current.no_leidas || 0) - 1),
      }));
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      updateNotifications((current) => ({
        ...current,
        notificaciones: current.notificaciones.map((item) => ({ ...item, leida: true })),
        no_leidas: 0,
      }));
    },
  });

  const handleMarkAsRead = async (item) => {
    if (!item.leida) {
      try {
        await markAsReadMutation.mutateAsync({ notificationId: item.id, role: mode });
      } catch (err) {
        console.error("Error marcando notificación como leída:", err);
        return;
      }
    }

    try {
      setOpeningId(item.id);
      await openNotificationDestination({ notification: item, mode, navigation });
    } catch (err) {
      console.error("Error abriendo la notificación:", err);
      Alert.alert(
        "No pudimos abrir el destino",
        err?.response?.data?.detail ||
          err?.message ||
          "El contenido puede haber cambiado o ya no estar disponible.",
      );
    } finally {
      setOpeningId(null);
    }
  };

  const handleMarkAllAsRead = () => {
    if (!markAllMutation.isPending && unreadCount > 0) {
      markAllMutation.mutate(mode);
    }
  };

  const refreshing = isFetching && !isLoading;

  return (
    <Screen backgroundColor={colors.background}>
      <AppHeader
        title={mode === "profesional" ? "Notificaciones profesionales" : "Notificaciones"}
        maxWidth={layout.content.medium}
        action={
          unreadCount > 0 ? (
            <Pressable
              onPress={handleMarkAllAsRead}
              disabled={markAllMutation.isPending}
              style={styles.markAllButton}>
              <Ionicons name="checkmark-done-outline" size={18} color={colors.primary} />
              <Text style={styles.markAllText}>Marcar leídas</Text>
            </Pressable>
          ) : null
        }
      />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={layout.content.medium} style={styles.container}>
          {isLoading ? (
            <View style={styles.skeletonContainer}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height={85} style={styles.skeletonItem} />
              ))}
            </View>
          ) : isError && notifications.length === 0 ? (
            <ErrorState
              title="No pudimos cargar tus notificaciones"
              description="Verifica tu conexión e intenta nuevamente."
              onRetry={refetch}
              retrying={isFetching}
            />
          ) : notifications.length === 0 ? (
            <View style={[styles.empty, isDesktop && styles.emptyDesktop]}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications-outline" size={38} color={colors.primary} />
              </View>

              <Text style={styles.title}>No tienes notificaciones</Text>

              <Text style={styles.description}>
                Te avisaremos en tiempo real cuando recibas propuestas, tu servicio sea aceptado o
                calificado.
              </Text>
            </View>
          ) : (
            <View>
              {unreadCount > 0 ? (
                <View style={styles.unreadBanner}>
                  <Ionicons name="sparkles" size={16} color={colors.primaryDark} />
                  <Text style={styles.unreadBannerText}>
                    Tienes {unreadCount}{" "}
                    {unreadCount === 1 ? "novedad sin leer" : "novedades sin leer"}
                  </Text>
                </View>
              ) : null}

              <View style={styles.list}>
                {notifications.map((item) => {
                  const meta = getNotificationMeta(item.tipo);
                  return (
                    <Pressable
                      key={item.id}
                      disabled={openingId === item.id}
                      onPress={() => handleMarkAsRead(item)}
                      style={({ pressed }) => [
                        styles.notificationCard,
                        !item.leida && styles.notificationCardUnread,
                        pressed && styles.notificationCardPressed,
                        openingId === item.id && styles.notificationCardOpening,
                      ]}>
                      <View style={[styles.typeIconContainer, { backgroundColor: meta.bgColor }]}>
                        <Ionicons name={meta.icon} size={22} color={meta.color} />
                      </View>

                      <View style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                          <Text style={[styles.cardTitle, !item.leida && styles.cardTitleUnread]}>
                            {item.titulo}
                          </Text>
                          {!item.leida ? <View style={styles.unreadDot} /> : null}
                        </View>

                        <Text style={styles.cardMessage} numberOfLines={3}>
                          {item.mensaje}
                        </Text>

                        <View style={styles.cardFooter}>
                          <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                          <Text style={styles.cardTime}>{formatTimeAgo(item.created_at)}</Text>
                          {item.data?.destination || item.referencia_id ? (
                            <Text style={styles.cardActionHint}>• Abrir</Text>
                          ) : null}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </Screen>
  );
}

function getNotificationMeta(tipo) {
  switch (tipo) {
    case "oferta_recibida":
      return {
        icon: "paper-plane",
        color: "#0284C7",
        bgColor: "#E0F2FE",
      };
    case "oferta_aceptada":
      return {
        icon: "checkmark-circle",
        color: "#16A34A",
        bgColor: "#DCFCE7",
      };
    case "postulacion_retirada":
      return {
        icon: "arrow-undo-outline",
        color: "#B45309",
        bgColor: "#FEF3C7",
      };
    case "servicio_iniciado":
      return {
        icon: "play-circle",
        color: "#0284C7",
        bgColor: "#E0F2FE",
      };
    case "servicio_completado":
      return {
        icon: "checkbox",
        color: "#7C3AED",
        bgColor: "#EDE9FE",
      };
    case "finalizacion_pendiente":
      return {
        icon: "hourglass",
        color: "#B45309",
        bgColor: "#FEF3C7",
      };
    case "calificacion_recibida":
      return {
        icon: "star",
        color: "#D97706",
        bgColor: "#FEF3C7",
      };
    case "servicio_cancelado":
      return {
        icon: "close-circle",
        color: "#B91C1C",
        bgColor: "#FEE2E2",
      };
    default:
      return {
        icon: "notifications",
        color: colors.primary,
        bgColor: colors.primaryLight,
      };
  }
}

function formatTimeAgo(dateString) {
  if (!dateString) return "Reciente";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "Hace un momento";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
  }).format(date);
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: spacing.lg,
  },
  container: {
    flex: 1,
  },
  skeletonContainer: {
    gap: spacing.md,
  },
  skeletonItem: {
    borderRadius: radius.md,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  unreadBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  unreadBannerText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  list: {
    gap: spacing.sm,
  },
  notificationCard: {
    flexDirection: "row",
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "flex-start",
  },
  notificationCardUnread: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  notificationCardPressed: {
    opacity: 0.7,
  },
  notificationCardOpening: {
    opacity: 0.6,
  },
  typeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  cardTitleUnread: {
    fontWeight: "800",
    color: colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
  cardMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.sm,
  },
  cardTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  cardActionHint: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 4,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  emptyDesktop: {
    minHeight: 360,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 320,
  },
});
