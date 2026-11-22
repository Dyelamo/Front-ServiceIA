import React, { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { colors, layout, radius, spacing } from "../../../theme/index";
import { Button, Card, EmptyState, Skeleton } from "../../../shared/ui/index";
import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";
import { useResponsive } from "../../../shared/hooks/useResponsive";
import { formatCOP } from "../../../utils";
import { fetchProviderBalance, rechargeBalance } from "../api/wallet.api";
import TransactionItem from "../components/TransactionItem";

const QUICK_AMOUNTS = [20000, 50000, 100000, 200000];
const PAYMENT_METHODS = [
  { id: "nequi", label: "Nequi", icon: "phone-portrait-outline" },
  { id: "pse", label: "PSE / Banco", icon: "business-outline" },
  { id: "daviplata", label: "Daviplata", icon: "card-outline" },
];

export default function BalanceScreen({ navigation }) {
  const { isDesktop } = useResponsive();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balanceData, setBalanceData] = useState({
    saldo_disponible: 0,
    total_facturado_estimado: 0,
    tarifa_porcentaje: 7.0,
    total_comision: 0,
    trabajos: [],
  });

  // Modal de Recarga de Saldo
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("50000");
  const [selectedMethod, setSelectedMethod] = useState("nequi");
  const [recharging, setRecharging] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchProviderBalance();
      setBalanceData({
        saldo_disponible: Number(data?.saldo_disponible) || 0,
        total_facturado_estimado: Number(data?.total_facturado_estimado) || 0,
        tarifa_porcentaje: Number(data?.tarifa_porcentaje) || 7.0,
        total_comision: Number(data?.total_comision) || 0,
        trabajos: Array.isArray(data?.trabajos) ? data.trabajos : [],
      });
    } catch (error) {
      console.error("Error al cargar saldo:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleConfirmRecharge = async () => {
    const amount = Number(rechargeAmount);
    if (!amount || amount <= 0) {
      Alert.alert("Monto inválido", "Por favor ingresa un monto válido a recargar.");
      return;
    }

    setRecharging(true);
    try {
      await rechargeBalance(amount);
      setShowRechargeModal(false);
      Alert.alert(
        "¡Recarga exitosa!",
        `Has recargado ${formatCOP(amount)} a tu saldo de cuenta satisfactoriamente.`
      );
      await loadData();
    } catch (error) {
      console.error("Error al recargar saldo:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.detail || "No se pudo procesar la recarga. Intenta nuevamente."
      );
    } finally {
      setRecharging(false);
    }
  };

  return (
    <Screen
      scroll
      backgroundColor={colors.background}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />
      }>
      <AppHeader
        title="Saldo y comisiones"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
      />

      <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.title}>Saldo y comisiones</Text>
          <Text style={styles.subtitle}>
            Consulta el resumen estimado de tus servicios y mantén tu saldo recargado para comisiones.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrapper}>
            <Skeleton height={140} style={{ borderRadius: radius.lg }} />
            <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
              <Skeleton height={80} style={{ flex: 1, borderRadius: radius.md }} />
              <Skeleton height={80} style={{ flex: 1, borderRadius: radius.md }} />
            </View>
          </View>
        ) : (
          <>
            {/* TARJETA PRINCIPAL: SALDO DISPONIBLE PARA COMISIONES */}
            <View
              style={[styles.balanceCard, isDesktop && styles.balanceCardDesktop]}>
              <View>
                <View style={styles.balanceHeader}>
                  <Ionicons name="wallet-outline" size={20} color={colors.white} />
                  <Text style={styles.balanceLabel}>Saldo de tu cuenta</Text>
                </View>

                <Text style={styles.balanceValue}>
                  {formatCOP(balanceData.saldo_disponible)}
                </Text>

                <Text style={styles.balanceHint}>
                  Disponible para cubrir la tarifa fija del 7% por intermediación al ser aceptada tu oferta
                </Text>
              </View>

              <View
                style={[
                  styles.rechargeWrapper,
                  isDesktop && styles.rechargeDesktop,
                ]}>
                <Button
                  variant="secondary"
                  onPress={() => setShowRechargeModal(true)}
                  leftIcon={
                    <Ionicons
                      name="add-circle-outline"
                      size={18}
                      color={colors.primaryDark}
                    />
                  }>
                  Recargar saldo
                </Button>
              </View>
            </View>

            {/* TARJETAS DE ESTADÍSTICAS */}
            <View style={styles.stats}>
              <View
                style={[
                  styles.statWrapper,
                  isDesktop && styles.statWrapperDesktop,
                ]}>
                <Card variant="outlined" style={styles.statCard}>
                  <View style={styles.statHeaderRow}>
                    <Text style={styles.statLabel}>Total estimado conectado</Text>
                    <Ionicons name="trending-up-outline" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.statValue}>
                    {formatCOP(balanceData.total_facturado_estimado)}
                  </Text>
                  <Text style={styles.statSubtext}>
                    Monto estimado de ofertas aceptadas
                  </Text>
                </Card>
              </View>

              <View
                style={[
                  styles.statWrapper,
                  isDesktop && styles.statWrapperDesktop,
                ]}>
                <Card variant="outlined" style={styles.statCard}>
                  <View style={styles.statHeaderRow}>
                    <Text style={styles.statLabel}>Tarifa por intermediación (7%)</Text>
                    <Ionicons name="receipt-outline" size={16} color="#DC2626" />
                  </View>
                  <Text style={[styles.statValue, styles.commissionValue]}>
                    -{formatCOP(balanceData.total_comision)}
                  </Text>
                  <Text style={styles.statSubtext}>
                    7% fijo cobrado por conexión al aceptar la oferta
                  </Text>
                </Card>
              </View>
            </View>

            {/* AVISO IMPORTANTE: PAGOS DIRECTOS Y TARIFA DEL 7% */}
            <View style={styles.noticeBox}>
              <Ionicons name="information-circle" size={24} color="#0284C7" />
              <View style={styles.noticeTextWrapper}>
                <Text style={styles.noticeTitle}>
                  Cobro por intermediación y pagos directos
                </Text>
                <Text style={styles.noticeBody}>
                  La tarifa fija del 7% se cobra por intermediación y conexión al momento en que el cliente acepta la oferta realizada (no por finalización del trabajo). Los pagos del servicio se realizan directamente entre el cliente y tú (efectivo, transferencia o acuerdo interno). Debes contar con saldo disponible para poder enviar propuestas a las solicitudes.
                </Text>
              </View>
            </View>

            {/* SECCIÓN DE HISTORIAL DE TRABAJOS / MOVIMIENTOS */}
            <Text style={styles.sectionTitle}>Conexiones y comisiones por intermediación</Text>

            {balanceData.trabajos.length === 0 ? (
              <EmptyState
                icon="briefcase-outline"
                title="Sin conexiones aún"
                description="Cuando los clientes acepten tus propuestas, aparecerá aquí el desglose de la oferta y la comisión del 7% aplicada por conexión."
              />
            ) : (
              <Card variant="outlined" style={styles.transactionsCard}>
                {balanceData.trabajos.map((trabajo) => (
                  <TransactionItem key={trabajo.id} transaction={trabajo} />
                ))}
              </Card>
            )}
          </>
        )}

        {/* MODAL PARA RECARGAR SALDO */}
        <Modal
          visible={showRechargeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRechargeModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Ionicons name="wallet" size={22} color={colors.primary} />
                  <Text style={styles.modalTitle}>Recargar saldo de cuenta</Text>
                </View>
                <Pressable
                  onPress={() => setShowRechargeModal(false)}
                  hitSlop={8}
                  style={styles.closeButton}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </Pressable>
              </View>

              <Text style={styles.modalDescription}>
                Recarga saldo para cubrir la tarifa fija del 7% por los trabajos que realices en la plataforma.
              </Text>

              {/* Botones de montos rápidos */}
              <Text style={styles.fieldLabel}>Selecciona un monto rápido:</Text>
              <View style={styles.quickAmountsRow}>
                {QUICK_AMOUNTS.map((amt) => {
                  const isSelected = rechargeAmount === String(amt);
                  return (
                    <Pressable
                      key={amt}
                      style={[
                        styles.quickAmountBtn,
                        isSelected && styles.quickAmountBtnSelected,
                      ]}
                      onPress={() => setRechargeAmount(String(amt))}>
                      <Text
                        style={[
                          styles.quickAmountText,
                          isSelected && styles.quickAmountTextSelected,
                        ]}>
                        {formatCOP(amt)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Campo para monto personalizado */}
              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>
                O ingresa otro valor:
              </Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={rechargeAmount}
                  onChangeText={setRechargeAmount}
                  placeholder="Ej: 30000"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              {/* Métodos de pago */}
              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>
                Método de pago:
              </Text>
              <View style={styles.methodsRow}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <Pressable
                      key={method.id}
                      style={[
                        styles.methodCard,
                        isSelected && styles.methodCardSelected,
                      ]}
                      onPress={() => setSelectedMethod(method.id)}>
                      <Ionicons
                        name={method.icon}
                        size={20}
                        color={isSelected ? colors.primary : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.methodText,
                          isSelected && styles.methodTextSelected,
                        ]}>
                        {method.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.modalActions}>
                <Button
                  variant="outline"
                  onPress={() => setShowRechargeModal(false)}
                  style={{ flex: 1 }}>
                  Cancelar
                </Button>
                <Button
                  onPress={handleConfirmRecharge}
                  loading={recharging}
                  style={{ flex: 1.3 }}
                  leftIcon={
                    <Ionicons name="card-outline" size={16} color="#FFFFFF" />
                  }>
                  Confirmar recarga
                </Button>
              </View>
            </View>
          </View>
        </Modal>
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
  loadingWrapper: {
    paddingVertical: spacing.md,
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
    fontSize: 14,
    fontWeight: "600",
    marginLeft: spacing.sm,
    opacity: 0.9,
  },
  balanceValue: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  balanceHint: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 4,
  },
  rechargeWrapper: {
    width: "100%",
    marginTop: spacing.xl,
  },
  rechargeDesktop: {
    width: 200,
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
  statHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginTop: spacing.xs,
  },
  statSubtext: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  commissionValue: {
    color: "#DC2626",
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  noticeTextWrapper: {
    flex: 1,
  },
  noticeTitle: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  noticeBody: {
    color: "#0C4A6E",
    fontSize: 12,
    lineHeight: 18,
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

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalCard: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalCardDesktop: {
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  quickAmountsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  quickAmountBtn: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  quickAmountBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  quickAmountText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  quickAmountTextSelected: {
    color: colors.primaryDark,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textSecondary,
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  methodsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  methodCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  methodText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  methodTextSelected: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
});
