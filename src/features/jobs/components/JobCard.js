import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme/index";

import { Badge, Card } from "../../../shared/ui/index";

import { formatCOP } from "../../../utils";

export default function JobCard({ job }) {
  const isCompleted = job.status === "Completado";

  return (
    <Card variant="outlined" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{job.title}</Text>

          <Text style={styles.client}>{job.client}</Text>
        </View>

        <Badge label={job.status} type={isCompleted ? "success" : "warning"} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.textSecondary}
          />

          <Text style={styles.metaText}>{job.location}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textSecondary}
          />

          <Text style={styles.metaText}>{job.schedule}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Precio acordado</Text>

        <Text style={styles.price}>{formatCOP(job.price)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,

    marginBottom: spacing.md,
  },

  header: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent: "space-between",
  },

  headerCopy: {
    flex: 1,

    marginRight: spacing.md,
  },

  title: {
    color: colors.text,

    fontSize: 16,
    fontWeight: "700",
  },

  client: {
    color: colors.textSecondary,

    fontSize: 13,

    marginTop: 3,
  },

  metaRow: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: spacing.md,

    marginTop: spacing.lg,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaText: {
    color: colors.textSecondary,

    fontSize: 12,

    marginLeft: 5,
  },

  divider: {
    height: 1,

    backgroundColor: colors.border,

    marginVertical: spacing.lg,
  },

  priceRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  priceLabel: {
    color: colors.textSecondary,

    fontSize: 13,
  },

  price: {
    color: colors.text,

    fontSize: 18,
    fontWeight: "800",
  },
});
