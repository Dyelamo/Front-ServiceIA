// src/screens/client/Step3UrgencyScreen.js
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import StepProgressBar from '../../components/StepProgressBar';
import WizardFooter from '../../components/WizardFooter';
import { URGENCY_OPTIONS } from '../../data/categories';
import { useRequestForm } from '../../hook/useRequestForm';

export default function Step3UrgencyScreen({ navigation }) {
  const { form, updateForm } = useRequestForm();
  const [urgencyId, setUrgencyId] = useState(form.urgencyId || 'ahora');

  const handleContinue = () => {
    updateForm({ urgencyId });
    navigation.navigate('Step4Photos');
  };

  return (
    <View style={styles.screen}>
      <AppHeader />
      <StepProgressBar step={3} total={5} label="Urgencia" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>¿Qué tan urgente es?</Text>
        <Text style={styles.subtitle}>Esto nos ayuda a mostrarte profesionales disponibles.</Text>

        {URGENCY_OPTIONS.map((opt) => {
          const selected = urgencyId === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setUrgencyId(opt.id)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <View style={styles.optionIcon}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={selected ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>
                  {opt.label}
                </Text>
                <Text style={styles.optionDesc}>{opt.description}</Text>
              </View>
              {selected && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      <WizardFooter
        onBack={() => navigation.goBack()}
        onContinue={handleContinue}
        continueDisabled={!urgencyId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h1, fontSize: 22, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionIcon: { marginRight: spacing.md },
  optionTitle: { ...typography.bodyBold, color: colors.textPrimary },
  optionTitleSelected: { color: colors.primary },
  optionDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
