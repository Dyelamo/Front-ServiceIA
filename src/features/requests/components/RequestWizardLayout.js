import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { colors, layout, radius, spacing } from "../../../theme/index";

import { Button, Stepper } from "../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

export default function RequestWizardLayout({
  navigation,

  currentStep,
  totalSteps = 5,

  title,
  description,

  children,

  onContinue,
  continueLabel = "Continuar",

  continueDisabled = false,
  loading = false,
}) {
  const { isMobile, isDesktop } = useResponsive();

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader
        title="Nueva solicitud"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.medium}
      />

      <ResponsiveContainer
        maxWidth={layout.content.medium}
        style={styles.container}>
        <View style={[styles.wizard, isDesktop && styles.wizardDesktop]}>
          {/* PROGRESO */}

          <View style={[styles.inner, isDesktop && styles.innerDesktop]}>
            <Stepper current={currentStep} total={totalSteps} />

            {/* ENCABEZADO */}

            <View style={[styles.heading, isDesktop && styles.headingDesktop]}>
              <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                {title}
              </Text>

              {description ? (
                <Text
                  style={[
                    styles.description,

                    isDesktop && styles.descriptionDesktop,
                  ]}>
                  {description}
                </Text>
              ) : null}
            </View>

            {/* CONTENIDO */}

            <View style={[styles.content, isDesktop && styles.contentDesktop]}>
              {children}
            </View>

            {/* FOOTER */}

            {onContinue ? (
              <View style={[styles.footer, isDesktop && styles.footerDesktop]}>
                <View
                  style={[
                    styles.footerButton,

                    !isMobile && styles.footerButtonWide,
                  ]}>
                  <Button
                    onPress={onContinue}
                    disabled={continueDisabled}
                    loading={loading}>
                    {continueLabel}
                  </Button>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
  },

  /*
   * En móvil el wizard se integra
   * directamente con el fondo.
   */
  wizard: {
    width: "100%",
  },

  /*
   * En desktop aparece como panel.
   */
  wizardDesktop: {
    backgroundColor: colors.surface,

    borderWidth: 1,

    borderColor: colors.border,

    borderRadius: radius.lg,

    paddingVertical: spacing.xxl,
  },

  inner: {
    width: "100%",
  },

  innerDesktop: {
    width: "100%",

    maxWidth: 720,

    alignSelf: "center",

    paddingHorizontal: spacing.xxl,
  },

  heading: {
    marginTop: spacing.xxl,
  },

  headingDesktop: {
    marginTop: spacing.xxxl,
  },

  title: {
    color: colors.text,

    fontSize: 26,
    lineHeight: 34,

    fontWeight: "800",
  },

  titleDesktop: {
    fontSize: 32,
    lineHeight: 40,
  },

  description: {
    color: colors.textSecondary,

    fontSize: 15,
    lineHeight: 22,

    marginTop: spacing.sm,
  },

  descriptionDesktop: {
    fontSize: 16,
    lineHeight: 24,

    maxWidth: 620,
  },

  content: {
    marginTop: spacing.xxl,
  },

  contentDesktop: {
    marginTop: spacing.xxxl,
  },

  footer: {
    marginTop: spacing.xxxl,

    paddingBottom: spacing.xxl,
  },

  footerDesktop: {
    flexDirection: "row",

    justifyContent: "flex-end",

    paddingBottom: 0,
  },

  footerButton: {
    width: "100%",
  },

  footerButtonWide: {
    width: 220,
  },
});
