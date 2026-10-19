import React, { useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, layout, radius, spacing } from "../../../theme/index";

import { EmptyState } from "../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

import {
  MOCK_ACTIVE_JOBS,
  MOCK_COMPLETED_JOBS,
} from "../data/jobs.mock";

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

  const { isDesktop } = useResponsive();

  const jobs = tab === "activos" ? MOCK_ACTIVE_JOBS : MOCK_COMPLETED_JOBS;

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader title="Mis trabajos" maxWidth={layout.content.wide} />

      <ResponsiveContainer
        maxWidth={layout.content.wide}
        style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.title}>Mis trabajos</Text>

          <Text style={styles.subtitle}>
            Servicios que has aceptado y completado.
          </Text>
        </View>

        <View style={styles.tabsWrapper}>
          <View style={styles.tabs}>
            {TABS.map((item) => {
              const active = tab === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setTab(item.id)}
                  style={[styles.tab, active && styles.activeTab]}>
                  <Text
                    style={[styles.tabText, active && styles.activeTabText]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
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
          <View style={styles.grid}>
            {jobs.map((job) => (
              <View
                key={job.id}
                style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
                <JobCard job={job} />
              </View>
            ))}
          </View>
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
    lineHeight: 21,

    marginTop: spacing.xs,
  },

  tabsWrapper: {
    width: "100%",

    alignItems: "flex-start",

    marginBottom: spacing.xl,
  },

  tabs: {
    width: "100%",
    maxWidth: 420,

    flexDirection: "row",

    backgroundColor: colors.surface,

    borderWidth: 1,

    borderColor: colors.border,

    borderRadius: radius.pill,

    padding: 4,
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  wrapper: {
    width: "100%",

    padding: 6,

    marginBottom: spacing.sm,
  },

  wrapperDesktop: {
    width: "50%",
  },

  hint: {
    color: colors.textMuted,

    fontSize: 12,
    lineHeight: 18,

    marginTop: spacing.md,

    maxWidth: 620,
  },
});
