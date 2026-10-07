import React from "react";

import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../../theme/index";

import { ResponsiveContainer, Screen } from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

export default function AuthLayout({ children }) {
  const { isDesktop } = useResponsive();

  const formContent = (
    <ResponsiveContainer maxWidth={520} style={styles.formContainer}>
      {children}
    </ResponsiveContainer>
  );

  return (
    <Screen scroll={!isDesktop} backgroundColor={colors.surface}>
      <View style={[styles.wrapper, isDesktop && styles.wrapperDesktop]}>
        {isDesktop ? (
          <View style={styles.brandPanel}>
            <View style={styles.brandContent}>
              <Text style={styles.brand}>Serv-IA</Text>

              <Text style={styles.heroEyebrow}>SERVICIOS CERCA DE TI</Text>

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
          {isDesktop ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.desktopScroll}>
              {formContent}
            </ScrollView>
          ) : (
            formContent
          )}
        </View>
      </View>
    </Screen>
  );
}

function Feature({ text }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureCheck}>
        <Text style={styles.featureCheckText}>✓</Text>
      </View>

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

    minWidth: 0,

    backgroundColor: colors.primary,

    justifyContent: "center",

    padding: spacing.xxxl,
  },

  brandContent: {
    width: "100%",

    maxWidth: 560,

    alignSelf: "center",
  },

  brand: {
    fontSize: 27,

    fontWeight: "800",

    color: colors.white,

    marginBottom: spacing.xxxl,
  },

  heroEyebrow: {
    color: "rgba(255,255,255,0.72)",

    fontSize: 11,

    fontWeight: "800",

    letterSpacing: 1.2,

    marginBottom: spacing.md,
  },

  heroTitle: {
    fontSize: 42,

    lineHeight: 50,

    fontWeight: "800",

    color: colors.white,

    maxWidth: 500,
  },

  heroDescription: {
    marginTop: spacing.xl,

    fontSize: 17,

    lineHeight: 27,

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

  featureCheck: {
    width: 26,
    height: 26,

    borderRadius: 13,

    backgroundColor: "rgba(255,255,255,0.15)",

    alignItems: "center",

    justifyContent: "center",

    marginRight: spacing.md,
  },

  featureCheckText: {
    color: colors.white,

    fontSize: 13,

    fontWeight: "800",
  },

  featureText: {
    color: colors.white,

    fontSize: 15,

    fontWeight: "600",
  },

  formPanel: {
    flex: 1,

    minWidth: 0,

    backgroundColor: colors.surface,

    justifyContent: "center",
  },

  desktopScroll: {
    flexGrow: 1,

    justifyContent: "center",

    paddingVertical: spacing.xxxl,
  },

  formContainer: {
    paddingVertical: spacing.xxl,
  },
});
