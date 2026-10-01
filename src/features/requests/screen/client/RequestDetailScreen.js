import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  colors,
  spacing,
} from "../../../../theme/index";

import {
  Card,
} from "../../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../../shared/layout/index";

import RequestStatusBadge
  from "../../components/RequestStatusBadge";

export default function RequestDetailScreen({
  navigation,
  route,
}) {
  const request =
    route?.params?.request;

  if (!request) {
    return (
      <Screen>
        <AppHeader
          title="Publicación"
          onBack={() =>
            navigation.goBack()
          }
        />

        <ResponsiveContainer
          maxWidth={800}
          style={styles.container}
        >
          <Text>
            No encontramos la publicación.
          </Text>
        </ResponsiveContainer>
      </Screen>
    );
  }

  const description =
    request.descripcion ||
    request.description ||
    "Sin descripción";

  const category =
    request.categoria?.nombre ||
    request.categoria_nombre ||
    request.category ||
    "Servicio";

  const urgency =
    request.urgencia ||
    request.urgency ||
    "No especificada";

  const status =
    request.estado ||
    request.status ||
    "publicada";

  return (
    <Screen
      scroll
      backgroundColor={
        colors.background
      }
    >
      <AppHeader
        title="Detalle de publicación"
        onBack={() =>
          navigation.goBack()
        }
      />

      <ResponsiveContainer
        maxWidth={800}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.category}>
              {request.category}
            </Text>

            <Text style={styles.title}>
              {request.description}
            </Text>
          </View>

          <RequestStatusBadge
            status={request.status}
          />
        </View>

        <Card
          variant="outlined"
          style={styles.card}
        >
          <InfoRow
            icon="document-text-outline"
            label="Descripción"
            value={request.description}
          />

          <Divider />

          <InfoRow
            icon="grid-outline"
            label="Categoría"
            value={request.category}
          />

          <Divider />

          <InfoRow
            icon="time-outline"
            label="Urgencia"
            value={request.urgency}
          />

          <Divider />

          <InfoRow
            icon="location-outline"
            label="Ubicación"
            value={request.ubicacion || "Valledupar, Cesar"}
          />
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ofertas recibidas
          </Text>

          <Card variant="outlined">
            <View style={styles.emptyOffers}>
              <Ionicons
                name="people-outline"
                size={32}
                color={colors.textMuted}
              />

              <Text style={styles.emptyTitle}>
                Aún no hay ofertas
              </Text>

              <Text style={styles.emptyText}>
                Cuando un profesional envíe
                una propuesta aparecerá aquí.
              </Text>
            </View>
          </Card>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.primary}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return (
    <View style={styles.divider} />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.xxl,
  },

  headerText: {
    flex: 1,
    marginRight: spacing.lg,
  },

  category: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  title: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "800",
  },

  card: {
    padding: spacing.xl,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor:
      colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },

  infoLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },

  infoValue: {
    marginTop: 4,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  section: {
    marginTop: spacing.xxxl,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.lg,
  },

  emptyOffers: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },

  emptyTitle: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },

  emptyText: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
});