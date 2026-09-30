import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  spacing,
} from "../../../theme";

import {
  Button,
  Stepper,
} from "../../../shared/ui";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout";

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
  return (
    <Screen
      scroll
      backgroundColor={
        colors.background
      }
    >
      <AppHeader
        title="Nueva solicitud"
        onBack={() =>
          navigation.goBack()
        }
      />

      <ResponsiveContainer
        maxWidth={720}
        style={styles.container}
      >
        <Stepper
          current={
            currentStep
          }
          total={
            totalSteps
          }
        />

        <View
          style={
            styles.heading
          }
        >
          <Text
            style={
              styles.title
            }
          >
            {title}
          </Text>

          {description ? (
            <Text
              style={
                styles.description
              }
            >
              {description}
            </Text>
          ) : null}
        </View>

        <View
          style={
            styles.content
          }
        >
          {children}
        </View>

        {onContinue ? (
          <View
            style={
              styles.footer
            }
          >
            <Button
              onPress={
                onContinue
              }
              disabled={
                continueDisabled
              }
              loading={
                loading
              }
            >
              {continueLabel}
            </Button>
          </View>
        ) : null}
      </ResponsiveContainer>
    </Screen>
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingVertical:
        spacing.xxl,
    },

    heading: {
      marginTop:
        spacing.xxxl,
    },

    title: {
      color: colors.text,
      fontSize: 26,
      lineHeight: 34,
      fontWeight: "800",
    },

    description: {
      color:
        colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      marginTop:
        spacing.sm,
    },

    content: {
      marginTop:
        spacing.xxl,
    },

    footer: {
      marginTop:
        spacing.xxxl,
      paddingBottom:
        spacing.xxl,
    },
  });