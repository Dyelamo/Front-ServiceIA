import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  colors,
  spacing,
} from "../../../../theme/index";

import {
  Button,
  Card,
} from "../../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../../shared/layout/index";

import {
  categories,
} from "../../data/categories";

function getCategory(
  categoryId
) {
  return categories.find(
    (item) =>
      item.id === categoryId
  );
}

const urgencyLabels = {
  ahora:
    "Lo antes posible",

  hoy:
    "Hoy",

  "esta semana":
    "Esta semana",

  "no tengo prisa":
    "No tengo prisa",
};

export default function ProfessionalRequestDetailScreen({
  navigation,
  route,
}) {
  const request =
    route?.params?.request;

  if (!request) {
    return (
      <Screen>
        <AppHeader
          title="Solicitud"
          onBack={() =>
            navigation.goBack()
          }
        />
      </Screen>
    );
  }

  const category =
    getCategory(
      request.categoria_id
    );

  return (
    <Screen
      scroll
      backgroundColor={
        colors.background
      }
    >
      <AppHeader
        title="Detalle de solicitud"
        onBack={() =>
          navigation.goBack()
        }
      />

      <ResponsiveContainer
        maxWidth={760}
        style={styles.container}
      >
        <View style={styles.heading}>
          <View
            style={
              styles.categoryIcon
            }
          >
            <Ionicons
              name={
                category?.icon ||
                "construct-outline"
              }
              size={26}
              color={colors.primary}
            />
          </View>

          <View
            style={
              styles.headingContent
            }
          >
            <Text
              style={
                styles.category
              }
            >
              {category?.label ||
                "Servicio"}
            </Text>

            <Text
              style={
                styles.description
              }
            >
              {request.descripcion}
            </Text>
          </View>
        </View>

        <Card
          variant="outlined"
          style={styles.card}
        >
          <InfoRow
            icon="location-outline"
            label="Ubicación"
            value="Valledupar, Cesar"
          />

          <Divider />

          <InfoRow
            icon="time-outline"
            label="Urgencia"
            value={
              urgencyLabels[
                request.urgencia
              ] ||
              request.urgencia
            }
          />

          <Divider />

          <InfoRow
            icon="calendar-outline"
            label="Publicado"
            value={formatDate(
              request.created_at
            )}
          />
        </Card>

        <View
          style={
            styles.notice
          }
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />

          <Text
            style={
              styles.noticeText
            }
          >
            Revisa los detalles antes de
            enviar una oferta. Podrás
            indicar precio,
            disponibilidad y un mensaje.
          </Text>
        </View>

        <View
          style={
            styles.action
          }
        >
          <Button
            onPress={() =>
              navigation.navigate(
                "CreateOffer",
                {
                  request,
                }
              )
            }
          >
            Enviar oferta
          </Button>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <View
      style={
        styles.infoRow
      }
    >
      <View
        style={
          styles.infoIcon
        }
      >
        <Ionicons
          name={icon}
          size={20}
          color={colors.primary}
        />
      </View>

      <View
        style={
          styles.infoContent
        }
      >
        <Text
          style={
            styles.infoLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.infoValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return (
    <View
      style={styles.divider}
    />
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
      month: "long",
      year: "numeric",
    }
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingVertical:
        spacing.xxl,
    },

    heading: {
      flexDirection: "row",
      alignItems:
        "flex-start",

      marginBottom:
        spacing.xxl,
    },

    categoryIcon: {
      width: 54,
      height: 54,

      borderRadius: 15,

      backgroundColor:
        colors.primaryLight,

      alignItems: "center",
      justifyContent:
        "center",
    },

    headingContent: {
      flex: 1,

      marginLeft:
        spacing.lg,
    },

    category: {
      color: colors.primary,

      fontSize: 14,
      fontWeight: "700",
    },

    description: {
      color: colors.text,

      fontSize: 22,
      lineHeight: 30,

      fontWeight: "800",

      marginTop: 3,
    },

    card: {
      padding:
        spacing.xl,
    },

    infoRow: {
      flexDirection: "row",
      alignItems:
        "flex-start",
    },

    infoIcon: {
      width: 38,
      height: 38,

      borderRadius: 10,

      backgroundColor:
        colors.primaryLight,

      alignItems: "center",
      justifyContent:
        "center",
    },

    infoContent: {
      flex: 1,

      marginLeft:
        spacing.md,
    },

    infoLabel: {
      color:
        colors.textMuted,

      fontSize: 12,
    },

    infoValue: {
      color: colors.text,

      fontSize: 15,

      marginTop: 3,
    },

    divider: {
      height: 1,

      backgroundColor:
        colors.border,

      marginVertical:
        spacing.lg,
    },

    notice: {
      flexDirection: "row",

      marginTop:
        spacing.xxl,

      padding:
        spacing.lg,

      backgroundColor:
        colors.primaryLight,

      borderRadius: 12,
    },

    noticeText: {
      flex: 1,

      marginLeft:
        spacing.sm,

      color:
        colors.textSecondary,

      fontSize: 13,
      lineHeight: 20,
    },

    action: {
      marginTop:
        spacing.xxxl,
    },
  });