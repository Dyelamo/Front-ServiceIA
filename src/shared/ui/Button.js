import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, spacing } from "../../theme";

const VARIANTS = {
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    textColor: "#FFFFFF",
  },

  secondary: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
    textColor: colors.primaryDark,
  },

  outline: {
    backgroundColor: "transparent",
    borderColor: colors.borderStrong,
    textColor: colors.text,
  },

  danger: {
    backgroundColor: colors.error,
    borderColor: colors.error,
    textColor: "#FFFFFF",
  },

  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: colors.primary,
  },
};

const SIZES = {
  sm: {
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    fontSize: 14,
  },

  md: {
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    fontSize: 16,
  },

  lg: {
    minHeight: 56,
    paddingHorizontal: spacing.xxl,
    fontSize: 16,
  },
};

export default function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
}) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyle = SIZES[size] || SIZES.md;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
          minHeight: sizeStyle.minHeight,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.textColor} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}

          <Text
            style={[
              styles.label,
              {
                color: variantStyle.textColor,
                fontSize: sizeStyle.fontSize,
              },
            ]}
          >
            {children}
          </Text>

          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },

  fullWidth: {
    width: "100%",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontWeight: "600",
  },

  icon: {
    marginHorizontal: spacing.xs,
  },

  pressed: {
    opacity: 0.85,
  },

  disabled: {
    opacity: 0.5,
  },
});