import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme/index";

export default function OfferCard({ offer }) {
  const publication = offer.publication;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          {publication ? (
            <View style={styles.publicationSection}>
              <View style={styles.publicationHeader}>
                <View style={styles.publicationIcon}>
                  <Ionicons
                    name={publication.categoryIcon || "construct-outline"}
                    size={20}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.publicationContent}>
                  <Text style={styles.category}>
                    {publication.categoryName}
                  </Text>

                  <Text numberOfLines={2} style={styles.publicationDescription}>
                    {publication.description}
                  </Text>
                </View>
              </View>

              <View style={styles.publicationMeta}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color={colors.textMuted}
                  />

                  <Text style={styles.metaText}>
                    {publication.urgencyLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />
            </View>
          ) : null}
          <Text style={styles.priceLabel}>Tu oferta</Text>

          <Text style={styles.price}>{formatCurrency(offer.price)}</Text>
        </View>

        <View style={[styles.badge, getStatusStyle(offer.status)]}>
          <Text style={[styles.badgeText, getStatusTextStyle(offer.status)]}>
            {offer.statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <InfoRow
        icon="time-outline"
        label="Disponibilidad"
        value={offer.availability}
      />

      {offer.message ? (
        <>
          <View style={styles.divider} />

          <InfoRow
            icon="chatbubble-outline"
            label="Mensaje"
            value={offer.message}
          />
        </>
      ) : null}

      <Text style={styles.date}>Enviada {formatDate(offer.createdAt)}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.primary} />

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

  return new Date(value).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.lg,

    padding: spacing.lg,

    marginBottom: spacing.md,
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  priceLabel: {
    color: colors.textMuted,

    fontSize: 12,
  },

  price: {
    color: colors.text,

    fontSize: 22,
    fontWeight: "800",

    marginTop: 2,
  },

  badge: {
    borderRadius: radius.pill,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.xs,
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

  infoContent: {
    flex: 1,

    marginLeft: spacing.md,
  },

  infoLabel: {
    color: colors.textMuted,

    fontSize: 12,
  },

  infoValue: {
    color: colors.text,

    fontSize: 14,
    lineHeight: 20,

    marginTop: 3,
  },

  date: {
    color: colors.textMuted,

    fontSize: 11,

    marginTop: spacing.lg,
  },

  publicationSection: {
    marginBottom: spacing.md,
  },

  publicationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  publicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,

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
    marginTop: 2,
  },

  publicationMeta: {
    marginTop: spacing.md,
    flexDirection: "row",
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
});
