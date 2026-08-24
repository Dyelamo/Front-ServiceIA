// src/components/CategoryChip.js
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';

export default function CategoryChip({ label, icon, selected, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, style]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={selected ? colors.primary : colors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.chipBorder,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  icon: { marginRight: 6 },
  label: { ...typography.caption, color: colors.textPrimary, fontWeight: '600' },
  labelSelected: { color: colors.primary },
});
