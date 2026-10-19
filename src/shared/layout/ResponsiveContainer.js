import React from "react";

import { StyleSheet, View } from "react-native";

import { spacing } from "../../theme";

import { useResponsive } from "../hooks/useResponsive";

export default function ResponsiveContainer({
  children,
  style,
  maxWidth = 1200,
  noPadding = false,
}) {
  const { isMobile, isTablet } = useResponsive();

  const horizontalPadding = noPadding
    ? 0
    : isMobile
      ? spacing.md
      : isTablet
        ? spacing.lg
        : spacing.xl;

  return (
    <View
      style={[
        styles.container,

        {
          maxWidth,

          paddingHorizontal: horizontalPadding,
        },

        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",

    alignSelf: "center",
  },
});
