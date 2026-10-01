import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  colors,
  spacing,
} from "../../../theme";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout";

export default function NotificationsScreen() {
  return (
    <Screen
      backgroundColor={
        colors.background
      }
    >
      <AppHeader
        title="Notificaciones"
      />

      <ResponsiveContainer
        maxWidth={800}
        style={styles.container}
      >
        <View style={styles.empty}>
          <View
            style={styles.iconContainer}
          >
            <Ionicons
              name="notifications-outline"
              size={38}
              color={colors.primary}
            />
          </View>

          <Text style={styles.title}>
            No tienes notificaciones
          </Text>

          <Text
            style={
              styles.description
            }
          >
            Te avisaremos cuando haya
            novedades en tus solicitudes
            u ofertas recibidas.
          </Text>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    padding:
      spacing.xxxl,
  },

  iconContainer: {
    width: 72,
    height: 72,

    borderRadius: 36,

    backgroundColor:
      colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    marginTop:
      spacing.lg,

    color: colors.text,

    fontSize: 19,
    fontWeight: "700",
  },

  description: {
    marginTop:
      spacing.sm,

    color:
      colors.textSecondary,

    fontSize: 14,
    lineHeight: 21,

    textAlign: "center",

    maxWidth: 380,
  },
});