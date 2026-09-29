import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  colors,
  spacing,
} from "../../theme";

export default function AppHeader({
  title,
  subtitle,
  onBack,
  right,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color={colors.text}
            />
          </Pressable>
        ) : null}

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {title}
          </Text>

          {subtitle ? (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {right ? (
        <View>
          {right}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 2,
    color: colors.textSecondary,
    fontSize: 13,
  },

  pressed: {
    opacity: 0.6,
  },
});