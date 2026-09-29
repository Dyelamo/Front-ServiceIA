import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
} from "../../theme";

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
    ? colors.primary
    : colors.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
          },
        ]}
      >
        {leftIcon ? (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        ) : null}

        <TextInput
          {...props}
          placeholderTextColor={colors.textMuted}
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
          style={[
            styles.input,
            inputStyle,
          ]}
        />

        {rightIcon ? (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helper}>
          {helperText}
        </Text>
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

  inputContainer: {
    minHeight: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.text,
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
    marginTop: spacing.xs,
  },

  helper: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
});