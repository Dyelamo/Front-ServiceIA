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
  spacing,
} from "../../../theme/index";

import {
  Card,
} from "../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout/index";

export default function ProfessionalHomeScreen({
  navigation,
}) {
  return (
    <Screen
      scroll
      backgroundColor={
        colors.background
      }
    >
      <AppHeader
        title="Inicio profesional"
      />

      <ResponsiveContainer
        maxWidth={1000}
        style={styles.container}
      >
        <Text
          style={styles.greeting}
        >
          Encuentra nuevas oportunidades
        </Text>

        <Text
          style={
            styles.description
          }
        >
          Revisa solicitudes compatibles
          con tus especialidades y envía
          propuestas.
        </Text>

        <View
          style={
            styles.stats
          }
        >
          <Stat
            icon="search-outline"
            value="—"
            label="Solicitudes"
          />

          <Stat
            icon="paper-plane-outline"
            value="—"
            label="Ofertas"
          />

          <Stat
            icon="briefcase-outline"
            value="—"
            label="Trabajos"
          />
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          Acciones rápidas
        </Text>

        <Card
          variant="outlined"
          onPress={() =>
            navigation.navigate(
              "AvailableRequests"
            )
          }
          style={styles.actionCard}
        >
          <View
            style={
              styles.actionRow
            }
          >
            <View
              style={
                styles.actionIcon
              }
            >
              <Ionicons
                name="search-outline"
                size={24}
                color={
                  colors.primary
                }
              />
            </View>

            <View
              style={
                styles.actionContent
              }
            >
              <Text
                style={
                  styles.actionTitle
                }
              >
                Ver solicitudes
              </Text>

              <Text
                style={
                  styles.actionDescription
                }
              >
                Encuentra trabajos disponibles
                según tus especialidades.
              </Text>
            </View>
          </View>
        </Card>

        <Pressable
          onPress={() =>
            navigation
              .getParent()
              ?.navigate(
                "Balance"
              )
          }
          style={
            styles.walletLink
          }
        >
          <Ionicons
            name="wallet-outline"
            size={20}
            color={
              colors.primary
            }
          />

          <Text
            style={
              styles.walletText
            }
          >
            Ver saldo
          </Text>
        </Pressable>
      </ResponsiveContainer>
    </Screen>
  );
}

function Stat({
  icon,
  value,
  label,
}) {
  return (
    <View style={styles.stat}>
      <Ionicons
        name={icon}
        size={20}
        color={colors.primary}
      />

      <Text
        style={
          styles.statValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.statLabel
        }
      >
        {label}
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingVertical:
        spacing.xxl,
    },

    greeting: {
      color: colors.text,

      fontSize: 27,
      fontWeight: "800",
    },

    description: {
      color:
        colors.textSecondary,

      fontSize: 15,
      lineHeight: 22,

      marginTop:
        spacing.sm,
    },

    stats: {
      flexDirection: "row",

      marginTop:
        spacing.xxxl,

      gap:
        spacing.md,
    },

    stat: {
      flex: 1,

      padding:
        spacing.lg,

      backgroundColor:
        colors.surface,

      borderWidth: 1,
      borderColor:
        colors.border,

      borderRadius: 16,
    },

    statValue: {
      color: colors.text,

      fontSize: 22,
      fontWeight: "800",

      marginTop:
        spacing.sm,
    },

    statLabel: {
      color:
        colors.textSecondary,

      fontSize: 12,

      marginTop: 2,
    },

    sectionTitle: {
      color: colors.text,

      fontSize: 20,
      fontWeight: "700",

      marginTop:
        spacing.massive,

      marginBottom:
        spacing.lg,
    },

    actionCard: {
      padding:
        spacing.lg,
    },

    actionRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    actionIcon: {
      width: 48,
      height: 48,

      borderRadius: 14,

      backgroundColor:
        colors.primaryLight,

      alignItems: "center",
      justifyContent: "center",
    },

    actionContent: {
      flex: 1,

      marginLeft:
        spacing.lg,
    },

    actionTitle: {
      color: colors.text,

      fontSize: 16,
      fontWeight: "700",
    },

    actionDescription: {
      color:
        colors.textSecondary,

      fontSize: 13,
      lineHeight: 19,

      marginTop: 3,
    },

    walletLink: {
      flexDirection: "row",
      alignItems: "center",

      marginTop:
        spacing.xxl,
    },

    walletText: {
      marginLeft:
        spacing.sm,

      color: colors.primary,

      fontWeight: "700",
    },
  });