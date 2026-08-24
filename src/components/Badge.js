// src/components/Badge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme';

const VARIANTS = {
  warning: { bg: colors.warningLight, text: colors.warning },
  danger: { bg: colors.dangerLight, text: colors.danger },
  success: { bg: colors.successLight, text: colors.success },
  neutral: { bg: colors.background, text: colors.textSecondary },
};

export default function Badge({ label, type = 'neutral' }) {
  const variant = VARIANTS[type] || VARIANTS.neutral;
  return (
    <View style={[styles.badge, { backgroundColor: variant.bg }]}>
      <Text style={[styles.text, { color: variant.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  text: { ...typography.small, fontWeight: '700' },
});
