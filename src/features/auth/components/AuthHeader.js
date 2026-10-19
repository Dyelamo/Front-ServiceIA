import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../../theme/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

export default function AuthHeader({ title, description }) {
  const { isDesktop } = useResponsive();

  return (
    <View style={styles.container}>
      {!isDesktop ? <Text style={styles.logo}>Serv-IA</Text> : null}

      <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
        {title}
      </Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxxl,
  },

  logo: {
    color: colors.primary,

    fontSize: 24,

    fontWeight: "800",

    marginBottom: spacing.xxxl,
  },

  title: {
    color: colors.text,

    fontSize: 30,

    lineHeight: 38,

    fontWeight: "800",
  },

  titleDesktop: {
    fontSize: 34,

    lineHeight: 42,
  },

  description: {
    marginTop: spacing.sm,

    color: colors.textSecondary,

    fontSize: 15,

    lineHeight: 22,

    maxWidth: 460,
  },
});
