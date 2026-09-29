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
} from "../../theme";

const tones = {
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

export default function Badge({
  children,
  tone = "neutral",
}) {
  const currentTone = tones[tone] || tones.neutral;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: currentTone.background,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: currentTone.text,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },

  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});