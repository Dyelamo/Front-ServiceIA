// src/screens/professional/JobsScreen.js
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import Badge from '../../components/Badge';
import { formatCOP } from '../../utils';
import { MOCK_ACTIVE_JOBS, MOCK_COMPLETED_JOBS } from '../../data/mockData';

const TABS = [
  { id: 'activos', label: 'Activos' },
  { id: 'completados', label: 'Completados' },
];

function JobCard({ job }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobClient}>{job.client}</Text>
        </View>
        <Badge label={job.status} type={job.status === 'Completado' ? 'success' : 'warning'} />
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.metaText}>{job.location}</Text>
        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} style={{ marginLeft: spacing.sm }} />
        <Text style={styles.metaText}>{job.schedule}</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Precio acordado</Text>
        <Text style={styles.priceValue}>{formatCOP(job.price)}</Text>
      </View>
    </View>
  );
}

export default function JobsScreen() {
  const [tab, setTab] = useState('activos');
  const jobs = tab === 'activos' ? MOCK_ACTIVE_JOBS : MOCK_COMPLETED_JOBS;

  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mis trabajos</Text>
        <Text style={styles.subtitle}>Servicios que has aceptado y completado.</Text>

        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[styles.tabBtn, tab === t.id && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}

        <Text style={styles.hint}>
          Cuando un cliente acepta tu oferta, el trabajo aparece aquí para que gestiones la visita.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h1, fontSize: 24, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.background },
  tabText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: colors.textPrimary },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  jobTitle: { ...typography.bodyBold, color: colors.textPrimary },
  jobClient: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  metaText: { ...typography.small, color: colors.textSecondary, marginLeft: 4 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  priceLabel: { ...typography.caption, color: colors.textSecondary },
  priceValue: { ...typography.h3, color: colors.textPrimary },
  hint: { ...typography.small, color: colors.textMuted, marginTop: spacing.sm },
});
