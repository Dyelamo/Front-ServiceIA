import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, layout, radius, spacing } from "../../../theme/index";

import { Button, Card, EmptyState } from "../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

import { formatCOP } from "../../../utils";

import {
  MOCK_BALANCE_SUMMARY,
  MOCK_TRANSACTIONS,
} from "../../../features/mocks/wallet.mock";

import TransactionItem from "../components/TransactionItem";

export default function BalanceScreen({ navigation }) {
  const { isDesktop } = useResponsive();

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader
        title="Saldo y ganancias"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
      />

      <ResponsiveContainer
        maxWidth={layout.content.wide}
        style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.title}>Saldo y ganancias</Text>

          <Text style={styles.subtitle}>
            Consulta el resumen de tus servicios y movimientos.
          </Text>
        </View>

        <View
          style={[styles.balanceCard, isDesktop && styles.balanceCardDesktop]}>
          <View>
            <View style={styles.balanceHeader}>
              <Ionicons name="wallet-outline" size={18} color={colors.white} />

              <Text style={styles.balanceLabel}>Saldo disponible</Text>
            </View>

            <Text style={styles.balanceValue}>
              {formatCOP(MOCK_BALANCE_SUMMARY.available)}
            </Text>
          </View>

          <View
            style={[
              styles.withdrawWrapper,

              isDesktop && styles.withdrawDesktop,
            ]}>
            <Button variant="secondary" onPress={() => {}}>
              Retirar a mi cuenta
            </Button>
          </View>
        </View>

        <View style={styles.stats}>
          <View
            style={[
              styles.statWrapper,

              isDesktop && styles.statWrapperDesktop,
            ]}>
            <Card variant="outlined" style={styles.statCard}>
              <Text style={styles.statLabel}>Total facturado</Text>

              <Text style={styles.statValue}>
                {formatCOP(MOCK_BALANCE_SUMMARY.totalBilled)}
              </Text>
            </Card>
          </View>

          <View
            style={[
              styles.statWrapper,

              isDesktop && styles.statWrapperDesktop,
            ]}>
            <Card variant="outlined" style={styles.statCard}>
              <Text style={styles.statLabel}>Comisión</Text>

              <Text style={[styles.statValue, styles.commissionValue]}>
                -{formatCOP(MOCK_BALANCE_SUMMARY.commission)}
              </Text>
            </Card>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Movimientos recientes</Text>

        {MOCK_TRANSACTIONS.length === 0 ? (
          <EmptyState
            icon="wallet-outline"
            title="Sin movimientos"
            description="Tus movimientos aparecerán aquí cuando tengas operaciones registradas."
          />
        ) : (
          <Card variant="outlined" style={styles.transactionsCard}>
            {MOCK_TRANSACTIONS.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </Card>
        )}

        <Text style={styles.mockNotice}>
          Este módulo todavía usa datos simulados mientras se integra el backend
          de pagos.
        </Text>
      </ResponsiveContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },

  heading: {
    marginBottom: spacing.xl,
  },

  title: {
    color: colors.text,

    fontSize: 26,

    fontWeight: "800",
  },

  subtitle: {
    color: colors.textSecondary,

    fontSize: 14,

    marginTop: spacing.xs,
  },

  balanceCard: {
    backgroundColor: colors.primary,

    borderRadius: radius.lg,

    padding: spacing.xxl,
  },

  balanceCardDesktop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  balanceHeader: {
    flexDirection: "row",

    alignItems: "center",
  },

  balanceLabel: {
    color: colors.white,

    fontSize: 13,

    marginLeft: spacing.sm,

    opacity: 0.85,
  },

  balanceValue: {
    color: colors.white,

    fontSize: 34,

    fontWeight: "800",

    marginTop: spacing.sm,
  },

  withdrawWrapper: {
    width: "100%",

    marginTop: spacing.xl,
  },

  withdrawDesktop: {
    width: 220,

    marginTop: 0,

    marginLeft: spacing.xl,
  },

  stats: {
    flexDirection: "row",

    flexWrap: "wrap",

    marginHorizontal: -6,

    marginTop: spacing.lg,
  },

  statWrapper: {
    width: "100%",

    padding: 6,
  },

  statWrapperDesktop: {
    width: "50%",
  },

  statCard: {
    width: "100%",
    height: "100%",

    padding: spacing.lg,
  },

  statLabel: {
    color: colors.textSecondary,

    fontSize: 12,
  },

  statValue: {
    color: colors.text,

    fontSize: 20,

    fontWeight: "800",

    marginTop: spacing.xs,
  },

  commissionValue: {
    color: colors.error,
  },

  sectionTitle: {
    color: colors.text,

    fontSize: 19,

    fontWeight: "700",

    marginTop: spacing.xxxl,

    marginBottom: spacing.md,
  },

  transactionsCard: {
    paddingHorizontal: spacing.lg,
  },

  mockNotice: {
    color: colors.textMuted,

    fontSize: 11,

    lineHeight: 17,

    marginTop: spacing.lg,

    maxWidth: 620,
  },
});
