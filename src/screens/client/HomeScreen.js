// src/screens/client/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import PrimaryButton from '../../components/PrimaryButton';
import CategoryChip from '../../components/CategoryChip';
import { CATEGORIES } from '../../data/categories';
import { useRequestForm } from '../../hook/useRequestForm';

export default function HomeScreen({ navigation }) {
  const { form, updateForm } = useRequestForm();
  const [text, setText] = useState(form.description || '');

  const startSearch = () => {
    updateForm({ description: text });
    navigation.navigate('Step1Describe');
  };

  const goUrgent = () => {
    navigation.navigate('Step1Describe');
  };

  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.locationPill}>
          <Ionicons name="location-outline" size={14} color={colors.primary} />
          <Text style={styles.locationText}>Profesionales verificados en Valledupar</Text>
        </View>

        <Text style={styles.title}>¿Qué necesitas solucionar?</Text>
        <Text style={styles.subtitle}>
          Cuéntanos tu problema en tus palabras. Encontramos al profesional indicado cerca de ti.
        </Text>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Necesito un plomero porque tengo una fuga debajo del lavamanos…"
            placeholderTextColor={colors.textMuted}
            multiline
            value={text}
            onChangeText={setText}
          />
          <View style={styles.inputFooter}>
            <Text style={styles.inputHint}>Describe tu problema con tus palabras</Text>
            <PrimaryButton title="Buscar profesionales" icon="search" iconPosition="left" onPress={startSearch} />
          </View>
        </View>

        <View style={styles.chipsGrid}>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              style={styles.chip}
              onPress={() => {
                updateForm({ categoryId: cat.id });
                navigation.navigate('Step1Describe');
              }}
            />
          ))}
        </View>

        <View style={styles.urgentCard}>
          <View style={styles.urgentIcon}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
          </View>
          <Text style={styles.urgentTitle}>¿Necesitas ayuda urgente?</Text>
          <Text style={styles.urgentSubtitle}>
            Conecta con profesionales disponibles para atenderte hoy mismo.
          </Text>
          <PrimaryButton
            title="Solicitar servicio urgente"
            icon="arrow-forward"
            color={colors.dangerLight}
            textColor={colors.danger}
            style={styles.urgentButton}
            onPress={goUrgent}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: spacing.lg,
  },
  locationText: { ...typography.small, color: colors.primary, marginLeft: 6, fontWeight: '600' },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  inputCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  input: {
    minHeight: 70,
    ...typography.body,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  inputFooter: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  inputHint: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.sm },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  chip: { marginBottom: spacing.sm },
  urgentCard: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  urgentIcon: { marginBottom: spacing.sm },
  urgentTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 2 },
  urgentSubtitle: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.md },
  urgentButton: { alignSelf: 'stretch' },
});
