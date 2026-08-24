// src/components/StatCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';

export default function StatCard({ icon, value, label }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: { ...typography.h3, color: colors.textPrimary },
  label: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
