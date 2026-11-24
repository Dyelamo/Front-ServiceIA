import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme/index";
import { Avatar, Badge, Button, Card } from "../../../shared/ui/index";
import { formatCOP } from "../../../utils";
import { resolveCategoryIcon } from "../../catalog/utils/category-presentation";
import { formatDistance } from "../../location/location";

export default function JobCard({
  job,
  onStart,
  onComplete,
  onCancel,
  onRoute,
  starting = false,
  completing = false,
  cancelling = false,
}) {
  const isCompleted = job.estado === "terminado" || job.status === "Completado";
  const isCancelled = job.estado === "cancelado" || job.status === "Cancelado";
  const isInProgress = job.estado === "en_progreso" || job.status === "En camino";
  const isAwaitingConfirmation =
    job.estado === "pendiente_confirmacion" || job.status === "Pendiente de confirmación";
  const isAgreed = job.estado === "acuerdo" || job.status === "Acuerdo";
  const canStart = job.can_start ?? isAgreed;
  const canComplete = job.can_complete ?? isInProgress;
  const canCancel = job.can_cancel ?? (isAgreed || isInProgress || isAwaitingConfirmation);

  return (
    <Card variant="outlined" style={styles.card}>
      <View style={styles.categoryRow}>
        <View style={styles.categoryIcon}>
          <Ionicons
            name={resolveCategoryIcon(job.categoria?.id || job.categoria_id, job.categoria?.nombre)}
            size={18}
            color={colors.primary}
          />
        </View>
        <Text style={styles.categoryName}>{job.categoria?.nombre || "Servicio"}</Text>
      </View>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.client}>Cliente: {job.client}</Text>
        </View>

        <Badge
          label={
            isCompleted
              ? "Completado"
              : isCancelled
                ? "Cancelado"
                : isAwaitingConfirmation
                  ? "Pendiente del cliente"
                  : isInProgress
                    ? "En progreso"
                    : "Acuerdo"
          }
          type={isCompleted ? "success" : isCancelled ? "error" : "warning"}
        />
      </View>

      <View style={styles.clientPanel}>
        <Avatar
          source={job.cliente?.foto_perfil}
          name={job.cliente?.nombre_completo || job.client || "Cliente"}
          size={42}
        />
        <View style={styles.clientPanelCopy}>
          <Text style={styles.clientLabel}>Servicio con</Text>
          <Text numberOfLines={1} style={styles.clientName}>
            {job.cliente?.nombre_completo || job.client || "Cliente"}
          </Text>
          {job.cliente?.telefono ? (
            <Text style={styles.clientPhone}>{job.cliente.telefono}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={styles.metaText}>{job.location || job.direccion || "Valledupar"}</Text>
        </View>
        {job.referencia ? (
          <View style={styles.metaItem}>
            <Ionicons name="flag-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>{job.referencia}</Text>
          </View>
        ) : null}
        {Number.isFinite(job.distancia_km) ? (
          <View style={styles.metaItem}>
            <Ionicons name="navigate-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>{formatDistance(job.distancia_km)}</Text>
          </View>
        ) : null}

        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>{job.schedule || "Disponibilidad acordada"}</Text>
        </View>

        {job.completed_at || job.cancelled_at || job.started_at ? (
          <View style={styles.metaItem}>
            <Ionicons
              name={isCancelled ? "close-circle-outline" : "checkmark-circle-outline"}
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.metaText}>
              {isCompleted
                ? `Finalizado ${formatJobDate(job.completed_at)}`
                : isCancelled
                  ? `Cancelado ${formatJobDate(job.cancelled_at)}`
                  : `Iniciado ${formatJobDate(job.started_at)}`}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Si ya está completado y tiene reseña, mostramos la reseña */}
      {isCompleted && job.resena ? (
        <View style={styles.reviewBox}>
          <View style={styles.reviewStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= job.resena.calificacion ? "star" : "star-outline"}
                size={16}
                color="#F59E0B"
              />
            ))}
            <Text style={styles.reviewScore}>{job.resena.calificacion}.0 / 5.0</Text>
          </View>
          <Text style={styles.reviewComment}>{`"${job.resena.comentario}"`}</Text>
        </View>
      ) : isCompleted ? (
        <View style={styles.reviewPendingBox}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.reviewPendingText}>
            Esperando calificación obligatoria del cliente
          </Text>
        </View>
      ) : null}

      {isCancelled ? (
        <View style={styles.cancelledBox}>
          <Ionicons name="close-circle-outline" size={17} color="#B91C1C" />
          <View style={styles.cancelledCopy}>
            <Text style={styles.cancelledTitle}>Servicio cancelado</Text>
            <Text style={styles.cancelledText}>
              {job.cancellation_reason || "No se indicó un motivo."}
            </Text>
          </View>
        </View>
      ) : null}

      {isAwaitingConfirmation ? (
        <View style={styles.confirmationBox}>
          <Ionicons name="hourglass-outline" size={17} color="#9A3412" />
          <Text style={styles.confirmationText}>
            Marcaste el trabajo como realizado. El servicio seguirá activo hasta que el cliente lo
            confirme.
          </Text>
        </View>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Precio acordado</Text>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.price}>
          {formatCOP(job.price || job.precio_ofertado)}
        </Text>
      </View>

      <View style={styles.actions}>
        {!isCompleted && !isCancelled && onRoute ? (
          <Button
            variant="outline"
            size="sm"
            onPress={() => onRoute(job)}
            leftIcon={<Ionicons name="map-outline" size={16} color={colors.primary} />}>
            Ver ubicaciones
          </Button>
        ) : null}

        {canStart && onStart ? (
          <Button
            size="sm"
            onPress={() => onStart(job)}
            loading={starting}
            leftIcon={<Ionicons name="play-outline" size={16} color="#FFFFFF" />}>
            Iniciar trabajo
          </Button>
        ) : null}

        {canComplete && onComplete ? (
          <Button
            size="sm"
            onPress={() => onComplete(job)}
            loading={completing}
            leftIcon={<Ionicons name="checkmark-done-outline" size={16} color="#FFFFFF" />}>
            Marcar trabajo realizado
          </Button>
        ) : null}
      </View>

      {canCancel && onCancel ? (
        <Button
          variant="outline"
          size="sm"
          onPress={() => onCancel(job)}
          loading={cancelling}
          loadingLabel="Cancelando..."
          style={styles.cancelButton}
          leftIcon={<Ionicons name="close-circle-outline" size={16} color={colors.error} />}>
          Cancelar servicio
        </Button>
      ) : null}
    </Card>
  );
}

function formatJobDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 9,
  },
  categoryName: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
  },
  client: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },
  clientPanel: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
  },
  clientPanelCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: spacing.md,
  },
  clientLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  clientName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },
  clientPhone: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "column",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 6,
  },
  reviewBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: "#FFFBEB",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  reviewStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  reviewScore: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B45309",
    marginLeft: 6,
  },
  reviewComment: {
    fontSize: 13,
    color: "#78350F",
    fontStyle: "italic",
    marginTop: 4,
  },
  reviewPendingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
  },
  reviewPendingText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  cancelledBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: "#FEF2F2",
    borderRadius: radius.md,
  },
  confirmationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: "#FFF7ED",
    borderRadius: radius.md,
  },
  confirmationText: {
    flex: 1,
    marginLeft: spacing.sm,
    color: "#9A3412",
    fontSize: 12,
    lineHeight: 18,
  },
  cancelledCopy: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  cancelledTitle: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "800",
  },
  cancelledText: {
    color: "#991B1B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  priceContainer: {
    minWidth: 0,
  },
  priceLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  actions: {
    width: "100%",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelButton: {
    marginTop: spacing.md,
    borderColor: colors.error,
  },
});
