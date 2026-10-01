import React, { useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../../../theme/index";

import { EmptyState } from "../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";

import {
  MOCK_ACTIVE_JOBS,
  MOCK_COMPLETED_JOBS,
} from "../../../features/mocks/jobs.mock";

import JobCard from "../components/JobCard";

const TABS = [
  {
    id: "activos",
    label: "Activos",
  },
  {
    id: "completados",
    label: "Completados",
  },
];

export default function JobsScreen() {
  const [tab, setTab] = useState("activos");

  const jobs = tab === "activos" ? MOCK_ACTIVE_JOBS : MOCK_COMPLETED_JOBS;

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader title="Mis trabajos" />

      <ResponsiveContainer maxWidth={900} style={styles.container}>
        <Text style={styles.title}>Mis trabajos</Text>

        <Text style={styles.subtitle}>
          Servicios que has aceptado y completado.
        </Text>

        <View style={styles.tabs}>
          {TABS.map((item) => {
            const active = tab === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setTab(item.id)}
                style={[styles.tab, active && styles.activeTab]}>
                <Text style={[styles.tabText, active && styles.activeTabText]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {jobs.length === 0 ? (
          <EmptyState
            icon="briefcase-outline"
            title={
              tab === "activos"
                ? "No tienes trabajos activos"
                : "No tienes trabajos completados"
            }
            description="Cuando un cliente acepte una oferta, el trabajo aparecerá aquí."
          />
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}

        {jobs.length > 0 ? (
          <Text style={styles.hint}>
            Cuando un cliente acepta tu oferta, el trabajo aparece aquí para que
            gestiones la visita.
          </Text>
        ) : null}
      </ResponsiveContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },

  title: {
    color: colors.text,

    fontSize: 26,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.textSecondary,

    fontSize: 14,
    lineHeight: 21,

    marginTop: spacing.xs,

    marginBottom: spacing.xl,
  },

  tabs: {
    flexDirection: "row",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.pill,

    padding: 4,

    marginBottom: spacing.xl,
  },

  tab: {
    flex: 1,

    paddingVertical: 10,

    borderRadius: radius.pill,

    alignItems: "center",
  },

  activeTab: {
    backgroundColor: colors.primaryLight,
  },

  tabText: {
    color: colors.textSecondary,

    fontSize: 13,
    fontWeight: "600",
  },

  activeTabText: {
    color: colors.primaryDark,

    fontWeight: "700",
  },

  hint: {
    color: colors.textMuted,

    fontSize: 12,

    lineHeight: 18,

    marginTop: spacing.sm,
  },
});
