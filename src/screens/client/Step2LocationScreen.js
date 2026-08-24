// src/screens/client/Step2LocationScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import StepProgressBar from '../../components/StepProgressBar';
import WizardFooter from '../../components/WizardFooter';
import { useRequestForm } from '../../hook/useRequestForm';

export default function Step2LocationScreen({ navigation }) {
  const { form } = useRequestForm();

  return (
    <View style={styles.screen}>
      <AppHeader />
      <StepProgressBar step={2} total={5} label="Ubicación" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>¿Dónde necesitas el servicio?</Text>
        <Text style={styles.subtitle}>El profesional se desplazará hasta esta ubicación.</Text>

        <View style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.pinOuter}>
              <Ionicons name="location" size={20} color={colors.white} />
            </View>
            <View style={styles.pinDot} />
          </View>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <View style={{ marginLeft: spacing.sm }}>
              <Text style={styles.addressTitle}>{form.location.city}</Text>
              <Text style={styles.addressSubtitle}>{form.location.country}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.hint}>En la app real podrás ajustar el punto exacto en el mapa.</Text>
      </ScrollView>
      <WizardFooter
        onBack={() => navigation.goBack()}
        onContinue={() => navigation.navigate('Step3Urgency')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h1, fontSize: 22, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  mapCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  mapPlaceholder: {
    height: 220,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinOuter: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 0.4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  addressTitle: { ...typography.bodyBold, color: colors.textPrimary },
  addressSubtitle: { ...typography.caption, color: colors.textSecondary },
  hint: { ...typography.small, color: colors.textMuted, textAlign: 'center' },
});
