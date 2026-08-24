// src/components/PrimaryButton.js
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';

export default function PrimaryButton({
  title,
  onPress,
  icon,
  iconPosition = 'right',
  disabled,
  loading,
  color = colors.primary,
  textColor = colors.white,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color },
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={18} color={textColor} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={18} color={textColor} style={styles.iconRight} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.bodyBold,
  },
  iconLeft: { marginRight: spacing.sm },
  iconRight: { marginLeft: spacing.sm },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});
