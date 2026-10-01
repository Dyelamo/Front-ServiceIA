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

import {
  categories,
} from "../data/categories";

function getCategory(
  categoryId
) {
  return categories.find(
    (category) =>
      category.id === categoryId
  );
}

function getUrgencyLabel(
  urgency
) {
  const labels = {
    ahora:
      "Lo antes posible",

    hoy:
      "Hoy",

    "esta semana":
      "Esta semana",

    "no tengo prisa":
      "No tengo prisa",
  };

  return (
    labels[urgency] ||
    urgency ||
    "No especificada"
  );
}

export default function ProfessionalRequestCard({
  request,
  onPress,
}) {
  const category =
    getCategory(
      request.categoria_id
    );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed &&
          styles.pressed,
      ]}
    >
      <View style={styles.header}>
        <View
          style={
            styles.categoryRow
          }
        >
          <View
            style={
              styles.iconContainer
            }
          >
            <Ionicons
              name={
                category?.icon ||
                "construct-outline"
              }
              size={22}
              color={
                colors.primary
              }
            />
          </View>

          <View>
            <Text
              style={
                styles.category
              }
            >
              {category?.name ||
                "Servicio"}
            </Text>

            <Text
              style={
                styles.location
              }
            >
              Valledupar
            </Text>
          </View>
        </View>

        <View
          style={
            styles.urgencyBadge
          }
        >
          <Text
            style={
              styles.urgencyText
            }
          >
            {getUrgencyLabel(
              request.urgencia
            )}
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={3}
        style={
          styles.description
        }
      >
        {request.descripcion}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.date}>
          {formatDate(
            request.created_at
          )}
        </Text>

        <View
          style={
            styles.viewRow
          }
        >
          <Text
            style={
              styles.viewText
            }
          >
            Ver solicitud
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={
              colors.primary
            }
          />
        </View>
      </View>
    </Pressable>
  );
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(
    value
  ).toLocaleDateString(
    "es-CO",
    {
      day: "numeric",
      month: "short",
    }
  );
}

const styles =
  StyleSheet.create({
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
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    iconContainer: {
      width: 44,
      height: 44,

      borderRadius: 12,

      backgroundColor:
        colors.primaryLight,

      alignItems: "center",
      justifyContent:
        "center",

      marginRight:
        spacing.md,
    },

    category: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 15,
    },

    location: {
      color:
        colors.textSecondary,
      fontSize: 12,
      marginTop: 3,
    },

    urgencyBadge: {
      paddingHorizontal:
        spacing.md,

      paddingVertical:
        spacing.xs,

      borderRadius:
        radius.pill,

      backgroundColor:
        "#FEF3C7",
    },

    urgencyText: {
      color: "#B45309",
      fontSize: 11,
      fontWeight: "700",
    },

    description: {
      marginTop:
        spacing.lg,

      color: colors.text,

      fontSize: 15,
      lineHeight: 22,
    },

    footer: {
      marginTop:
        spacing.lg,

      paddingTop:
        spacing.md,

      borderTopWidth: 1,
      borderTopColor:
        colors.border,

      flexDirection: "row",
      justifyContent:
        "space-between",

      alignItems: "center",
    },

    date: {
      color:
        colors.textMuted,

      fontSize: 12,
    },

    viewRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    viewText: {
      color: colors.primary,
      fontWeight: "700",
      fontSize: 13,
    },
  });