import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  colors,
  radius,
  spacing,
} from "../../../theme/index";

export default function OfferCard({
  offer,
}) {
  const publication =
    offer.publication;

  return (
    <View style={styles.card}>
      {publication ? (
        <View
          style={
            styles.publicationSection
          }
        >
          <View
            style={
              styles.publicationHeader
            }
          >
            <View
              style={
                styles.publicationIcon
              }
            >
              <Ionicons
                name={
                  publication.categoryIcon ||
                  "construct-outline"
                }
                size={21}
                color={colors.primary}
              />
            </View>

            <View
              style={
                styles.publicationContent
              }
            >
              <Text
                numberOfLines={1}
                style={
                  styles.category
                }
              >
                {publication.categoryName ||
                  "Servicio"}
              </Text>

              <Text
                numberOfLines={3}
                style={
                  styles.publicationDescription
                }
              >
                {publication.description ||
                  "Sin descripción"}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.publicationMeta
            }
          >
            <View
              style={styles.metaItem}
            >
              <Ionicons
                name="location-outline"
                size={15}
                color={
                  colors.textMuted
                }
              />

              <Text
                style={
                  styles.metaText
                }
              >
                Valledupar
              </Text>
            </View>

            <View
              style={styles.metaItem}
            >
              <Ionicons
                name="time-outline"
                size={15}
                color={
                  colors.textMuted
                }
              />

              <Text
                style={
                  styles.metaText
                }
              >
                {publication.urgencyLabel ||
                  "No especificada"}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={
            styles.publicationFallback
          }
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={
              colors.textMuted
            }
          />

          <Text
            style={
              styles.publicationFallbackText
            }
          >
            No pudimos cargar los
            detalles de la publicación.
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View
        style={styles.offerHeader}
      >
        <View>
          <Text
            style={styles.priceLabel}
          >
            Tu oferta
          </Text>

          <Text
            style={styles.price}
          >
            {formatCurrency(
              offer.price
            )}
          </Text>
        </View>

        <View
          style={[
            styles.badge,

            getStatusStyle(
              offer.status
            ),
          ]}
        >
          <Text
            style={[
              styles.badgeText,

              getStatusTextStyle(
                offer.status
              ),
            ]}
          >
            {offer.statusLabel ||
              "Pendiente"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <InfoRow
        icon="time-outline"
        label="Disponibilidad"
        value={
          offer.availability ||
          "No especificada"
        }
      />

      {offer.message ? (
        <>
          <View
            style={styles.divider}
          />

          <InfoRow
            icon="chatbubble-outline"
            label="Mensaje"
            value={offer.message}
          />
        </>
      ) : null}

      <View style={styles.footer}>
        <Ionicons
          name="calendar-outline"
          size={14}
          color={colors.textMuted}
        />

        <Text style={styles.date}>
          Enviada{" "}
          {formatDate(
            offer.createdAt
          )}
        </Text>
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <View
      style={styles.infoRow}
    >
      <View
        style={styles.infoIcon}
      >
        <Ionicons
          name={icon}
          size={18}
          color={colors.primary}
        />
      </View>

      <View
        style={styles.infoContent}
      >
        <Text
          style={
            styles.infoLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.infoValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function getStatusStyle(status) {
  switch (status) {
    case "aceptada":
    case "aceptado":
      return {
        backgroundColor:
          "#DCFCE7",
      };

    case "rechazada":
    case "rechazado":
    case "cancelada":
    case "cancelado":
      return {
        backgroundColor:
          "#FEE2E2",
      };

    default:
      return {
        backgroundColor:
          "#FEF3C7",
      };
  }
}

function getStatusTextStyle(
  status
) {
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
  return new Intl.NumberFormat(
    "es-CO",
    {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value || 0)
  );
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "es-CO",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",

    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor:
      colors.border,

    borderRadius:
      radius.lg,

    padding:
      spacing.lg,
  },

  publicationSection: {
    width: "100%",
  },

  publicationHeader: {
    flexDirection: "row",
    alignItems:
      "flex-start",
  },

  publicationIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor:
      colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  publicationContent: {
    flex: 1,

    marginLeft:
      spacing.md,
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
    marginTop:
      spacing.md,

    flexDirection: "row",
    flexWrap: "wrap",

    gap:
      spacing.lg,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaText: {
    color:
      colors.textSecondary,

    fontSize: 12,

    marginLeft: 5,
  },

  publicationFallback: {
    minHeight: 70,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      colors.background,

    borderRadius:
      radius.md,

    padding:
      spacing.md,
  },

  publicationFallbackText: {
    flex: 1,

    color:
      colors.textSecondary,

    fontSize: 12,
    lineHeight: 18,

    marginLeft:
      spacing.sm,
  },

  offerHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",
  },

  priceLabel: {
    color:
      colors.textMuted,

    fontSize: 12,
  },

  price: {
    color: colors.text,

    fontSize: 23,
    fontWeight: "800",

    marginTop: 2,
  },

  badge: {
    borderRadius:
      radius.pill,

    paddingHorizontal:
      spacing.md,

    paddingVertical:
      spacing.xs,

    marginLeft:
      spacing.md,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  divider: {
    height: 1,

    backgroundColor:
      colors.border,

    marginVertical:
      spacing.lg,
  },

  infoRow: {
    flexDirection: "row",

    alignItems:
      "flex-start",
  },

  infoIcon: {
    width: 36,
    height: 36,

    borderRadius: 10,

    backgroundColor:
      colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,

    marginLeft:
      spacing.md,
  },

  infoLabel: {
    color:
      colors.textMuted,

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

    marginTop:
      spacing.lg,
  },

  date: {
    color:
      colors.textMuted,

    fontSize: 11,

    marginLeft: 5,
  },
});