import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../../../theme/index";

import { Card } from "../../../../../shared/ui/index";

import { useRequestDraft } from "../../../context/RequestDraftContext";

import RequestWizardLayout from "../../../components/RequestWizardLayout";

export default function PhotosScreen({ navigation }) {
  const { draft, updateDraft } = useRequestDraft();

  const handleAddMockPhoto = () => {
    // TEMPORAL:
    // todavía no estamos usando cámara,
    // galería ni subida real al backend.

    const nextPhoto = {
      id: Date.now().toString(),
      name: `foto-${draft.photos.length + 1}`,
    };

    updateDraft({
      photos: [...draft.photos, nextPhoto],
    });
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
      continueLabel={
        draft.photos.length > 0 ? "Continuar" : "Continuar sin fotos"
      }
      onContinue={() => navigation.navigate("CreateRequestReview")}>
      <Pressable
        onPress={handleAddMockPhoto}
        disabled={draft.photos.length >= 5}
        style={({ pressed }) => [
          styles.uploader,
          pressed && styles.pressed,
          draft.photos.length >= 5 && styles.disabled,
        ]}>
        <View style={styles.uploadIcon}>
          <Ionicons name="camera-outline" size={30} color={colors.primary} />
        </View>

        <Text style={styles.uploadTitle}>Agregar una foto</Text>

        <Text style={styles.uploadDescription}>Cámara o galería</Text>

        <Text style={styles.uploadLimit}>Máximo 5 fotos</Text>
      </Pressable>

      {draft.photos.length > 0 ? (
        <View style={styles.photosSection}>
          <Text style={styles.photosTitle}>Fotos agregadas</Text>

          <View style={styles.grid}>
            {draft.photos.map((photo, index) => (
              <Card key={photo.id} variant="outlined" style={styles.photoCard}>
                <View style={styles.photoPlaceholder}>
                  <Ionicons
                    name="image-outline"
                    size={30}
                    color={colors.primary}
                  />

                  <Text style={styles.photoText}>Foto {index + 1}</Text>
                </View>

                <Pressable
                  onPress={() => handleRemovePhoto(photo.id)}
                  style={styles.removeButton}>
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={colors.error}
                  />
                </Pressable>
              </Card>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.textSecondary}
          />

          <Text style={styles.infoText}>
            Por ahora las fotos son una representación visual. La carga real
            desde cámara o galería se conectará más adelante.
          </Text>
        </View>
      )}
    </RequestWizardLayout>
  );
}

const styles = StyleSheet.create({
  uploader: {
    minHeight: 180,

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

  photoCard: {
    width: "47%",
    margin: 6,
    padding: spacing.md,
    position: "relative",
  },

  photoPlaceholder: {
    height: 100,

    borderRadius: radius.md,

    backgroundColor: colors.surfaceSecondary,

    alignItems: "center",
    justifyContent: "center",
  },

  photoText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 6,
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
