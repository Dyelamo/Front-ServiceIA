// src/screens/client/Step1DescribeScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import StepProgressBar from '../../components/StepProgressBar';
import WizardFooter from '../../components/WizardFooter';
import CategoryChip from '../../components/CategoryChip';
import { CATEGORIES } from '../../data/categories';
import { useRequestForm } from '../../hook/useRequestForm';

export default function Step1DescribeScreen({ navigation }) {
  const { form, updateForm } = useRequestForm();
  const [description, setDescription] = useState(form.description || '');
  const [categoryId, setCategoryId] = useState(form.categoryId);

  const canContinue = description.trim().length > 0 && !!categoryId;

  const handleContinue = () => {
    updateForm({ description, categoryId });
    navigation.navigate('Step2Location');
  };

  return (
    <View style={styles.screen}>
      <AppHeader />
      <StepProgressBar step={1} total={5} label="Problema" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cuéntanos qué necesitas</Text>
        <Text style={styles.subtitle}>Entre más detalles nos des, mejor será la recomendación.</Text>

        <TextInput
          style={styles.input}
          placeholder="Arreglo de aires"
          placeholderTextColor={colors.textMuted}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>¿A qué categoría se parece?</Text>
        <View style={styles.chipsGrid}>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              selected={categoryId === cat.id}
              style={styles.chip}
              onPress={() => setCategoryId(cat.id)}
            />
          ))}
        </View>
      </ScrollView>
      <WizardFooter
        backLabel="Inicio"
        onBack={() => navigation.navigate('Home')}
        onContinue={handleContinue}
        continueDisabled={!canContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h1, fontSize: 22, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 90,
    ...typography.body,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    marginBottom: spacing.xl,
  },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.md },
  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { marginBottom: spacing.sm },
});
