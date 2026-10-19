import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme";

export default function CategoryCard({ category, selected = false, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,

        selected && {
          borderColor: colors.primary,
          backgroundColor: colors.primaryLight,
        },

        pressed && styles.pressed,
      ]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: category.backgroundColor,
          },
        ]}>
        <Ionicons name={category.icon} size={24} color={category.color} />
      </View>

      <Text numberOfLines={2} style={styles.label}>
        {category.name || category.label}
      </Text>

      {selected ? (
        <View style={styles.check}>
          <Ionicons name="checkmark" size={14} color={colors.white} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 140,

    padding: spacing.lg,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.lg,

    position: "relative",
  },

  iconContainer: {
    width: 46,
    height: 46,

    borderRadius: radius.md,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: spacing.md,
  },

  label: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 14,
  },

  check: {
    position: "absolute",
    top: 10,
    right: 10,

    width: 22,
    height: 22,

    borderRadius: 11,

    backgroundColor: colors.primary,

    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.8,
  },
});
