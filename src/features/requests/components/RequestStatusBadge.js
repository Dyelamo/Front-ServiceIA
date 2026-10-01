import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../../../theme/index";

const STATUS_CONFIG = {
  activo: {
    label: "Activa",
    background: colors.primaryLight,
    color: colors.primaryDark,
  },

  cancelado: {
    label: "Cancelada",
    background: "#FEE2E2",
    color: "#B91C1C",
  },

  cancelada: {
    label: "Cancelada",
    background: "#FEE2E2",
    color: "#B91C1C",
  },

  completado: {
    label: "Completada",
    background: "#DCFCE7",
    color: "#15803D",
  },

  completada: {
    label: "Completada",
    background: "#DCFCE7",
    color: "#15803D",
  },
};

export default function RequestStatusBadge({ status }) {
  const normalizedStatus = String(status || "publicada").toLowerCase();

  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.publicada;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.background,
        },
      ]}>
      <Text
        style={[
          styles.label,
          {
            color: config.color,
          },
        ]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
  },
});
