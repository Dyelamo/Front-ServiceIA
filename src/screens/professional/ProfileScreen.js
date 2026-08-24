// src/screens/professional/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import SecondaryButton from '../../components/SecondaryButton';
import { MOCK_PROFESSIONAL } from '../../data/mockData';

export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={26} color={colors.primary} />
            </View>
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={styles.name}>{MOCK_PROFESSIONAL.name}</Text>
              <Text style={styles.role}>{MOCK_PROFESSIONAL.role}</Text>
              {MOCK_PROFESSIONAL.verified && (
                <View style={styles.verifiedPill}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                  <Text style={styles.verifiedText}>Verificado</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="star-outline" size={16} color={colors.primary} />
              <Text style={styles.statValue}>{MOCK_PROFESSIONAL.rating}</Text>
              <Text style={styles.statLabel}>Calificación</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.statValue}>{MOCK_PROFESSIONAL.services}</Text>
              <Text style={styles.statLabel}>Servicios</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
              <Text style={styles.statValue}>{MOCK_PROFESSIONAL.reviews}</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.locationText}>{MOCK_PROFESSIONAL.location}</Text>
          </View>

          <SecondaryButton title="Editar perfil" icon="pencil" onPress={() => {}} style={{ marginTop: spacing.lg }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre mí</Text>
          <Text style={styles.aboutText}>{MOCK_PROFESSIONAL.about}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.verificationHeader}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.success} />
            <Text style={styles.sectionTitle}> Verificación</Text>
          </View>
          {MOCK_PROFESSIONAL.verification.map((item) => (
            <View key={item.id} style={styles.verificationRow}>
              <Text style={styles.verificationLabel}>{item.label}</Text>
              <View style={styles.verificationStatus}>
                {item.status === 'verificado' ? (
                  <>
                    <Ionicons name="document-text-outline" size={14} color={colors.success} />
                    <Text style={styles.verifiedStatusText}>Verificado</Text>
                  </>
                ) : (
                  <Text style={styles.pendingStatusText}>Pendiente</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { ...typography.h3, color: colors.textPrimary },
  role: { ...typography.caption, color: colors.textSecondary, marginBottom: 4 },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.successLight,
    borderRadius: radius.pill,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  verifiedText: { ...typography.small, color: colors.success, fontWeight: '700', marginLeft: 4 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  statValue: { ...typography.h3, color: colors.textPrimary, marginTop: 4 },
  statLabel: { ...typography.small, color: colors.textSecondary },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { ...typography.caption, color: colors.textSecondary, marginLeft: 6 },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  aboutText: { ...typography.body, color: colors.textSecondary, lineHeight: 21 },
  verificationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  verificationLabel: { ...typography.caption, color: colors.textPrimary },
  verificationStatus: { flexDirection: 'row', alignItems: 'center' },
  verifiedStatusText: { ...typography.small, color: colors.success, fontWeight: '700', marginLeft: 4 },
  pendingStatusText: { ...typography.small, color: colors.warning, fontWeight: '700' },
});
