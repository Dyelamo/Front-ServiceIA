import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, shadows, spacing } from "../../theme/index";
import Button from "./Button";

const VARIANT_CONFIG = {
  info: {
    icon: "information-circle",
    color: colors.info,
    backgroundColor: "#EFF6FF",
  },
  success: {
    icon: "checkmark-circle",
    color: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  warning: {
    icon: "warning",
    color: colors.warning,
    backgroundColor: "#FFFBEB",
  },
  error: {
    icon: "alert-circle",
    color: colors.error,
    backgroundColor: "#FEF2F2",
  },
};

export default function AlertModal({
  visible,
  title,
  message,
  variant = "info",
  confirmLabel = "Entendido",
  cancelLabel,
  confirmVariant = "primary",
  loading = false,
  dismissible = true,
  onConfirm,
  onClose,
}) {
  const variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;
  const hasCancel = Boolean(cancelLabel);

  const handleBackdropPress = () => {
    if (dismissible && !loading && onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!loading && onClose) {
          onClose();
        }
      }}>
      <Pressable onPress={handleBackdropPress} style={styles.backdrop}>
        <Pressable onPress={() => {}} style={styles.dialog}>
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: variantConfig.backgroundColor },
            ]}>
            <Ionicons name={variantConfig.icon} size={28} color={variantConfig.color} />
          </View>

          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={[styles.actions, !hasCancel && styles.singleAction]}>
            {hasCancel ? (
              <Button
                variant="outline"
                disabled={loading}
                onPress={onClose}
                style={styles.actionButton}>
                {cancelLabel}
              </Button>
            ) : null}

            <Button
              variant={confirmVariant}
              loading={loading}
              onPress={handleConfirm}
              style={hasCancel ? styles.actionButton : undefined}>
              {confirmLabel}
            </Button>
          </View>
        </Pressable>
      </Pressable>
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
    maxWidth: 440,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadows.md,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 26,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  singleAction: {
    justifyContent: "flex-end",
  },
  actionButton: {
    flex: 1,
  },
});
