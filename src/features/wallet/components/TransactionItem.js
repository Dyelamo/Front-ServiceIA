import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "../../../theme/index";

import { formatCOP } from "../../../utils";

export default function TransactionItem({ transaction }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons name="checkmark-circle" size={22} color={colors.success} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{transaction.title}</Text>

        <Text style={styles.meta}>{transaction.date}</Text>

        <Text style={styles.commission}>
          Comisión {formatCOP(transaction.commission)}
        </Text>
      </View>

      <Text style={styles.amount}>+{formatCOP(transaction.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: spacing.lg,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  icon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,

    marginLeft: spacing.md,
  },

  title: {
    color: colors.text,

    fontSize: 14,
    fontWeight: "700",
  },

  meta: {
    color: colors.textSecondary,

    fontSize: 12,

    marginTop: 3,
  },

  commission: {
    color: colors.textMuted,

    fontSize: 11,

    marginTop: 2,
  },

  amount: {
    color: colors.primaryDark,

    fontSize: 15,
    fontWeight: "800",

    marginLeft: spacing.md,
  },
});
