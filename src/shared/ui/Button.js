import React from "react";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, spacing } from "../../theme/index";

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

  loadingLabel,

  fullWidth = true,

  leftIcon,
  rightIcon,

  accessibilityLabel,

  style,

  ...pressableProps
}) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;

  const sizeStyle = SIZES[size] || SIZES.md;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...pressableProps}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ||
        (typeof children === "string" ? children : undefined)
      }
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
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
      ]}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyle.textColor}
            style={styles.loadingIndicator}
          />
        ) : leftIcon ? (
          <View style={styles.leftIcon}>{leftIcon}</View>
        ) : null}

        <Text
          style={[
            styles.label,

            {
              color: variantStyle.textColor,

              fontSize: sizeStyle.fontSize,
            },
          ]}>
          {loading && loadingLabel ? loadingLabel : children}
        </Text>

        {!loading && rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>
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

    textAlign: "center",
  },

  leftIcon: {
    marginRight: spacing.sm,
  },

  rightIcon: {
    marginLeft: spacing.sm,
  },

  loadingIndicator: {
    marginRight: spacing.sm,
  },

  pressed: {
    opacity: 0.84,
  },

  disabled: {
    opacity: 0.5,
  },
});
