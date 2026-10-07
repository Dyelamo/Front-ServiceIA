import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
} from "../../../theme/index";

const DEFAULT_STATUS = {
  label: "Publicada",
  background: colors.primaryLight,
  color: colors.primaryDark,
};

const STATUS_CONFIG = {
  publicada: DEFAULT_STATUS,

  activo: {
    label: "Activa",
    background: colors.primaryLight,
    color: colors.primaryDark,
  },

  activa: {
    label: "Activa",
    background: colors.primaryLight,
    color: colors.primaryDark,
  },

  pendiente: {
    label: "Pendiente",
    background: "#FEF3C7",
    color: "#B45309",
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

export default function RequestStatusBadge({
  status,
}) {
  const normalizedStatus =
    String(
      status || "publicada"
    ).toLowerCase();

  const config =
    STATUS_CONFIG[
      normalizedStatus
    ] || DEFAULT_STATUS;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            config.background,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color:
              config.color,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",

    borderRadius:
      radius.pill,

    paddingHorizontal:
      spacing.md,

    paddingVertical:
      spacing.xs,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
  },
});