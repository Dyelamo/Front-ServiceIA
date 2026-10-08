import React, { useState } from "react";

import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radius, spacing } from "../../theme";

export default function Input({
  label,

  error,
  helperText,

  leftIcon,
  rightIcon,

  containerStyle,
  inputStyle,

  disabled = false,
  editable = true,

  accessibilityLabel,

  ...props
}) {
  const [focused, setFocused] = useState(false);

  const isDisabled = disabled || editable === false;

  const borderColor = error
    ? colors.error
    : focused
      ? colors.primary
      : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,

          {
            borderColor,
          },

          isDisabled && styles.inputContainerDisabled,
        ]}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          {...props}
          editable={!isDisabled}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityState={{
            disabled: isDisabled,
          }}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          onFocus={(event) => {
            setFocused(true);

            if (props.onFocus) {
              props.onFocus(event);
            }
          }}
          onBlur={(event) => {
            setFocused(false);

            if (props.onBlur) {
              props.onBlur(event);
            }
          }}
          style={[styles.input, isDisabled && styles.inputDisabled, inputStyle]}
        />
        {rightIcon ? (
          <View
            pointerEvents={isDisabled ? "none" : "auto"}
            style={styles.rightIcon}>
            {rightIcon}
          </View>
        ) : null}{" "}
      </View>

      {error ? (
        <Text style={styles.error}>{String(error)}</Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    fontSize: 14,

    fontWeight: "600",

    color: colors.text,

    marginBottom: spacing.sm,
  },

  labelDisabled: {
    color: colors.textMuted,
  },

  inputContainer: {
    minHeight: 48,

    backgroundColor: colors.surface,

    borderWidth: 1,

    borderRadius: radius.md,

    flexDirection: "row",

    alignItems: "center",
  },

  inputContainerDisabled: {
    backgroundColor: colors.surfaceSecondary,
  },

  input: {
    flex: 1,

    minHeight: 48,

    paddingHorizontal: spacing.lg,

    fontSize: 16,

    color: colors.text,
  },

  inputDisabled: {
    color: colors.textSecondary,
  },

  leftIcon: {
    marginLeft: spacing.lg,
  },

  rightIcon: {
    marginRight: spacing.lg,
  },

  error: {
    color: colors.error,

    fontSize: 13,

    lineHeight: 18,

    marginTop: spacing.xs,
  },

  helper: {
    color: colors.textMuted,

    fontSize: 13,

    lineHeight: 18,

    marginTop: spacing.xs,
  },
});
