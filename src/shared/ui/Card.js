import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  colors,
  radius,
  shadows,
  spacing,
} from "../../theme";

export default function Card({
  children,
  onPress,
  variant = "default",
  style,
}) {
  const cardStyles = [
    styles.base,
    variant === "outlined" && styles.outlined,
    variant === "elevated" && styles.elevated,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyles,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },

  elevated: {
    ...shadows.card,
  },

  pressed: {
    opacity: 0.9,
  },
});