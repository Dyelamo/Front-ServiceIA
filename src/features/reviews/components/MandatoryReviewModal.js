import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme/index";
import { Button } from "../../../shared/ui/index";
import { createReview } from "../api/reviews.api";

const STAR_LABELS = {
  1: "Pésimo servicio",
  2: "Regular",
  3: "Buen servicio",
  4: "Muy buen servicio",
  5: "¡Excelente servicio!",
};

export default function MandatoryReviewModal({
  visible,
  publicationId,
  providerId,
  providerName = "el profesional",
  publicationTitle = "Servicio contratado",
  onSuccess,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = rating >= 1 && rating <= 5 && comment.trim().length >= 3;

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert(
        "Calificación requerida",
        "Debes seleccionar entre 1 y 5 estrellas y escribir una opinión de al menos 3 caracteres."
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await createReview({
        publicacionId: publicationId,
        prestadorId: providerId,
        calificacion: rating,
        comentario: comment.trim(),
      });

      Alert.alert(
        "¡Gracias por tu reseña!",
        "Tu opinión ha sido registrada y ayuda a toda la comunidad de Valledupar a elegir los mejores prestadores."
      );

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Error al registrar reseña obligatoria:", error);
      const detail =
        error?.response?.data?.detail ||
        "No se pudo guardar la calificación. Por favor verifica los datos e intenta nuevamente.";
      Alert.alert("Error al calificar", detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      // Bloqueo explícito: no se puede cerrar con el botón atrás de Android ni omitir
      onRequestClose={() => {
        Alert.alert(
          "Reseña Obligatoria",
          "Para mantener la calidad y seguridad de la comunidad en Valledupar, no puedes omitir la calificación de este servicio finalizado."
        );
      }}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header de bloqueo */}
          <View style={styles.badgeWrapper}>
            <View style={styles.warningBadge}>
              <Ionicons name="lock-closed" size={14} color="#B45309" />
              <Text style={styles.warningBadgeText}>Calificación Obligatoria</Text>
            </View>
          </View>

          <Text style={styles.title}>¿Cómo fue el servicio?</Text>
          <Text style={styles.subtitle}>
            Has finalizado el trabajo de <Text style={styles.bold}>{publicationTitle}</Text> con{" "}
            <Text style={styles.bold}>{providerName}</Text>.
          </Text>

          <View style={styles.noticeBox}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <Text style={styles.noticeText}>
              En ServIA las reseñas son 100% verificadas y obligatorias para garantizar la calidad de los técnicos en Valledupar.
            </Text>
          </View>

          {/* Selector de Estrellas interactivo */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                style={styles.starTouch}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={36}
                  color={star <= rating ? "#F59E0B" : colors.border}
                />
              </Pressable>
            ))}
          </View>

          <Text style={styles.starLabel}>
            {rating ? STAR_LABELS[rating] : "Selecciona una calificación"}
          </Text>

          {/* Campo de comentario obligatorio */}
          <View style={styles.commentWrapper}>
            <Text style={styles.commentLabel}>Tu opinión sincera (Obligatoria):</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Ej. Llegó puntual, resolvió el problema rápidamente y dejó todo limpio..."
              placeholderTextColor={colors.textMuted}
              value={comment}
              onChangeText={setComment}
            />
            {comment.trim().length < 3 ? (
              <Text style={styles.fieldError}>
                Escribe al menos 3 caracteres sobre tu experiencia.
              </Text>
            ) : null}
          </View>

          {/* Único botón disponible: Enviar reseña (No hay botón cancelar ni omitir) */}
          <View style={styles.buttonWrapper}>
            <Button
              onPress={handleSubmit}
              loading={submitting}
              disabled={!isFormValid || submitting}
              style={[styles.submitButton, !isFormValid && styles.buttonDisabled]}
              leftIcon={<Ionicons name="checkmark-done" size={18} color="#FFFFFF" />}>
              Enviar Calificación Obligatoria
            </Button>
          </View>

          <Text style={styles.noSkipNotice}>
            * No es posible omitir este paso para asegurar la transparencia del marketplace.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  container: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  badgeWrapper: {
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "#FEF3C7",
  },
  warningBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B45309",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  bold: {
    fontWeight: "700",
    color: colors.text,
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: colors.primaryDark,
    fontWeight: "500",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: spacing.sm,
  },
  starTouch: {
    padding: 4,
  },
  starLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B45309",
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  commentWrapper: {
    marginBottom: spacing.lg,
  },
  commentLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: "top",
    minHeight: 90,
  },
  fieldError: {
    fontSize: 11,
    color: "#DC2626",
    marginTop: 4,
  },
  buttonWrapper: {
    marginTop: spacing.xs,
  },
  submitButton: {
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  noSkipNotice: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.md,
    fontStyle: "italic",
  },
});
