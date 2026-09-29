import React from "react";

import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { spacing } from "../../theme";

export default function ResponsiveContainer({
  children,
  maxWidth = 1200,
  style,
}) {
  const { width } = useWindowDimensions();

  const horizontalPadding =
    width >= 1024
      ? spacing.xxxl
      : width >= 768
      ? spacing.xxl
      : spacing.lg;

  return (
    <View
      style={[
        styles.container,
        {
          maxWidth,
          paddingHorizontal: horizontalPadding,
        },
        style,
      ]}
    >
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