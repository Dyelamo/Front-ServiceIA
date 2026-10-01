import React from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  colors,
  radius,
  spacing,
} from "../../../theme/index";

import RequestStatusBadge
  from "./RequestStatusBadge";

export default function RequestCard({
  request,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.categoryRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={
                request.categoryIcon
              }
              size={20}
              color={colors.primary}
            />
          </View>

          <Text
            numberOfLines={1}
            style={styles.category}
          >
            {request.categoryName}
          </Text>
        </View>

        <RequestStatusBadge
          status={
            request.status
          }
        />
      </View>

      <Text
        numberOfLines={2}
        style={styles.description}
      >
        {request.description}
      </Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.textMuted}
          />

          <Text style={styles.metaText}>
            Valledupar
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons
            name="time-outline"
            size={16}
            color={colors.textMuted}
          />

          <Text style={styles.metaText}>
            {request.urgencyLabel}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>
          {formatDate(
            request.createdAt
          )}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textMuted}
        />
      </View>
    </Pressable>
  );
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  return date.toLocaleDateString(
    "es-CO",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor:
      colors.border,

    borderRadius:
      radius.lg,

    padding:
      spacing.lg,

    marginBottom:
      spacing.md,
  },

  pressed: {
    opacity: 0.85,
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems:
      "flex-start",
  },

  categoryRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight:
      spacing.md,
  },

  iconContainer: {
    width: 36,
    height: 36,

    borderRadius: 10,

    backgroundColor:
      colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight:
      spacing.sm,
  },

  category: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  description: {
    marginTop:
      spacing.lg,

    color: colors.text,

    fontSize: 15,
    lineHeight: 22,
  },

  meta: {
    marginTop:
      spacing.lg,

    flexDirection: "row",
    flexWrap: "wrap",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",

    marginRight:
      spacing.xl,
  },

  metaText: {
    marginLeft: 5,
    color:
      colors.textSecondary,
    fontSize: 13,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor:
      colors.border,

    marginTop:
      spacing.lg,

    paddingTop:
      spacing.md,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  date: {
    color:
      colors.textMuted,
    fontSize: 12,
  },
});