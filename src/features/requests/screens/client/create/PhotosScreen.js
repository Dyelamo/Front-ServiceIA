import React, { useState } from "react";

import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import { colors, radius, spacing } from "../../../../../theme/index";

import { Card } from "../../../../../shared/ui/index";

import { useResponsive } from "../../../../../shared/hooks/useResponsive";

import { useRequestDraft } from "../../../context/RequestDraftContext";

import RequestWizardLayout from "../../../components/RequestWizardLayout";

export default function PhotosScreen({ navigation }) {
  const { draft, updateDraft } = useRequestDraft();
  const { isMobile } = useResponsive();
  const [processing, setProcessing] = useState(false);
  const remainingSlots = Math.max(0, 5 - draft.photos.length);

  const prepareAssets = async (assets) => {
    const availableAssets = assets.slice(0, remainingSlots);
    const oversizedAsset = availableAssets.find((asset) => asset.fileSize > 12 * 1024 * 1024);

    if (oversizedAsset) {
      Alert.alert("Imagen demasiado grande", "Cada imagen debe pesar menos de 12 MB.");
      return;
    }

    setProcessing(true);

    try {
      const preparedPhotos = await Promise.all(
        availableAssets.map(async (asset, index) => {
          const context = ImageManipulator.manipulate(asset.uri);

          if (asset.width > 1600) {
            context.resize({ width: 1600 });
          }

          const image = await context.renderAsync();
          const result = await image.saveAsync({
            compress: 0.75,
            format: SaveFormat.JPEG,
          });

          return {
            id: `${Date.now()}-${index}`,
            uri: result.uri,
            name: asset.fileName || `foto-${draft.photos.length + index + 1}.jpg`,
            mimeType: "image/jpeg",
            width: result.width,
            height: result.height,
          };
        }),
      );

      updateDraft({ photos: [...draft.photos, ...preparedPhotos] });
    } catch (error) {
      console.error("Error preparando las imágenes:", error);
      Alert.alert("No pudimos agregar las fotos", "Intenta nuevamente con otra imagen.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCamera = async () => {
    if (!remainingSlots || processing) {
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso de cámara requerido",
        "Habilita la cámara en la configuración del dispositivo para tomar una foto.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      cameraType: ImagePicker.CameraType.back,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      await prepareAssets(result.assets);
    }
  };

  const handleGallery = async () => {
    if (!remainingSlots || processing) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso de fotos requerido",
        "Habilita el acceso a tus fotos para seleccionar imágenes del problema.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      orderedSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      await prepareAssets(result.assets);
    }
  };

  const handleRemovePhoto = (id) => {
    updateDraft({
      photos: draft.photos.filter((photo) => photo.id !== id),
    });
  };

  return (
    <RequestWizardLayout
      navigation={navigation}
      currentStep={5}
      totalSteps={5}
      title="Agrega fotos del problema"
      description="Las fotos ayudan a los profesionales a entender mejor lo que necesitas. Este paso es opcional."
      continueLabel={draft.photos.length > 0 ? "Continuar" : "Continuar sin fotos"}
      onContinue={() => navigation.navigate("CreateRequestReview")}>
      <View style={[styles.uploader, remainingSlots === 0 && styles.disabled]}>
        <View style={styles.uploadIcon}>
          <Ionicons name="camera-outline" size={30} color={colors.primary} />
        </View>

        <Text style={styles.uploadTitle}>Agregar una foto</Text>

        <Text style={styles.uploadDescription}>
          {processing ? "Preparando imágenes..." : "Cámara o galería"}
        </Text>

        <Text style={styles.uploadLimit}>
          {remainingSlots > 0 ? `${remainingSlots} espacios disponibles` : "Límite alcanzado"}
        </Text>

        <View style={styles.uploadActions}>
          <Pressable
            accessibilityRole="button"
            disabled={!remainingSlots || processing}
            onPress={handleCamera}
            style={({ pressed }) => [styles.uploadButton, pressed && styles.pressed]}>
            <Ionicons name="camera-outline" size={18} color={colors.primary} />
            <Text style={styles.uploadButtonText}>Tomar foto</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={!remainingSlots || processing}
            onPress={handleGallery}
            style={({ pressed }) => [styles.uploadButton, pressed && styles.pressed]}>
            <Ionicons name="images-outline" size={18} color={colors.primary} />
            <Text style={styles.uploadButtonText}>Galería</Text>
          </Pressable>
        </View>
      </View>

      {draft.photos.length > 0 ? (
        <View style={styles.photosSection}>
          <Text style={styles.photosTitle}>Fotos agregadas</Text>

          <View style={styles.grid}>
            {draft.photos.map((photo, index) => (
              <View
                key={photo.id}
                style={[styles.photoWrapper, isMobile ? styles.photoMobile : styles.photoWide]}>
                <Card variant="outlined" style={styles.photoCard}>
                  <Image
                    accessibilityLabel={`Foto ${index + 1} del problema`}
                    source={{ uri: photo.uri }}
                    style={styles.photoPreview}
                  />

                  <Pressable
                    onPress={() => handleRemovePhoto(photo.id)}
                    style={styles.removeButton}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </Pressable>
                </Card>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />

          <Text style={styles.infoText}>
            Las imágenes se comprimen y quedan preparadas en el borrador. El envío al servidor se
            activará cuando el backend exponga almacenamiento de archivos.
          </Text>
        </View>
      )}
    </RequestWizardLayout>
  );
}

const styles = StyleSheet.create({
  uploader: {
    minHeight: 190,

    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,

    borderRadius: radius.lg,

    backgroundColor: colors.surface,

    alignItems: "center",
    justifyContent: "center",

    padding: spacing.xxl,
  },

  uploadIcon: {
    width: 56,
    height: 56,

    borderRadius: 28,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: spacing.md,
  },

  uploadTitle: {
    color: colors.text,

    fontSize: 16,
    fontWeight: "700",
  },

  uploadDescription: {
    color: colors.textSecondary,

    fontSize: 14,

    marginTop: 4,
  },

  uploadLimit: {
    color: colors.textMuted,

    fontSize: 12,

    marginTop: spacing.sm,
  },

  uploadActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  uploadButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },

  uploadButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.5,
  },

  photosSection: {
    marginTop: spacing.xxl,
  },

  photosTitle: {
    color: colors.text,

    fontSize: 16,
    fontWeight: "700",

    marginBottom: spacing.md,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  photoWrapper: {
    padding: 6,
  },

  photoMobile: {
    width: "50%",
  },

  photoWide: {
    width: "33.3333%",
  },

  photoCard: {
    width: "100%",

    padding: spacing.md,

    position: "relative",
  },

  photoPreview: {
    width: "100%",
    height: 105,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
  },

  removeButton: {
    position: "absolute",

    top: 8,
    right: 8,

    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: colors.surface,

    alignItems: "center",
    justifyContent: "center",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",

    marginTop: spacing.xxl,

    padding: spacing.lg,

    borderRadius: radius.md,

    backgroundColor: colors.surfaceSecondary,
  },

  infoText: {
    flex: 1,

    marginLeft: spacing.sm,

    color: colors.textSecondary,

    fontSize: 13,
    lineHeight: 19,
  },
});
