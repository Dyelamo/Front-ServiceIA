import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../../theme";

const TONES = {
  primary: {
    background: colors.primaryLight,

    text: colors.primaryDark,
  },

  success: {
    background: "#DCFCE7",

    text: "#15803D",
  },

  warning: {
    background: "#FEF3C7",

    text: "#B45309",
  },

  error: {
    background: "#FEE2E2",

    text: "#B91C1C",
  },

  neutral: {
    background: colors.surfaceSecondary,

    text: colors.textSecondary,
  },
};

const SIZES = {
  sm: {
    paddingHorizontal: spacing.sm,

    paddingVertical: 3,

    fontSize: 11,
  },

  md: {
    paddingHorizontal: spacing.md,

    paddingVertical: spacing.xs,

    fontSize: 12,
  },
};

export default function Badge({
  children,

  label,

  tone,

  type,

  size = "md",

  style,

  textStyle,
}) {
  const resolvedTone = tone || type || "neutral";

  const currentTone = TONES[resolvedTone] || TONES.neutral;

  const currentSize = SIZES[size] || SIZES.md;

  const content = children ?? label;

  if (content === undefined || content === null) {
    return null;
  }

  return (
    <View
      style={[
        styles.badge,

        {
          backgroundColor: currentTone.background,

          paddingHorizontal: currentSize.paddingHorizontal,

          paddingVertical: currentSize.paddingVertical,
        },

        style,
      ]}>
      <Text
        style={[
          styles.text,

          {
            color: currentTone.text,

            fontSize: currentSize.fontSize,
          },

          textStyle,
        ]}>
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",

    borderRadius: radius.pill,
  },

  text: {
    fontWeight: "700",
  },
});
