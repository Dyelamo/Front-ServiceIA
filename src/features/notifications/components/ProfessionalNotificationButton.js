import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../theme";
import { unreadBadge, useUnreadCounts } from "../hooks/useUnreadCounts";

export default function ProfessionalNotificationButton({ navigation }) {
  const unread = useUnreadCounts("profesional");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir notificaciones"
      onPress={() => navigation.navigate("Notifications")}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Ionicons name="notifications-outline" size={22} color={colors.primary} />
      {unread.notifications ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadBadge(unread.notifications)}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: spacing.xs,
    borderRadius: radius.pill,
    position: "relative",
  },
  pressed: { opacity: 0.7 },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "800" },
});
