import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme/index";
import { Badge, Button, Card } from "../../../shared/ui/index";
import { formatCOP } from "../../../utils";

export default function JobCard({ job, onMessage }) {
  const isCompleted = job.estado === "terminado" || job.status === "Completado";
  const isInProgress = job.estado === "en_progreso" || job.status === "En camino";
  const isAgreed = job.estado === "acuerdo" || job.status === "Acuerdo";

  return (
    <Card variant="outlined" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.client}>Cliente: {job.client}</Text>
        </View>

        <Badge
          label={isCompleted ? "Completado" : isInProgress ? "En progreso" : "Acuerdo"}
          type={isCompleted ? "success" : isInProgress ? "info" : "warning"}
        />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.primary}
          />
          <Text style={styles.metaText}>{job.location || job.direccion || "Valledupar"}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.metaText}>{job.schedule || "Disponibilidad acordada"}</Text>
        </View>

        {job.cliente?.telefono ? (
          <View style={styles.metaItem}>
            <Ionicons
              name="call-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.metaText}>{job.cliente.telefono}</Text>
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
            <Text style={styles.reviewScore}>
              {job.resena.calificacion}.0 / 5.0
            </Text>
          </View>
          <Text style={styles.reviewComment}>"{job.resena.comentario}"</Text>
        </View>
      ) : isCompleted ? (
        <View style={styles.reviewPendingBox}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.reviewPendingText}>
            Esperando calificación obligatoria del cliente
          </Text>
        </View>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Precio acordado</Text>
          <Text style={styles.price}>{formatCOP(job.price || job.precio_ofertado)}</Text>
        </View>

        <View style={styles.actionsGroup}>
          {onMessage ? (
            <Button
              size="sm"
              variant="outline"
              fullWidth={false}
              onPress={onMessage}
              style={styles.chatButton}
              leftIcon={<Ionicons name="chatbubbles-outline" size={15} color={colors.primary} />}>
              Mensajes
            </Button>
          ) : null}

          {/* Indicadores informativos del estado (gestión exclusiva del cliente) */}
          {isAgreed ? (
            <View style={styles.statusPill}>
              <Ionicons name="time-outline" size={14} color="#B45309" />
              <Text style={styles.statusPillText}>Inicio a cargo del cliente</Text>
            </View>
          ) : isInProgress ? (
            <View style={[styles.statusPill, styles.inProgressPill]}>
              <Ionicons name="construct-outline" size={14} color="#047857" />
              <Text style={[styles.statusPillText, styles.inProgressPillText]}>
                En progreso (Cliente finaliza)
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Card>
  );
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  priceContainer: {
    minWidth: 120,
  },
  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  chatButton: {
    paddingHorizontal: spacing.md,
    height: 34,
  },
  priceLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: "#FEF3C7",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
  },
  inProgressPill: {
    backgroundColor: "#D1FAE5",
    borderColor: "#A7F3D0",
  },
  inProgressPillText: {
    color: "#065F46",
  },
});
