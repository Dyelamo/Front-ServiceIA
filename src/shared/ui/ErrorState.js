import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  colors,
  spacing,
} from "../../theme";

import Button from "./Button";

export default function ErrorState({
  title = "Algo salió mal",
  description = "No pudimos cargar la información.",
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="alert-circle-outline"
        size={40}
        color={colors.error}
      />

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      {onRetry ? (
        <View style={styles.action}>
          <Button
            variant="outline"
            onPress={onRetry}
          >
            Intentar nuevamente
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: spacing.xxxl,
  },

  title: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  description: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  action: {
    width: "100%",
    maxWidth: 300,
    marginTop: spacing.xxl,
  },
});