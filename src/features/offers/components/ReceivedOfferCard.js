import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme";
import { Button, Card } from "../../../shared/ui";

export default function ReceivedOfferCard({
  offer,
  onAccept,
  onMessage,
  accepting = false,
}) {
  const providerName =
    offer.provider?.nombre_completo ||
    offer.provider?.usuario?.nombre_completo ||
    offer.provider?.nombre ||
    "Profesional";
  const isAccepted =
    offer.status === "aceptada" || offer.status === "aceptado";
  const isPending = offer.status === "pendiente";

  return (
    <Card variant="outlined" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.providerIcon}>
          <Ionicons name="person-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.providerDetails}>
          <Text style={styles.providerName}>{providerName}</Text>
          <Text style={styles.status}>{offer.statusLabel}</Text>
        </View>
        <Text style={styles.price}>{formatCurrency(offer.price)}</Text>
      </View>

      <InfoRow
        icon="time-outline"
        label="Disponibilidad"
        value={offer.availability}
      />
      {offer.message ? (
        <InfoRow icon="chatbubble-outline" label="Propuesta" value={offer.message} />
      ) : null}

      {isPending ? (
        <Button
          onPress={onAccept}
          loading={accepting}
          loadingLabel="Aceptando..."
          style={styles.action}
          leftIcon={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />}>
          Aceptar oferta
        </Button>
      ) : null}

      {isAccepted ? (
        <Button
          onPress={onMessage}
          disabled={!offer.conversationId || !offer.providerId}
          variant="secondary"
          style={styles.action}
          leftIcon={
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color={colors.primaryDark}
            />
          }>
          {offer.conversationId && offer.providerId
            ? "Enviar mensaje"
            : "Chat no disponible"}
        </Button>
      ) : null}
    </Card>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={17} color={colors.primary} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "No especificada"}</Text>
      </View>
    </View>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  providerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },
  providerDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  providerName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  status: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  price: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "800",
    marginLeft: spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  infoValue: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  action: {
    marginTop: spacing.sm,
  },
});
