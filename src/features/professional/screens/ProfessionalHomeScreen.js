import React, { useCallback, useState } from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useFocusEffect } from "@react-navigation/native";

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

import { fetchProfessionalPublications } from "../../requests/api/requests.api";
import { fetchProfessionalOffersWithPublications } from "../../offers/api/offers.api";
import { fetchProviderJobs } from "../../jobs/api/jobs.api";
import { fetchNotifications } from "../../notifications/api/notifications.api";

export default function ProfessionalHomeScreen({
  navigation,
}) {
  const {
    isMobile,
    isDesktop,
  } = useResponsive();

  const [stats, setStats] = useState({
    requests: "—",
    offers: "—",
    jobs: "—",
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const loadStats = useCallback(async () => {
    try {
      const [availableRequests, myOffers, activeJobs, completedJobs, notifsData] =
        await Promise.all([
          fetchProfessionalPublications().catch(() => []),
          fetchProfessionalOffersWithPublications().catch(() => []),
          fetchProviderJobs("activos").catch(() => []),
          fetchProviderJobs("completados").catch(() => []),
          fetchNotifications().catch(() => ({ no_leidas: 0 })),
        ]);

      setStats({
        requests: Array.isArray(availableRequests)
          ? availableRequests.length
          : 0,
        offers: Array.isArray(myOffers) ? myOffers.length : 0,
        jobs:
          (Array.isArray(activeJobs) ? activeJobs.length : 0) +
          (Array.isArray(completedJobs) ? completedJobs.length : 0),
      });

      setUnreadNotifications(notifsData?.no_leidas || 0);
    } catch (error) {
      console.error("Error al cargar estadísticas del profesional:", error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

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
        right={
          <View style={styles.headerActionsRow}>
            {/* BOTÓN DE NOTIFICACIONES CON BOLITA FLOTANTE */}
            <Pressable
              onPress={() => navigation.navigate("Notifications")}
              style={styles.notificationIconButton}
              accessibilityRole="button"
              accessibilityLabel="Notificaciones"
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={colors.text}
              />
              {unreadNotifications > 0 ? (
                <View style={styles.floatingBadge}>
                  <Text style={styles.floatingBadgeText}>
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </Text>
                </View>
              ) : null}
            </Pressable>

            {/* BOTÓN DE PERFIL EN LA PARTE SUPERIOR */}
            <Pressable
              onPress={() => navigation.navigate("ProfessionalProfile")}
              style={styles.profileHeaderButton}
              accessibilityRole="button"
              accessibilityLabel="Mi Perfil"
            >
              <View style={styles.profileAvatarBubble}>
                <Ionicons name="person" size={16} color={colors.primary} />
              </View>
              {!isMobile ? (
                <Text style={styles.profileHeaderText}>Perfil</Text>
              ) : null}
            </Pressable>
          </View>
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
              value={loadingStats ? "..." : String(stats.requests)}
              label="Solicitudes"
              onPress={() =>
                navigation.navigate(
                  "AvailableRequests"
                )
              }
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
              value={loadingStats ? "..." : String(stats.offers)}
              label="Ofertas"
              onPress={() =>
                navigation.navigate(
                  "ProfessionalOffers"
                )
              }
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
              value={loadingStats ? "..." : String(stats.jobs)}
              label="Trabajos"
              onPress={() =>
                navigation.navigate(
                  "Jobs"
                )
              }
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
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed && styles.pressed,
      ]}
    >
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
    </Pressable>
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
  headerActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  notificationIconButton: {
    position: "relative",
    padding: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  floatingBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },
  profileHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  profileAvatarBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  profileHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginRight: 4,
  },
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