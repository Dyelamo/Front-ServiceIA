import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, layout, radius, spacing } from "../../../theme/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

export default function NotificationsScreen() {
  const { isDesktop } = useResponsive();

  return (
    <Screen backgroundColor={colors.background}>
      <AppHeader title="Notificaciones" maxWidth={layout.content.wide} />

      <ResponsiveContainer
        maxWidth={layout.content.medium}
        style={styles.container}>
        <View style={[styles.empty, isDesktop && styles.emptyDesktop]}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="notifications-outline"
              size={38}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>No tienes notificaciones</Text>

          <Text style={styles.description}>
            Te avisaremos cuando haya novedades en tus solicitudes u ofertas
            recibidas.
          </Text>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",

    paddingVertical: spacing.xxl,
  },

  empty: {
    alignItems: "center",

    justifyContent: "center",

    padding: spacing.xxl,
  },

  emptyDesktop: {
    minHeight: 360,

    backgroundColor: colors.surface,

    borderWidth: 1,

    borderColor: colors.border,

    borderRadius: radius.lg,
  },

  iconContainer: {
    width: 72,

    height: 72,

    borderRadius: 36,

    backgroundColor: colors.primaryLight,

    alignItems: "center",

    justifyContent: "center",
  },

  title: {
    marginTop: spacing.lg,

    color: colors.text,

    fontSize: 19,

    fontWeight: "700",

    textAlign: "center",
  },

  description: {
    marginTop: spacing.sm,

    color: colors.textSecondary,

    fontSize: 14,

    lineHeight: 21,

    textAlign: "center",

    maxWidth: 380,
  },
});
