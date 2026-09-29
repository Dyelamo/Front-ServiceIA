import React from "react";

import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { colors, spacing, typography } from "../../../theme";

import { Screen, ResponsiveContainer } from "../../../shared/layout";

export default function AuthLayout({ children }) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;

  return (
    <Screen scroll={!isDesktop} backgroundColor={colors.surface}>
      <View style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
        {isDesktop ? (
          <View style={styles.brandPanel}>
            <View style={styles.brandContent}>
              <Text style={styles.brand}>Serv-IA</Text>

              <Text style={styles.heroTitle}>
                Encuentra ayuda para lo que necesitas.
              </Text>

              <Text style={styles.heroDescription}>
                Publica tu solicitud y conecta con profesionales que puedan
                ayudarte.
              </Text>

              <View style={styles.features}>
                <Feature text="Publica lo que necesitas" />
                <Feature text="Recibe ofertas de profesionales" />
                <Feature text="Compara y elige" />
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.formPanel}>
          <ResponsiveContainer maxWidth={480} style={styles.formContainer}>
            {children}
          </ResponsiveContainer>
        </View>
      </View>
    </Screen>
  );
}

function Feature({ text }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureDot} />

      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  wrapperDesktop: {
    flexDirection: "row",
    minHeight: "100%",
  },

  brandPanel: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    padding: spacing.massive,
  },

  brandContent: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },

  brand: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.white,
    marginBottom: spacing.massive,
  },

  heroTitle: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: "800",
    color: colors.white,
    maxWidth: 500,
  },

  heroDescription: {
    marginTop: spacing.xxl,
    fontSize: 18,
    lineHeight: 28,
    color: "rgba(255,255,255,0.85)",
    maxWidth: 480,
  },

  features: {
    marginTop: spacing.xxxl,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginRight: spacing.md,
  },

  featureText: {
    color: colors.white,
    fontSize: 15,
  },

  formPanel: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  formContainer: {
    paddingVertical: spacing.massive,
  },
});
