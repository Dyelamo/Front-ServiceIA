import React, { useEffect, useRef } from "react";

import { Animated, Platform, StyleSheet, View } from "react-native";

import { colors, radius } from "../../theme";

export default function Skeleton({
  width = "100%",

  height = 16,

  borderRadius = radius.sm,

  animated = true,

  style,
}) {
  const opacity = useRef(new Animated.Value(animated ? 0.4 : 1)).current;

  useEffect(() => {
    if (!animated) {
      opacity.setValue(1);

      return undefined;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,

          duration: 700,

          useNativeDriver: Platform.OS !== "web",
        }),

        Animated.timing(opacity, {
          toValue: 0.4,

          duration: 700,

          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animated, opacity]);

  const stylesArray = [
    styles.skeleton,

    {
      width,
      height,
      borderRadius,
    },

    style,
  ];

  if (!animated) {
    return <View accessible={false} style={stylesArray} />;
  }

  return (
    <Animated.View
      accessible={false}
      style={[
        ...stylesArray,

        {
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
});
