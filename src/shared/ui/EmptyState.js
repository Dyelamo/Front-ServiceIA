import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "../../theme";

import Button from "./Button";

export default function EmptyState({
  icon = "file-tray-outline",

  title,

  description,

  actionLabel,
  onAction,

  actionVariant = "primary",

  compact = false,

  style,
}) {
  return (
    <View style={[styles.container, compact && styles.compact, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={34} color={colors.primary} />
      </View>

      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button variant={actionVariant} onPress={onAction}>
            {actionLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 260,

    alignItems: "center",

    justifyContent: "center",

    padding: spacing.xxxl,
  },

  compact: {
    minHeight: 0,

    padding: spacing.xl,
  },

  iconContainer: {
    width: 72,
    height: 72,

    borderRadius: 36,

    backgroundColor: colors.primaryLight,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: spacing.lg,
  },

  title: {
    fontSize: 18,

    lineHeight: 24,

    fontWeight: "700",

    color: colors.text,

    textAlign: "center",
  },

  description: {
    marginTop: spacing.sm,

    fontSize: 14,

    lineHeight: 21,

    color: colors.textSecondary,

    textAlign: "center",

    maxWidth: 420,
  },

  action: {
    width: "100%",

    maxWidth: 320,

    marginTop: spacing.xxl,
  },
});
