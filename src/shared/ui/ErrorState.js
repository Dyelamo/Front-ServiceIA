import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "../../theme";

import Button from "./Button";

export default function ErrorState({
  title = "Algo salió mal",

  description = "No pudimos cargar la información.",

  onRetry,

  retryLabel = "Intentar nuevamente",

  retrying = false,

  compact = false,

  style,
}) {
  return (
    <View style={[styles.container, compact && styles.compact, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle-outline" size={34} color={colors.error} />
      </View>

      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      {onRetry ? (
        <View style={styles.action}>
          <Button
            variant="outline"
            onPress={onRetry}
            loading={retrying}
            loadingLabel="Reintentando...">
            {retryLabel}
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

    backgroundColor: "#FEF2F2",

    alignItems: "center",

    justifyContent: "center",
  },

  title: {
    marginTop: spacing.lg,

    color: colors.text,

    fontSize: 18,

    lineHeight: 24,

    fontWeight: "700",

    textAlign: "center",
  },

  description: {
    marginTop: spacing.sm,

    color: colors.textSecondary,

    fontSize: 14,

    lineHeight: 21,

    textAlign: "center",

    maxWidth: 420,
  },

  action: {
    width: "100%",

    maxWidth: 300,

    marginTop: spacing.xxl,
  },
});
