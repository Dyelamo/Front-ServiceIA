import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "../../theme/index";

import { useResponsive } from "../hooks/useResponsive";

import ResponsiveContainer from "./ResponsiveContainer";

export default function AppHeader({
  title,
  subtitle,
  onBack,
  right,
  maxWidth = 1200,
  showBorder = true,
}) {
  const { isDesktop } = useResponsive();

  return (
    <View style={[styles.header, showBorder && styles.headerBorder]}>
      <ResponsiveContainer maxWidth={maxWidth}>
        <View style={[styles.row, isDesktop && styles.rowDesktop]}>
          <View style={styles.leftSection}>
            {onBack ? (
              <Pressable
                onPress={onBack}
                accessibilityRole="button"
                accessibilityLabel="Volver"
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.pressed,
                ]}
                hitSlop={8}>
                <Ionicons name="arrow-back" size={22} color={colors.text} />
              </Pressable>
            ) : null}

            <View style={styles.titleArea}>
              {title ? (
                <Text
                  accessibilityRole="header"
                  style={[styles.title, isDesktop && styles.titleDesktop]}
                  numberOfLines={1}>
                  {title}
                </Text>
              ) : null}

              {subtitle ? (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>

          {right ? <View style={styles.rightSection}>{right}</View> : null}
        </View>
      </ResponsiveContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",

    backgroundColor: colors.surface,
  },

  headerBorder: {
    borderBottomWidth: 1,

    borderBottomColor: colors.border,
  },

  row: {
    minHeight: 64,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  rowDesktop: {
    minHeight: 70,
  },

  leftSection: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",
  },

  backButton: {
    width: 40,
    height: 40,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",

    marginRight: spacing.sm,
  },

  pressed: {
    opacity: 0.7,
  },

  titleArea: {
    flex: 1,
  },

  title: {
    color: colors.text,

    fontSize: 18,

    fontWeight: "800",
  },

  titleDesktop: {
    fontSize: 20,
  },

  subtitle: {
    color: colors.textSecondary,

    fontSize: 12,

    marginTop: 2,
  },

  rightSection: {
    marginLeft: spacing.md,

    flexDirection: "row",

    alignItems: "center",
  },
});
