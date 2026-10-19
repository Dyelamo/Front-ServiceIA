import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
} from "../../theme";

export default function Stepper({
  current = 1,
  total = 5,
  showLabel = true,
}) {
  const progress = Math.min(
    Math.max(current / total, 0),
    1
  );

  return (
    <View style={styles.container}>
      {showLabel ? (
        <Text style={styles.label}>
          Paso {current} de {total}
        </Text>
      ) : null}

      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },

  track: {
    width: "100%",
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
});