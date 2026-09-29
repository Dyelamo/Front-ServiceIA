import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../../theme";

export default function AuthHeader({ title, description }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Serv-IA</Text>

      <Text style={styles.title}>{title}</Text>

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

  description: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});
