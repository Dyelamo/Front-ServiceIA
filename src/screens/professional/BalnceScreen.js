// src/screens/professional/BalanceScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import PrimaryButton from '../../components/PrimaryButton';
import { formatCOP } from '../../utils';
import { MOCK_BALANCE_SUMMARY, MOCK_TRANSACTIONS } from '../../data/mockData';

function TransactionCard({ tx }) {
  return (
    <View style={styles.txCard}>
      <View style={styles.txIcon}>
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      </View>
      <Text style={styles.txTitle}>{tx.title}</Text>
      <Text style={styles.txMeta}>
        {tx.date} · Comisión {formatCOP(tx.commission)}
      </Text>
      <Text style={styles.txAmount}>+{formatCOP(tx.amount)}</Text>
    </View>
  );
}

export default function BalanceScreen() {
  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Saldo y ganancias</Text>
        <Text style={styles.subtitle}>Resumen de tus servicios en Valledupar.</Text>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet-outline" size={16} color={colors.white} />
            <Text style={styles.balanceLabel}>Saldo disponible</Text>
          </View>
          <Text style={styles.balanceValue}>{formatCOP(MOCK_BALANCE_SUMMARY.available)}</Text>
          <PrimaryButton
            title="Retirar a mi cuenta"
            icon="arrow-down-outline"
            iconPosition="left"
            color="rgba(255,255,255,0.15)"
            style={styles.withdrawBtn}
            onPress={() => {}}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>Total facturado</Text>
            <Text style={styles.smallValue}>{formatCOP(MOCK_BALANCE_SUMMARY.totalBilled)}</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>% Comisión Manitas</Text>
            <Text style={[styles.smallValue, { color: colors.danger }]}>
              -{formatCOP(MOCK_BALANCE_SUMMARY.commission)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Movimientos recientes</Text>
        {MOCK_TRANSACTIONS.map((tx) => (
          <TransactionCard key={tx.id} tx={tx} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h1, fontSize: 24, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  balanceLabel: { ...typography.caption, color: colors.white, marginLeft: 6, opacity: 0.85 },
  balanceValue: { fontSize: 32, fontWeight: '800', color: colors.white, marginBottom: spacing.lg },
  withdrawBtn: { alignSelf: 'stretch' },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  smallCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  smallLabel: { ...typography.small, color: colors.textSecondary, marginBottom: 4 },
  smallValue: { ...typography.h3, color: colors.textPrimary },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  txCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  txIcon: { marginBottom: spacing.sm },
  txTitle: { ...typography.bodyBold, color: colors.textPrimary, textAlign: 'center' },
  txMeta: { ...typography.small, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.sm },
  txAmount: { ...typography.h3, color: colors.textPrimary },
});
