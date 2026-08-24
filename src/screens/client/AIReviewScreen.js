// src/screens/client/AIReviewScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { CATEGORIES, URGENCY_OPTIONS } from '../../data/categories';
import { useRequestForm } from '../../hook/useRequestForm';
import { MOCK_FOLLOWUP_QUESTIONS } from '../../data/mockData';

function AnalysisRow({ icon, label, children }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {children}
      </View>
    </View>
  );
}

export default function AIReviewScreen({ navigation }) {
  const { form, resetForm } = useRequestForm();
  const category = CATEGORIES.find((c) => c.id === form.categoryId);
  const urgency = URGENCY_OPTIONS.find((u) => u.id === form.urgencyId);

  const handleConfirm = () => {
    // Aquí se dispararía la búsqueda real de profesionales.
    resetForm();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.logoCircle}>
          <Ionicons name="build" size={16} color={colors.white} />
        </View>
        <Text style={styles.brand}>Manitas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.assistantTag}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
          <Text style={styles.assistantTagText}>Análisis del asistente</Text>
        </View>

        <Text style={styles.title}>Encontramos esto:</Text>
        <Text style={styles.subtitle}>Convertimos tu descripción en una solicitud estructurada.</Text>

        <View style={styles.card}>
          <AnalysisRow icon="pricetag-outline" label="CATEGORÍA">
            <Text style={styles.rowValue}>{category?.label || 'Servicio general'}</Text>
          </AnalysisRow>
          <View style={styles.divider} />
          <AnalysisRow icon="person-outline" label="TIPO DE SERVICIO">
            <Text style={styles.rowValue}>Servicio general</Text>
          </AnalysisRow>
          <View style={styles.divider} />
          <AnalysisRow icon="alert-circle-outline" label="URGENCIA">
            <View style={styles.pillWarning}>
              <Text style={styles.pillWarningText}>{urgency?.label === 'Ahora' ? 'Media' : (urgency?.label || 'Media')}</Text>
            </View>
          </AnalysisRow>
          <View style={styles.divider} />
          <AnalysisRow icon="checkmark-circle-outline" label="VISITA PRESENCIAL">
            <Text style={styles.rowValue}>Sí</Text>
          </AnalysisRow>
          <View style={styles.divider} />
          <AnalysisRow icon="location-outline" label="UBICACIÓN">
            <Text style={styles.rowValue}>{form.location.city.split(',')[0]}</Text>
          </AnalysisRow>
        </View>

        <View style={styles.followupCard}>
          <View style={styles.followupHeader}>
            <Ionicons name="sparkles-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.followupTitle}>Para afinar la búsqueda, el profesional podría preguntarte:</Text>
          </View>
          {MOCK_FOLLOWUP_QUESTIONS.map((q, idx) => (
            <View key={idx} style={styles.questionBox}>
              <Text style={styles.questionText}>{q}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.confirmQuestion}>¿Es correcto?</Text>

        <SecondaryButton title="Editar" icon="pencil" onPress={() => navigation.goBack()} style={{ marginBottom: spacing.md }} />
        <PrimaryButton title="Sí, continuar" icon="arrow-forward" onPress={handleConfirm} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoCircle: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  brand: { ...typography.h3, color: colors.textPrimary },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  assistantTag: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  assistantTagText: { ...typography.caption, color: colors.primary, fontWeight: '700', marginLeft: 6 },
  title: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowLabel: { ...typography.small, color: colors.textSecondary, marginBottom: 2 },
  rowValue: { ...typography.bodyBold, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.lg + 34 + spacing.md },
  pillWarning: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningLight,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  pillWarningText: { ...typography.small, color: colors.warning, fontWeight: '700' },
  followupCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  followupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  followupTitle: { ...typography.caption, color: colors.textSecondary, marginLeft: 6, flex: 1 },
  questionBox: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  questionText: { ...typography.caption, color: colors.textPrimary },
  confirmQuestion: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
