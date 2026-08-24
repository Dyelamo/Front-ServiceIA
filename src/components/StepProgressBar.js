// src/components/StepProgressBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

export default function StepProgressBar({ step, total = 5, label }) {
  const progress = step / total;
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.stepText}>
          Paso {step} de {total}
        </Text>
        {!!label && <Text style={styles.label}>{label}</Text>}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stepText: { ...typography.caption, color: colors.textPrimary, fontWeight: '700' },
  label: { ...typography.caption, color: colors.textMuted },
  track: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radiusFallback(),
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    backgroundColor: colors.primary,
  },
});

// pequeño helper para no importar radius solo por un valor
function radiusFallback() {
  return 4;
}
