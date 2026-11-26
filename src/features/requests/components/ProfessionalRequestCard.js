import React, { useEffect, useState } from "react";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { publicationDistance } from "../../location/location";

import { colors, radius, shadows, spacing } from "../../../theme/index";

import { categories } from "../data/categories";
import { resolveCategoryIcon } from "../../catalog/utils/category-presentation";
import { getReferenceImage, getRequestImages } from "../utils/requestImages";

function getCategory(categoryId) {
  return categories.find((category) => category.id === categoryId);
}

function getUrgencyLabel(urgency) {
  const labels = {
    ahora: "Lo antes posible",

    hoy: "Hoy",

    "esta semana": "Esta semana",

    "no tengo prisa": "No tengo prisa",
  };

  return labels[urgency] || urgency || "No especificada";
}

export default function ProfessionalRequestCard({ request, onPress }) {
  const categoryId = request.categoria_id || request.categoryId;
  const category = getCategory(categoryId);
  const categoryTitle =
    request.categoryName ||
    category?.label ||
    category?.name ||
    request.categoria?.nombre ||
    "Servicio";
  const iconName =
    request.categoryIcon || resolveCategoryIcon(categoryId, categoryTitle) || category?.icon;
  const urgencyText = request.urgencyLabel || getUrgencyLabel(request.urgencia || request.urgency);
  const descriptionText = request.description || request.descripcion || "Sin descripción";
  const locationText =
    request.location ||
    (request.barrio ? `${request.barrio}, Valledupar` : request.direccion || "Valledupar");
  const dateValue = request.createdAt || request.created_at;

  const images = getRequestImages(request);
  const referenceImage = getReferenceImage(request);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [referenceImage]);

  const hasValidImage = Boolean(referenceImage && !imageFailed);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {/* IMAGEN DE REFERENCIA (PRIMERA IMAGEN SUBIDA) */}
      {hasValidImage ? (
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: referenceImage }}
            style={styles.coverImage}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />

          <View style={styles.mediaTopBar}>
            <View style={styles.referenceTag}>
              <Ionicons name="image-outline" size={12} color={colors.white} />
              <Text style={styles.referenceTagText}>Referencia</Text>
            </View>

            <View style={[styles.urgencyBadge, styles.urgencyBadgeElevated]}>
              <Text style={styles.urgencyText}>{urgencyText}</Text>
            </View>
          </View>

          {images.length > 1 ? (
            <View style={styles.mediaCountPill}>
              <Ionicons name="images-outline" size={12} color={colors.white} />
              <Text style={styles.mediaCountText}>
                +{images.length - 1} foto{images.length - 1 === 1 ? "" : "s"}
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.mediaEmpty}>
          <View style={styles.mediaEmptyCenter}>
            <View style={styles.mediaEmptyIcon}>
              <Ionicons name={iconName || "image-outline"} size={21} color={colors.primary} />
            </View>
            <Text style={styles.mediaEmptyText}>Sin imagen de referencia</Text>
          </View>

          <View style={styles.mediaEmptyBadge}>
            <View style={styles.urgencyBadge}>
              <Text style={styles.urgencyText}>{urgencyText}</Text>
            </View>
          </View>
        </View>
      )}

      {/* CONTENIDO */}
      <View style={styles.body}>
        <View>
          <View style={styles.header}>
            <View style={styles.categoryRow}>
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={20} color={colors.primary} />
              </View>

              <View style={styles.categoryContent}>
                <Text numberOfLines={1} style={styles.category}>
                  {categoryTitle}
                </Text>

                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={13} color={colors.textMuted} />

                  <Text style={styles.location} numberOfLines={1}>
                    {locationText}
                  </Text>
                </View>

                <Text style={styles.distance}>{publicationDistance(request)}</Text>
              </View>
            </View>
          </View>

          <Text numberOfLines={3} style={styles.description}>
            {descriptionText}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(dateValue)}</Text>

          <View style={styles.viewRow}>
            <Text style={styles.viewText}>Ver solicitud</Text>

            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </View>
        </View>
      </View>
    </Pressable>
  );
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

    overflow: "hidden",

    ...shadows.sm,
  },

  pressed: {
    opacity: 0.88,
  },

  mediaContainer: {
    width: "100%",
    height: 180,
    backgroundColor: colors.surfaceSecondary,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  mediaTopBar: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  referenceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
  },

  referenceTagText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },

  mediaCountPill: {
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

  mediaCountText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },

  mediaEmpty: {
    width: "100%",
    height: 108,
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  mediaEmptyCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  mediaEmptyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  mediaEmptyText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },

  mediaEmptyBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
  },

  body: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.lg,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  categoryRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  categoryContent: {
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  category: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 15,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  location: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 3,
    flexShrink: 1,
  },

  distance: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },

  urgencyBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: "#FEF3C7",
  },

  urgencyBadgeElevated: {
    ...shadows.sm,
  },

  urgencyText: {
    color: "#B45309",
    fontSize: 11,
    fontWeight: "700",
  },

  description: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 44,
  },

  footer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  date: {
    color: colors.textMuted,
    fontSize: 12,
  },

  viewRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 12,
    marginRight: 3,
  },
});
