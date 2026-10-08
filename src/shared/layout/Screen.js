import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

import { ScrollView, StyleSheet, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../theme";

export default function Screen({
  children,
  scroll = false,
  backgroundColor = colors.background,
  contentContainerStyle,
  style,
}) {
  if (scroll) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor,
          },
          style,
        ]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor,
        },
        style,
      ]}>
      <View style={[styles.content, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },
});
