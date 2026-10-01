import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../../../theme/index";

import { Button } from "../../../../../shared/ui/index";

import {
  ResponsiveContainer,
  Screen,
} from "../../../../../shared/layout/index";

import { useRequestDraft } from "../../../context/RequestDraftContext";

export default function SuccessScreen({ navigation, route }) {
  const { resetDraft } = useRequestDraft();

  const result = route?.params?.result;

  const publicationId =
    result?.apiData?.id ||
    result?.apiData?.publicacion_id ||
    result?.apiData?.data?.id;

  const handleGoHome = () => {
    resetDraft();

    navigation.popToTop();
  };

  const handleViewRequest = () => {
    resetDraft();

    /*
      Si tu backend devuelve un ID,
      más adelante podremos navegar
      directamente al detalle.

      Por ahora mandamos al tab de
      publicaciones.
    */
    /*NOTIFICAIONES*/

    navigation.navigate("ClientTabs", {
      screen: "MyRequests",
    });

    navigation.popToTop();

    navigation.navigate("ClientTabs", {
      screen: "MyRequests",
    });
  };

  return (
    <Screen backgroundColor={colors.background}>
      <ResponsiveContainer maxWidth={560} style={styles.container}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={48} color={colors.white} />
        </View>

        <Text style={styles.title}>¡Solicitud publicada!</Text>

        <Text style={styles.description}>
          Ahora los profesionales disponibles podrán revisar tu solicitud y
          enviarte sus ofertas.
        </Text>

        {publicationId ? (
          <View style={styles.referenceBox}>
            <Text style={styles.referenceLabel}>Número de solicitud</Text>

            <Text style={styles.referenceValue} numberOfLines={1}>
              {publicationId}
            </Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button onPress={handleViewRequest}>Ver mis publicaciones</Button>

          <Pressable
            onPress={handleGoHome}
            style={({ pressed }) => [
              styles.homeButton,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.homeButtonText}>Volver al inicio</Text>
          </Pressable>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingVertical: spacing.massive,
  },

  successIcon: {
    width: 96,
    height: 96,

    borderRadius: 48,

    backgroundColor: colors.success,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: spacing.xxl,
  },

  title: {
    color: colors.text,

    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800",

    textAlign: "center",
  },

  description: {
    marginTop: spacing.md,

    color: colors.textSecondary,

    fontSize: 15,
    lineHeight: 23,

    textAlign: "center",

    maxWidth: 440,
  },

  referenceBox: {
    width: "100%",

    marginTop: spacing.xxxl,

    padding: spacing.lg,

    borderRadius: radius.md,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "center",
  },

  referenceLabel: {
    color: colors.textMuted,

    fontSize: 12,
  },

  referenceValue: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 14,

    marginTop: 4,
  },

  actions: {
    width: "100%",

    marginTop: spacing.xxxl,
  },

  homeButton: {
    minHeight: 48,

    alignItems: "center",
    justifyContent: "center",

    marginTop: spacing.md,
  },

  homeButtonText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },

  pressed: {
    opacity: 0.6,
  },
});
