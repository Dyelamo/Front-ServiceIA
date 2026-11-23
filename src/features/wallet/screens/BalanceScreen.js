import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, layout, radius, spacing } from "../../../theme/index";

import { Button, Card, EmptyState } from "../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

import { formatCOP } from "../../../utils";

import { MOCK_BALANCE_SUMMARY, MOCK_TRANSACTIONS } from "../data/wallet.mock";

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

      <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
        <View style={styles.previewBanner}>
          <View style={styles.previewIcon}>
            <Ionicons name="construct-outline" size={20} color="#9A3412" />
          </View>
          <View style={styles.previewCopy}>
            <Text style={styles.previewTitle}>Vista previa del módulo financiero</Text>
            <Text style={styles.previewText}>
              Esta pantalla presenta el diseño. Los saldos, movimientos y retiros aún no están
              conectados.
            </Text>
          </View>
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>PRÓXIMAMENTE</Text>
          </View>
        </View>

        <View style={styles.heading}>
          <Text style={styles.title}>Saldo y ganancias</Text>

          <Text style={styles.subtitle}>Consulta el resumen de tus servicios y movimientos.</Text>
        </View>

        <View style={[styles.balanceCard, isDesktop && styles.balanceCardDesktop]}>
          <View>
            <View style={styles.balanceHeader}>
              <Ionicons name="wallet-outline" size={18} color={colors.white} />

              <Text style={styles.balanceLabel}>Saldo disponible</Text>
            </View>

            <Text style={styles.balanceValue}>{formatCOP(MOCK_BALANCE_SUMMARY.available)}</Text>
          </View>

          <View style={[styles.withdrawWrapper, isDesktop && styles.withdrawDesktop]}>
            <Button variant="secondary" disabled>
              Retiros próximamente
            </Button>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={[styles.statWrapper, isDesktop && styles.statWrapperDesktop]}>
            <Card variant="outlined" style={styles.statCard}>
              <Text style={styles.statLabel}>Total facturado</Text>

              <Text style={styles.statValue}>{formatCOP(MOCK_BALANCE_SUMMARY.totalBilled)}</Text>
            </Card>
          </View>

          <View style={[styles.statWrapper, isDesktop && styles.statWrapperDesktop]}>
            <Card variant="outlined" style={styles.statCard}>
              <Text style={styles.statLabel}>Comisión</Text>

              <Text style={[styles.statValue, styles.commissionValue]}>
                -{formatCOP(MOCK_BALANCE_SUMMARY.commission)}
              </Text>
            </Card>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Movimientos recientes</Text>
          <Text style={styles.demoLabel}>DATOS DE EJEMPLO</Text>
        </View>

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
          Los valores mostrados son demostrativos y no representan dinero real ni operaciones de tu
          cuenta. La integración será realizada posteriormente por el equipo de pagos.
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
  previewBanner: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: radius.lg,
  },
  previewIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#FFEDD5",
  },
  previewCopy: {
    flex: 1,
    minWidth: 220,
  },
  previewTitle: {
    color: "#9A3412",
    fontSize: 14,
    fontWeight: "800",
  },
  previewText: {
    color: "#9A3412",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  previewBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: "#FFEDD5",
  },
  previewBadgeText: {
    color: "#9A3412",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
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

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xxxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,

    fontSize: 19,

    fontWeight: "700",
  },
  demoLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
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
