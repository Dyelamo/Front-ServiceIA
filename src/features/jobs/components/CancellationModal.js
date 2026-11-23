import React, { useEffect, useState } from "react";

import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../../../theme/index";
import { Button, TextArea } from "../../../shared/ui/index";

export default function CancellationModal({
  visible,
  loading,
  onClose,
  onConfirm,
  isOpenRequest = false,
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!visible) {
      setReason("");
    }
  }, [visible]);

  const normalizedReason = reason.trim();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text style={styles.title}>
            {isOpenRequest ? "Cancelar solicitud" : "Cancelar servicio"}
          </Text>
          <Text style={styles.description}>
            {isOpenRequest
              ? "Indica brevemente el motivo. La publicación dejará de recibir ofertas."
              : "Indica brevemente el motivo. La otra persona será notificada y el chat quedará cerrado."}
          </Text>

          <TextArea
            label="Motivo"
            placeholder="Ej. Cambiaron mis planes"
            value={reason}
            editable={!loading}
            onChangeText={setReason}
            maxLength={300}
          />
          <Text style={styles.counter}>{reason.length}/300</Text>

          <View style={styles.actions}>
            <Button variant="outline" disabled={loading} onPress={onClose} style={styles.action}>
              Volver
            </Button>
            <Button
              variant="danger"
              disabled={normalizedReason.length < 5}
              loading={loading}
              loadingLabel="Cancelando..."
              onPress={() => onConfirm(normalizedReason)}
              style={styles.action}>
              Confirmar cancelación
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
  },
  dialog: {
    width: "100%",
    maxWidth: 520,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  counter: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  action: {
    flex: 1,
  },
});
