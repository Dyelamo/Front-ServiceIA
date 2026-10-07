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
  layout,
  radius,
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

import {
  useResponsive,
} from "../../../shared/hooks/useResponsive";

export default function ProfessionalHomeScreen({
  navigation,
}) {
  const {
    isMobile,
    isDesktop,
  } = useResponsive();

  const handleBalance = () => {
    navigation
      .getParent()
      ?.navigate("Balance");
  };

  return (
    <Screen
      scroll
      backgroundColor={
        colors.background
      }
    >
      <AppHeader
        title="Inicio profesional"
        maxWidth={
          layout.content.wide
        }
      />

      <ResponsiveContainer
        maxWidth={
          layout.content.wide
        }
        style={styles.container}
      >
        {/* HERO */}

        <View
          style={[
            styles.hero,

            isDesktop &&
              styles.heroDesktop,
          ]}
        >
          <View
            style={styles.heroContent}
          >
            <Text style={styles.eyebrow}>
              MODO PROFESIONAL
            </Text>

            <Text
              style={[
                styles.greeting,

                isDesktop &&
                  styles.greetingDesktop,
              ]}
            >
              Encuentra nuevas
              oportunidades
            </Text>

            <Text
              style={[
                styles.description,

                isDesktop &&
                  styles.descriptionDesktop,
              ]}
            >
              Revisa solicitudes
              compatibles con tus
              especialidades y envía
              propuestas a nuevos
              clientes.
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate(
                  "AvailableRequests"
                )
              }
              style={({
                pressed,
              }) => [
                styles.heroAction,

                !isMobile &&
                  styles.heroActionWide,

                pressed &&
                  styles.pressed,
              ]}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.white}
              />

              <Text
                style={
                  styles.heroActionText
                }
              >
                Ver solicitudes
              </Text>
            </Pressable>
          </View>

          {isDesktop ? (
            <View
              style={styles.heroVisual}
            >
              <View
                style={
                  styles.heroVisualIcon
                }
              >
                <Ionicons
                  name="briefcase-outline"
                  size={46}
                  color={colors.primary}
                />
              </View>

              <Text
                style={
                  styles.heroVisualTitle
                }
              >
                Haz crecer tu trabajo
              </Text>

              <Text
                style={
                  styles.heroVisualText
                }
              >
                Encuentra solicitudes,
                envía ofertas y gestiona
                tus servicios desde un
                solo lugar.
              </Text>
            </View>
          ) : null}
        </View>

        {/* MÉTRICAS */}

        <Text
          style={styles.sectionTitle}
        >
          Resumen
        </Text>

        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statWrapper,

              isMobile &&
                styles.statWrapperMobile,
            ]}
          >
            <Stat
              icon="search-outline"
              value="—"
              label="Solicitudes"
            />
          </View>

          <View
            style={[
              styles.statWrapper,

              isMobile &&
                styles.statWrapperMobile,
            ]}
          >
            <Stat
              icon="paper-plane-outline"
              value="—"
              label="Ofertas"
            />
          </View>

          <View
            style={[
              styles.statWrapper,

              isMobile &&
                styles.statWrapperMobile,
            ]}
          >
            <Stat
              icon="briefcase-outline"
              value="—"
              label="Trabajos"
            />
          </View>
        </View>

        {/* ACCIONES */}

        <Text
          style={styles.sectionTitle}
        >
          Acciones rápidas
        </Text>

        <View
          style={styles.actionsGrid}
        >
          <QuickAction
            icon="search-outline"
            title="Solicitudes"
            description="Encuentra trabajos disponibles."
            onPress={() =>
              navigation.navigate(
                "AvailableRequests"
              )
            }
            isDesktop={isDesktop}
          />

          <QuickAction
            icon="paper-plane-outline"
            title="Mis ofertas"
            description="Consulta las propuestas que has enviado."
            onPress={() =>
              navigation.navigate(
                "ProfessionalOffers"
              )
            }
            isDesktop={isDesktop}
          />

          <QuickAction
            icon="briefcase-outline"
            title="Trabajos"
            description="Revisa tus servicios activos y completados."
            onPress={() =>
              navigation.navigate(
                "Jobs"
              )
            }
            isDesktop={isDesktop}
          />

          <QuickAction
            icon="wallet-outline"
            title="Saldo"
            description="Consulta tu balance y movimientos."
            onPress={
              handleBalance
            }
            isDesktop={isDesktop}
          />
        </View>
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
    <Card
      variant="outlined"
      style={styles.stat}
    >
      <View
        style={styles.statIcon}
      >
        <Ionicons
          name={icon}
          size={20}
          color={colors.primary}
        />
      </View>

      <Text
        style={styles.statValue}
      >
        {value}
      </Text>

      <Text
        style={styles.statLabel}
      >
        {label}
      </Text>
    </Card>
  );
}

function QuickAction({
  icon,
  title,
  description,
  onPress,
  isDesktop,
}) {
  return (
    <View
      style={[
        styles.actionWrapper,

        isDesktop &&
          styles.actionWrapperDesktop,
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({
          pressed,
        }) => [
          styles.actionCard,

          pressed &&
            styles.pressed,
        ]}
      >
        <View
          style={styles.actionIcon}
        >
          <Ionicons
            name={icon}
            size={23}
            color={colors.primary}
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
            {title}
          </Text>

          <Text
            style={
              styles.actionDescription
            }
          >
            {description}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={19}
          color={colors.textMuted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical:
      spacing.xl,
  },

  hero: {
    backgroundColor:
      colors.primaryLight,

    borderRadius:
      radius.lg,

    padding:
      spacing.xl,
  },

  heroDesktop: {
    flexDirection: "row",
    alignItems: "center",

    minHeight: 320,

    padding:
      spacing.xxl,
  },

  heroContent: {
    flex: 1,
  },

  eyebrow: {
    color: colors.primary,

    fontSize: 11,
    fontWeight: "800",

    letterSpacing: 1.1,

    marginBottom:
      spacing.sm,
  },

  greeting: {
    color: colors.text,

    fontSize: 29,
    lineHeight: 37,

    fontWeight: "800",

    maxWidth: 600,
  },

  greetingDesktop: {
    fontSize: 42,
    lineHeight: 50,
  },

  description: {
    color:
      colors.textSecondary,

    fontSize: 15,
    lineHeight: 23,

    maxWidth: 580,

    marginTop:
      spacing.md,
  },

  descriptionDesktop: {
    fontSize: 16,
    lineHeight: 25,
  },

  heroAction: {
    minHeight: 48,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      colors.primary,

    borderRadius:
      radius.md,

    paddingHorizontal:
      spacing.lg,

    marginTop:
      spacing.xl,
  },

  heroActionWide: {
    alignSelf: "flex-start",
  },

  heroActionText: {
    color: colors.white,

    fontSize: 14,
    fontWeight: "700",

    marginLeft:
      spacing.sm,
  },

  heroVisual: {
    width: 320,

    marginLeft:
      spacing.xxl,

    padding:
      spacing.xl,

    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor:
      colors.border,

    borderRadius:
      radius.lg,
  },

  heroVisualIcon: {
    width: 82,
    height: 82,

    borderRadius: 41,

    backgroundColor:
      colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginBottom:
      spacing.lg,
  },

  heroVisualTitle: {
    color: colors.text,

    fontSize: 18,
    fontWeight: "800",
  },

  heroVisualText: {
    color:
      colors.textSecondary,

    fontSize: 13,
    lineHeight: 20,

    marginTop:
      spacing.sm,
  },

  sectionTitle: {
    color: colors.text,

    fontSize: 20,
    fontWeight: "800",

    marginTop:
      spacing.xxxl,

    marginBottom:
      spacing.lg,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  statWrapper: {
    width: "33.3333%",
    padding: 6,
  },

  statWrapperMobile: {
    width: "100%",
  },

  stat: {
    width: "100%",

    padding:
      spacing.lg,
  },

  statIcon: {
    width: 40,
    height: 40,

    borderRadius: 11,

    backgroundColor:
      colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    color: colors.text,

    fontSize: 23,
    fontWeight: "800",

    marginTop:
      spacing.md,
  },

  statLabel: {
    color:
      colors.textSecondary,

    fontSize: 12,

    marginTop: 2,
  },

  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  actionWrapper: {
    width: "100%",
    padding: 6,
  },

  actionWrapperDesktop: {
    width: "50%",
  },

  actionCard: {
    width: "100%",
    minHeight: 105,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      colors.surface,

    borderWidth: 1,
    borderColor:
      colors.border,

    borderRadius:
      radius.lg,

    padding:
      spacing.lg,
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

    marginHorizontal:
      spacing.md,
  },

  actionTitle: {
    color: colors.text,

    fontSize: 15,
    fontWeight: "700",
  },

  actionDescription: {
    color:
      colors.textSecondary,

    fontSize: 12,
    lineHeight: 18,

    marginTop: 3,
  },

  pressed: {
    opacity: 0.82,
  },
});