import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, layout, spacing } from "../../../../theme/index";

import { Card, EmptyState } from "../../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../../shared/layout/index";

import { useResponsive } from "../../../../shared/hooks/useResponsive";

import RequestStatusBadge from "../../components/RequestStatusBadge";

export default function RequestDetailScreen({ navigation, route }) {
  const { isDesktop } = useResponsive();

  const request = route?.params?.request;

  if (!request) {
    return (
      <Screen>
        <AppHeader
          title="Publicación"
          onBack={() => navigation.goBack()}
          maxWidth={layout.content.wide}
        />

        <ResponsiveContainer
          maxWidth={layout.content.medium}
          style={styles.container}>
          <Text style={styles.notFound}>No encontramos la publicación.</Text>
        </ResponsiveContainer>
      </Screen>
    );
  }

  const description =
    request.description || request.descripcion || "Sin descripción";

  const category =
    request.categoryName ||
    request.categoria?.nombre ||
    request.categoria_nombre ||
    request.category ||
    "Servicio";

  const urgency =
    request.urgencyLabel ||
    request.urgencia ||
    request.urgency ||
    "No especificada";

  const status = request.status || request.estado || "publicada";

  const location = request.location || request.ubicacion || "Valledupar, Cesar";

  const createdAt = request.createdAt || request.created_at;

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader
        title="Detalle de publicación"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
      />

      <ResponsiveContainer
        maxWidth={layout.content.wide}
        style={styles.container}>
        {/* ENCABEZADO */}

        <View style={[styles.header, !isDesktop && styles.headerMobile]}>
          <View style={styles.headerText}>
            <Text style={styles.category}>{category}</Text>

            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
              {description}
            </Text>
          </View>

          <View style={[styles.status, !isDesktop && styles.statusMobile]}>
            <RequestStatusBadge status={status} />
          </View>
        </View>

        {/* INFORMACIÓN PRINCIPAL */}

        <View style={[styles.columns, !isDesktop && styles.columnsMobile]}>
          <View style={[styles.mainColumn, !isDesktop && styles.fullColumn]}>
            <Card variant="outlined" style={styles.card}>
              <SectionHeader icon="document-text-outline" title="Descripción" />

              <Text style={styles.description}>{description}</Text>
            </Card>
          </View>

          <View
            style={[
              styles.sideColumn,

              !isDesktop && styles.fullColumn,

              !isDesktop && styles.sideMobile,
            ]}>
            <Card variant="outlined" style={styles.card}>
              <SectionHeader
                icon="information-circle-outline"
                title="Información"
              />

              <InfoRow icon="grid-outline" label="Categoría" value={category} />

              <Divider />

              <InfoRow icon="time-outline" label="Urgencia" value={urgency} />

              <Divider />

              <InfoRow
                icon="location-outline"
                label="Ubicación"
                value={location}
              />

              {createdAt ? (
                <>
                  <Divider />

                  <InfoRow
                    icon="calendar-outline"
                    label="Publicada"
                    value={formatDate(createdAt)}
                  />
                </>
              ) : null}
            </Card>
          </View>
        </View>

        {/* OFERTAS */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ofertas recibidas</Text>

          <Card variant="outlined" style={styles.offersCard}>
            <EmptyState
              compact
              icon="people-outline"
              title="Aún no hay ofertas"
              description="Cuando un profesional envíe una propuesta, aparecerá aquí."
            />
          </Card>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.primary} />

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },

  notFound: {
    color: colors.textSecondary,

    fontSize: 15,
  },

  header: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent: "space-between",

    marginBottom: spacing.xxl,
  },

  headerMobile: {
    flexDirection: "column",
  },

  headerText: {
    flex: 1,

    maxWidth: 800,
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

  titleDesktop: {
    fontSize: 30,
    lineHeight: 39,
  },

  status: {
    marginLeft: spacing.xl,
  },

  statusMobile: {
    marginLeft: 0,

    marginTop: spacing.md,
  },

  columns: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xl,
  },

  columnsMobile: {
    flexDirection: "column",
    gap: 0,
  },

  mainColumn: {
    flex: 2,
  },

  sideColumn: {
    flex: 1,
    minWidth: 300,
  },

  fullColumn: {
    width: "100%",
    minWidth: 0,

    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },

  sideMobile: {
    marginTop: spacing.lg,
  },

  card: {
    width: "100%",

    padding: spacing.xl,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: spacing.xl,
  },

  sectionIcon: {
    width: 38,
    height: 38,

    borderRadius: 11,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    color: colors.text,

    fontSize: 17,
    fontWeight: "800",

    marginLeft: spacing.md,
  },

  description: {
    color: colors.textSecondary,

    fontSize: 15,
    lineHeight: 24,
  },

  infoRow: {
    flexDirection: "row",

    alignItems: "flex-start",
  },

  infoContent: {
    flex: 1,

    marginLeft: spacing.md,
  },

  infoLabel: {
    color: colors.textMuted,

    fontSize: 11,

    fontWeight: "600",
  },

  infoValue: {
    marginTop: 3,

    color: colors.text,

    fontSize: 14,
    lineHeight: 20,

    fontWeight: "600",
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

    fontWeight: "800",

    marginBottom: spacing.lg,
  },

  offersCard: {
    padding: spacing.xl,
  },
});
