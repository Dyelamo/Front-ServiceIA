import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme";
import { Button, Card } from "../../../shared/ui";
import { fetchProviderReviews } from "../../reviews/api/reviews.api";

export default function ReceivedOfferCard({
  offer,
  onAccept,
  onMessage,
  onViewProfile,
  accepting = false,
}) {
  const [reviewsSummary, setReviewsSummary] = useState(null);

  useEffect(() => {
    let active = true;
    const providerId = offer.providerId || offer.provider?.id;
    if (providerId) {
      fetchProviderReviews(providerId)
        .then((res) => {
          if (active && res) {
            setReviewsSummary(res);
          }
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [offer.providerId, offer.provider?.id]);

  const providerName =
    offer.provider?.nombre_completo ||
    offer.provider?.usuario?.nombre_completo ||
    offer.provider?.nombre ||
    "Profesional";
  const isAccepted =
    offer.status === "aceptada" || offer.status === "aceptado";
  const isPending = offer.status === "pendiente";

  const ratingAvg = reviewsSummary?.promedio ?? 0;
  const totalReviews = reviewsSummary?.total_resenas ?? 0;

  return (
    <Card variant="outlined" style={styles.card}>
      <Pressable
        onPress={onViewProfile}
        style={({ pressed }) => [
          styles.header,
          pressed && onViewProfile && styles.headerPressed,
        ]}>
        <View style={styles.providerIcon}>
          <Ionicons name="person-outline" size={20} color={colors.primary} />
        </View>

        <View style={styles.providerDetails}>
          <View style={styles.nameAndBadgeRow}>
            <Text style={styles.providerName}>{providerName}</Text>
            {totalReviews > 0 ? (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.ratingText}>
                  {ratingAvg.toFixed(1)} ({totalReviews})
                </Text>
              </View>
            ) : (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>Nuevo</Text>
              </View>
            )}
          </View>
          <Text style={styles.status}>{offer.statusLabel}</Text>
        </View>

        <Text style={styles.price}>{formatCurrency(offer.price)}</Text>
      </Pressable>

      <InfoRow
        icon="time-outline"
        label="Disponibilidad"
        value={offer.availability}
      />
      {offer.message ? (
        <InfoRow icon="chatbubble-outline" label="Propuesta" value={offer.message} />
      ) : null}

      {/* BOTÓN VER PERFIL DEL TRABAJADOR */}
      {onViewProfile ? (
        <Button
          variant="outline"
          size="sm"
          onPress={onViewProfile}
          style={styles.viewProfileBtn}
          leftIcon={<Ionicons name="person-circle-outline" size={16} color={colors.primary} />}>
          Ver perfil y calificaciones
        </Button>
      ) : null}

      {isPending ? (
        <Button
          onPress={onAccept}
          loading={accepting}
          loadingLabel="Aceptando..."
          style={styles.action}
          leftIcon={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />}>
          Aceptar oferta
        </Button>
      ) : null}

      {isAccepted ? (
        <Button
          onPress={onMessage}
          disabled={!offer.conversationId || !offer.providerId}
          variant="secondary"
          style={styles.action}
          leftIcon={
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color={colors.primaryDark}
            />
          }>
          {offer.conversationId && offer.providerId
            ? "Enviar mensaje"
            : "Chat no disponible"}
        </Button>
      ) : null}
    </Card>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={17} color={colors.primary} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "No especificada"}</Text>
      </View>
    </View>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  providerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },
  providerDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  providerName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  status: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  price: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "800",
    marginLeft: spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  infoValue: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  action: {
    marginTop: spacing.sm,
  },
  headerPressed: {
    opacity: 0.7,
  },
  nameAndBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B45309",
  },
  newBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  viewProfileBtn: {
    marginBottom: spacing.sm,
  },
});
