// src/components/WizardFooter.js
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import PrimaryButton from './PrimaryButton';

export default function WizardFooter({
  onBack,
  backLabel = 'Atrás',
  onContinue,
  continueLabel = 'Continuar',
  continueIcon = 'arrow-forward',
  continueDisabled,
}) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={16} color={colors.textPrimary} />
        <Text style={styles.backText}>{backLabel}</Text>
      </Pressable>

      <PrimaryButton
        title={continueLabel}
        icon={continueIcon}
        onPress={onContinue}
        disabled={continueDisabled}
        style={styles.continueBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm },
  backText: { ...typography.bodyBold, color: colors.textPrimary, marginLeft: spacing.xs },
  continueBtn: { paddingHorizontal: spacing.xl },
});
