import React, { useEffect, useState } from "react";

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, shadows, spacing } from "../../../theme/index";

import { getReferenceImage, getRequestImages } from "../utils/requestImages";
import RequestStatusBadge from "./RequestStatusBadge";

export default function RequestCard({ request, onPress }) {
  const images = getRequestImages(request);
  const referenceImage = getReferenceImage(request);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [referenceImage]);

  const hasValidImage = Boolean(referenceImage && !imageFailed);
  const locationText =
    request.location ||
    (request.barrio ? `${request.barrio}, Valledupar` : request.direccion || "Valledupar");

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

            <View style={styles.badgeOverlay}>
              <RequestStatusBadge status={request.status} />
            </View>
          </View>

          {images.length > 1 ? (
            <View style={styles.mediaCountPill}>
              <Ionicons name="images-outline" size={12} color={colors.white} />
              <Text style={styles.mediaCountText}>1/{images.length} fotos</Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.mediaEmpty}>
          <View style={styles.mediaEmptyCenter}>
            <View style={styles.mediaEmptyIcon}>
              <Ionicons
                name={request.categoryIcon || "image-outline"}
                size={21}
                color={colors.primary}
              />
            </View>
            <Text style={styles.mediaEmptyText}>Sin imagen de referencia</Text>
          </View>

          <View style={styles.mediaEmptyBadge}>
            <RequestStatusBadge status={request.status} />
          </View>
        </View>
      )}

      {/* CONTENIDO */}
      <View style={styles.body}>
        <View>
          <View style={styles.header}>
            <View style={styles.categoryRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={request.categoryIcon || "construct-outline"}
                  size={18}
                  color={colors.primary}
                />
              </View>

              <Text numberOfLines={1} style={styles.category}>
                {request.categoryName || "Servicio"}
              </Text>
            </View>
          </View>

          <Text numberOfLines={3} style={styles.description}>
            {request.description || "Sin descripción"}
          </Text>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={15} color={colors.textMuted} />

              <Text numberOfLines={1} style={styles.metaText}>
                {locationText}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={15} color={colors.textMuted} />

              <Text style={styles.metaText}>{request.urgencyLabel || "No especificada"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(request.createdAt)}</Text>

          <View style={styles.viewAction}>
            <Text style={styles.viewText}>Ver detalle</Text>

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
    height: 176,
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

  badgeOverlay: {
    ...shadows.sm,
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
    alignItems: "center",
  },

  categoryRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  category: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  description: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 44,
  },

  meta: {
    marginTop: spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
  },

  metaText: {
    marginLeft: 5,
    color: colors.textSecondary,
    fontSize: 13,
    flexShrink: 1,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  date: {
    color: colors.textMuted,
    fontSize: 12,
  },

  viewAction: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    marginRight: 3,
  },
});
