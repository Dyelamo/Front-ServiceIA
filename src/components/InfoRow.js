// src/components/InfoRow.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

export default function InfoRow({ label, children, last }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.value}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { ...typography.caption, color: colors.warning, width: 100 },
  value: { flex: 1, alignItems: 'flex-start' },
});
