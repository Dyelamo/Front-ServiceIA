import React, { useEffect, useState } from "react";

import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, shadows, spacing } from "../../../theme/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

export default function RequestImageGallery({
  images = [],
  emptyMessage = "El cliente no adjuntó imágenes en esta solicitud.",
}) {
  const { isDesktop } = useResponsive();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [failedUris, setFailedUris] = useState({});

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const total = safeImages.length;
  const imagesKey = safeImages.join("|");

  useEffect(() => {
    setSelectedIndex(0);
    setFailedUris({});
  }, [imagesKey]);

  if (total === 0) {
    return (
      <View style={styles.emptyBox}>
        <View style={styles.emptyIcon}>
          <Ionicons name="images-outline" size={20} color={colors.textMuted} />
        </View>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const activeIndex = Math.min(selectedIndex, total - 1);
  const activeUri = safeImages[activeIndex];
  const isActiveBroken = Boolean(failedUris[activeUri]);

  const goPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % total);
  };

  const markBroken = (uri) => {
    setFailedUris((prev) => (prev[uri] ? prev : { ...prev, [uri]: true }));
  };

  return (
    <View style={styles.wrapper}>
      {/* IMAGEN PRINCIPAL */}

      <View
        style={[
          styles.heroStage,
          isDesktop ? styles.heroStageDesktop : styles.heroStageMobile,
        ]}>
        <Pressable
          onPress={() => {
            if (!isActiveBroken) {
              setLightboxOpen(true);
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={`Ampliar imagen ${activeIndex + 1} de ${total}`}
          style={styles.heroPressable}>
          {!isActiveBroken ? (
            <Image
              source={{ uri: activeUri }}
              style={styles.heroImage}
              resizeMode="cover"
              onError={() => markBroken(activeUri)}
            />
          ) : (
            <View style={styles.brokenState}>
              <Ionicons
                name="image-outline"
                size={34}
                color={colors.textMuted}
              />
              <Text style={styles.brokenText}>
                No pudimos cargar esta imagen
              </Text>
            </View>
          )}
        </Pressable>

        {/* BADGES SUPERIORES */}

        <View pointerEvents="none" style={styles.topOverlay}>
          <View
            style={[
              styles.badgePill,
              activeIndex === 0 && styles.referencePill,
            ]}>
            <Ionicons
              name={activeIndex === 0 ? "star" : "image-outline"}
              size={12}
              color={colors.white}
            />
            <Text style={styles.badgeText}>
              {activeIndex === 0
                ? "Imagen de referencia"
                : `Foto ${activeIndex + 1}`}
            </Text>
          </View>

          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>
              {activeIndex + 1} / {total}
            </Text>
            {!isActiveBroken ? (
              <Ionicons name="expand-outline" size={13} color={colors.white} />
            ) : null}
          </View>
        </View>

        {/* CONTROLES ANTERIOR / SIGUIENTE */}

        {total > 1 ? (
          <>
            <Pressable
              onPress={goPrev}
              accessibilityRole="button"
              accessibilityLabel="Imagen anterior"
              style={({ pressed }) => [
                styles.navArrow,
                styles.navArrowLeft,
                pressed && styles.pressed,
              ]}>
              <Ionicons name="chevron-back" size={20} color={colors.white} />
            </Pressable>

            <Pressable
              onPress={goNext}
              accessibilityRole="button"
              accessibilityLabel="Imagen siguiente"
              style={({ pressed }) => [
                styles.navArrow,
                styles.navArrowRight,
                pressed && styles.pressed,
              ]}>
              <Ionicons name="chevron-forward" size={20} color={colors.white} />
            </Pressable>
          </>
        ) : null}
      </View>

      {/* MINIATURAS */}

      {total > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbRow}>
          {safeImages.map((uri, index) => {
            const isSelected = index === activeIndex;
            const isBroken = Boolean(failedUris[uri]);

            return (
              <Pressable
                key={`${uri}-${index}`}
                onPress={() => setSelectedIndex(index)}
                accessibilityRole="button"
                accessibilityLabel={`Ver foto ${index + 1}`}
                style={({ pressed }) => [
                  styles.thumbButton,
                  isSelected && styles.thumbButtonActive,
                  pressed && styles.pressed,
                ]}>
                {!isBroken ? (
                  <Image
                    source={{ uri }}
                    style={[
                      styles.thumbImage,
                      !isSelected && styles.thumbImageInactive,
                    ]}
                    resizeMode="cover"
                    onError={() => markBroken(uri)}
                  />
                ) : (
                  <View style={styles.thumbBroken}>
                    <Ionicons
                      name="image-outline"
                      size={18}
                      color={colors.textMuted}
                    />
                  </View>
                )}

                {index === 0 ? (
                  <View style={styles.thumbRefDot}>
                    <Ionicons name="star" size={9} color={colors.white} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      {/* VISOR PANTALLA COMPLETA */}

      <Modal
        visible={lightboxOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLightboxOpen(false)}>
        <View style={styles.lightboxBackdrop}>
          <View style={styles.lightboxHeader}>
            <View style={styles.lightboxMeta}>
              <Text style={styles.lightboxCounter}>
                Foto {activeIndex + 1} de {total}
              </Text>
              {activeIndex === 0 ? (
                <View style={styles.lightboxRefTag}>
                  <Ionicons name="star" size={11} color={colors.white} />
                  <Text style={styles.lightboxRefText}>Referencia</Text>
                </View>
              ) : null}
            </View>

            <Pressable
              onPress={() => setLightboxOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Cerrar visor de imágenes"
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}>
              <Ionicons name="close" size={22} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.lightboxStage}>
            <Image
              source={{ uri: activeUri }}
              style={styles.lightboxImage}
              resizeMode="contain"
            />

            {total > 1 ? (
              <>
                <Pressable
                  onPress={goPrev}
                  accessibilityRole="button"
                  accessibilityLabel="Imagen anterior"
                  style={({ pressed }) => [
                    styles.lightboxArrow,
                    styles.navArrowLeft,
                    pressed && styles.pressed,
                  ]}>
                  <Ionicons name="chevron-back" size={26} color={colors.white} />
                </Pressable>

                <Pressable
                  onPress={goNext}
                  accessibilityRole="button"
                  accessibilityLabel="Imagen siguiente"
                  style={({ pressed }) => [
                    styles.lightboxArrow,
                    styles.navArrowRight,
                    pressed && styles.pressed,
                  ]}>
                  <Ionicons
                    name="chevron-forward"
                    size={26}
                    color={colors.white}
                  />
                </Pressable>
              </>
            ) : null}
          </View>

          {total > 1 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.lightboxThumbs}>
              {safeImages.map((uri, index) => {
                const isSelected = index === activeIndex;
                return (
                  <Pressable
                    key={`lb-${uri}-${index}`}
                    onPress={() => setSelectedIndex(index)}
                    style={[
                      styles.lightboxThumb,
                      isSelected && styles.lightboxThumbActive,
                    ]}>
                    <Image
                      source={{ uri }}
                      style={styles.thumbImage}
                      resizeMode="cover"
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  emptyBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  emptyText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },

  heroStage: {
    width: "100%",
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },

  heroStageMobile: {
    height: 245,
  },

  heroStageDesktop: {
    height: 360,
  },

  heroPressable: {
    width: "100%",
    height: "100%",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  brokenState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  brokenText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },

  topOverlay: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
  },

  referencePill: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },

  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },

  navArrow: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.62)",
    alignItems: "center",
    justifyContent: "center",
  },

  navArrowLeft: {
    left: spacing.md,
  },

  navArrowRight: {
    right: spacing.md,
  },

  thumbRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: 2,
  },

  thumbButton: {
    width: 82,
    height: 62,
    borderRadius: radius.sm,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    position: "relative",
  },

  thumbButtonActive: {
    borderWidth: 2.5,
    borderColor: colors.primary,
  },

  thumbImage: {
    width: "100%",
    height: "100%",
  },

  thumbImageInactive: {
    opacity: 0.72,
  },

  thumbBroken: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  thumbRefDot: {
    position: "absolute",
    left: 4,
    bottom: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.78,
  },

  lightboxBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    justifyContent: "space-between",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },

  lightboxHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  lightboxMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  lightboxCounter: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },

  lightboxRefTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },

  lightboxRefText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  lightboxStage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.lg,
    position: "relative",
  },

  lightboxImage: {
    width: "100%",
    height: "100%",
  },

  lightboxArrow: {
    position: "absolute",
    top: "50%",
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  lightboxThumbs: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  lightboxThumb: {
    width: 68,
    height: 52,
    borderRadius: radius.sm,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    opacity: 0.6,
  },

  lightboxThumbActive: {
    borderColor: colors.primary,
    opacity: 1,
  },
});
