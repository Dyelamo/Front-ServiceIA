import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../theme";

function getInitials(name = "") {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Avatar({
  source,
  name = "",
  size = 48,
}) {
  if (source) {
    return (
      <Image
        source={
          typeof source === "string"
            ? { uri: source }
            : source
        }
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.35,
          },
        ]}
      >
        {getInitials(name) || "?"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  initials: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
});