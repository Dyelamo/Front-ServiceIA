// src/screens/client/Step5ReviewScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import StepProgressBar from '../../components/StepProgressBar';
import WizardFooter from '../../components/WizardFooter';
import InfoRow from '../../components/InfoRow';
import { CATEGORIES, URGENCY_OPTIONS } from '../../data/categories';
import { useRequestForm } from '../../hook/useRequestForm';
import { createServiceRequest } from '../../api/requestsService';

export default function Step5ReviewScreen({ navigation }) {
  const { form } = useRequestForm();
  const [loading, setLoading] = useState(false);

  const category = CATEGORIES.find((c) => c.id === form.categoryId);
  const urgency = URGENCY_OPTIONS.find((u) => u.id === form.urgencyId);

  const handleSubmit = async () => {
  setLoading(true);
  try {
    await createServiceRequest({
      description: form.description,
      categoryId: form.categoryId,
      categoryLabel: category?.label,
      urgencyLabel: urgency?.label,
      location: form.location,
    });
    navigation.navigate('AIReview');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.screen}>
      <AppHeader />
      <StepProgressBar step={5} total={5} label="Confirmar" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Revisa tu solicitud</Text>
        <Text style={styles.subtitle}>Confirma que todo esté correcto antes de buscar profesionales.</Text>

        <View style={styles.card}>
          <InfoRow label="Descripción">
            <Text style={styles.value}>{form.description || '—'}</Text>
          </InfoRow>
          <InfoRow label="Categoría">
            <View style={styles.inline}>
              {category && (
                <Ionicons name={category.icon} size={14} color={colors.primary} style={{ marginRight: 6 }} />
              )}
              <Text style={styles.value}>{category?.label || '—'}</Text>
            </View>
          </InfoRow>
          <InfoRow label="Ubicación">
            <Text style={styles.value}>{form.location.city}</Text>
          </InfoRow>
          <InfoRow label="Urgencia">
            <Text style={styles.value}>{urgency?.label || '—'}</Text>
          </InfoRow>
          <InfoRow label="Fotos" last>
            <Text style={styles.value}>
              {form.photos.length > 0 ? `${form.photos.length} foto(s)` : 'Sin fotos'}
            </Text>
          </InfoRow>
        </View>
      </ScrollView>
      <WizardFooter
        onBack={() => navigation.goBack()}
        onContinue={handleSubmit}
        continueLabel="Publicar solicitud"
        continueIcon="send"
        continueDisabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h1, fontSize: 22, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  value: { ...typography.bodyBold, color: colors.textPrimary },
  inline: { flexDirection: 'row', alignItems: 'center' },
});
