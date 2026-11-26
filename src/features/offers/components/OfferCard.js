import React, { useEffect, useState } from "react";

import { Image, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme/index";
import { Button } from "../../../shared/ui/index";
import { canWithdrawOffer } from "../../../core/domain/statuses";
import { getReferenceImage, getRequestImages } from "../../requests/utils/requestImages";

export default function OfferCard({ offer, onMessage, onWithdraw, withdrawing = false }) {
  const publication = offer.publication;
  const images = getRequestImages(publication);
  const referenceImage = getReferenceImage(publication);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [referenceImage]);

  const hasValidImage = Boolean(referenceImage && !imageFailed);

  return (
    <View style={styles.card}>
      {hasValidImage ? (
        <View style={styles.referenceMedia}>
          <Image
            source={{ uri: referenceImage }}
            style={styles.referenceImage}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />

          <View style={styles.referenceTag}>
            <Ionicons name="image-outline" size={12} color={colors.white} />
            <Text style={styles.referenceTagText}>Referencia</Text>
          </View>

          {images.length > 1 ? (
            <View style={styles.referenceCount}>
              <Ionicons name="images-outline" size={12} color={colors.white} />
              <Text style={styles.referenceTagText}>
                +{images.length - 1} foto{images.length - 1 === 1 ? "" : "s"}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {publication ? (
        <View style={styles.publicationSection}>
          <View style={styles.publicationHeader}>
            <View style={styles.publicationIcon}>
              <Ionicons
                name={publication.categoryIcon || "construct-outline"}
                size={21}
                color={colors.primary}
              />
            </View>

            <View style={styles.publicationContent}>
              <Text numberOfLines={1} style={styles.category}>
                {publication.categoryName || "Servicio"}
              </Text>

              <Text numberOfLines={3} style={styles.publicationDescription}>
                {publication.description || "Sin descripción"}
              </Text>
            </View>
          </View>

          <View style={styles.publicationMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={15} color={colors.textMuted} />

              <Text style={styles.metaText}>Valledupar</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={15} color={colors.textMuted} />

              <Text style={styles.metaText}>{publication.urgencyLabel || "No especificada"}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.publicationFallback}>
          <Ionicons name="document-text-outline" size={20} color={colors.textMuted} />

          <Text style={styles.publicationFallbackText}>
            No pudimos cargar los detalles de la publicación.
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.offerHeader}>
        <View>
          <Text style={styles.priceLabel}>Tu oferta</Text>

          <Text style={styles.price}>{formatCurrency(offer.price)}</Text>
        </View>

        <View style={[styles.badge, getStatusStyle(offer.status)]}>
          <Text style={[styles.badgeText, getStatusTextStyle(offer.status)]}>
            {offer.statusLabel || "Pendiente"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <InfoRow
        icon="time-outline"
        label="Disponibilidad"
        value={offer.availability || "No especificada"}
      />

      {offer.message ? (
        <>
          <View style={styles.divider} />

          <InfoRow icon="chatbubble-outline" label="Mensaje" value={offer.message} />
        </>
      ) : null}

      {offer.status === "aceptada" || offer.status === "aceptado" ? (
        <Button
          variant="secondary"
          disabled={!offer.conversationId || !publication?.userId}
          onPress={onMessage}
          style={styles.messageButton}
          leftIcon={
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primaryDark} />
          }>
          {offer.conversationId && publication?.userId
            ? "Abrir conversación"
            : "Chat no disponible"}
        </Button>
      ) : null}

      {canWithdrawOffer(offer.status) ? (
        <Button
          variant="outline"
          disabled={withdrawing}
          loading={withdrawing}
          loadingLabel="Retirando..."
          onPress={onWithdraw}
          style={styles.withdrawButton}
          leftIcon={<Ionicons name="close-circle-outline" size={18} color={colors.error} />}>
          Retirar oferta
        </Button>
      ) : null}

      <View style={styles.footer}>
        <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />

        <Text style={styles.date}>Enviada {formatDate(offer.createdAt)}</Text>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function getStatusStyle(status) {
  switch (status) {
    case "aceptada":
    case "aceptado":
      return {
        backgroundColor: "#DCFCE7",
      };

    case "rechazada":
    case "rechazado":
    case "cancelada":
    case "cancelado":
    case "retirada":
      return {
        backgroundColor: "#FEE2E2",
      };

    default:
      return {
        backgroundColor: "#FEF3C7",
      };
  }
}

function getStatusTextStyle(status) {
  switch (status) {
    case "aceptada":
    case "aceptado":
      return {
        color: "#15803D",
      };

    case "rechazada":
    case "rechazado":
    case "cancelada":
    case "cancelado":
    case "retirada":
      return {
        color: "#B91C1C",
      };

    default:
      return {
        color: "#B45309",
      };
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.lg,

    padding: spacing.lg,
  },

  referenceMedia: {
    width: "100%",
    height: 156,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    position: "relative",
  },

  referenceImage: {
    width: "100%",
    height: "100%",
  },

  referenceTag: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
  },

  referenceCount: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(15, 23, 42, 0.76)",
  },

  referenceTagText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },

  messageButton: {
    marginTop: spacing.md,
  },

  withdrawButton: {
    marginTop: spacing.md,
    borderColor: colors.error,
  },

  publicationSection: {
    width: "100%",
  },

  publicationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  publicationIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  publicationContent: {
    flex: 1,

    marginLeft: spacing.md,
  },

  category: {
    color: colors.primary,

    fontSize: 13,
    fontWeight: "700",
  },

  publicationDescription: {
    color: colors.text,

    fontSize: 15,
    lineHeight: 21,

    fontWeight: "600",

    marginTop: 3,

    minHeight: 42,
  },

  publicationMeta: {
    marginTop: spacing.md,

    flexDirection: "row",
    flexWrap: "wrap",

    gap: spacing.lg,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaText: {
    color: colors.textSecondary,

    fontSize: 12,

    marginLeft: 5,
  },

  publicationFallback: {
    minHeight: 70,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: colors.background,

    borderRadius: radius.md,

    padding: spacing.md,
  },

  publicationFallbackText: {
    flex: 1,

    color: colors.textSecondary,

    fontSize: 12,
    lineHeight: 18,

    marginLeft: spacing.sm,
  },

  offerHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  priceLabel: {
    color: colors.textMuted,

    fontSize: 12,
  },

  price: {
    color: colors.text,

    fontSize: 23,
    fontWeight: "800",

    marginTop: 2,
  },

  badge: {
    borderRadius: radius.pill,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.xs,

    marginLeft: spacing.md,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  divider: {
    height: 1,

    backgroundColor: colors.border,

    marginVertical: spacing.lg,
  },

  infoRow: {
    flexDirection: "row",

    alignItems: "flex-start",
  },

  infoIcon: {
    width: 36,
    height: 36,

    borderRadius: 10,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,

    marginLeft: spacing.md,
  },

  infoLabel: {
    color: colors.textMuted,

    fontSize: 11,
  },

  infoValue: {
    color: colors.text,

    fontSize: 14,
    lineHeight: 20,

    marginTop: 3,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: spacing.lg,
  },

  date: {
    color: colors.textMuted,

    fontSize: 11,

    marginLeft: 5,
  },
});
