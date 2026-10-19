import React from "react";
import { View } from "react-native";

import { colors } from "../../theme";

export default function Divider({
  marginVertical = 16,
}) {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: colors.border,
        marginVertical,
      }}
    />
  );
}