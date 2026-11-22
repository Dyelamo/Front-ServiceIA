import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing, layout } from "../../../../theme/index";

import { Button, Card, Input } from "../../../../shared/ui/index";

import { ResponsiveContainer, Screen } from "../../../../shared/layout/index";

import { useResponsive } from "../../../../shared/hooks/useResponsive";

import { categories } from "../../data/categories";

import { useRequestDraft } from "../../context/RequestDraftContext";

import CategoryCard from "../../components/CategoryCard";
import { fetchPendingReview } from "../../../reviews/api/reviews.api";
import MandatoryReviewModal from "../../../reviews/components/MandatoryReviewModal";
import { fetchNotifications } from "../../../notifications/api/notifications.api";

export default function ClientHomeScreen({ navigation }) {
  const { updateDraft } = useRequestDraft();

  const { isMobile, isTablet, isDesktop } = useResponsive();

  const [search, setSearch] = useState("");
  const [pendingReview, setPendingReview] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const checkPendingReview = async () => {
        try {
          const pending = await fetchPendingReview();
          if (active && pending) {
            setPendingReview(pending);
          }
        } catch (e) {
          console.error("Error verificando reseña pendiente:", e);
        }
      };
      checkPendingReview();

      fetchNotifications()
        .then((data) => {
          if (active) setUnreadNotifications(data?.no_leidas || 0);
        })
        .catch(() => {
          if (active) setUnreadNotifications(0);
        });

      return () => {
        active = false;
      };
    }, [])
  );

  const handleStartRequest = () => {
    if (search.trim()) {
      updateDraft({
        description: search.trim(),
      });
    }

    navigation.navigate("CreateRequestDescription");
  };

  const handleCategory = (category) => {
    updateDraft({
      categoryId: category.id,

      categoryName: category.name || category.label,
    });

    navigation.navigate("CreateRequestDescription");
  };

  return (
    <Screen scroll backgroundColor={colors.background}>
      <ResponsiveContainer
        maxWidth={layout.content.wide}
        style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Serv-IA</Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={17}
                color={colors.primary}
              />

              <Text style={styles.location}>Valledupar</Text>
            </View>
          </View>

          <View style={styles.headerActionsRow}>
            {/* BOTÓN DE NOTIFICACIONES CON BOLITA FLOTANTE */}
            <Pressable
              onPress={() => navigation.navigate("Notifications")}
              style={styles.notificationIconButton}
              accessibilityRole="button"
              accessibilityLabel="Notificaciones">
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
              onPress={() => navigation.navigate("Profile")}
              style={styles.profileHeaderButton}
              accessibilityRole="button"
              accessibilityLabel="Mi Perfil">
              <View style={styles.profileAvatarBubble}>
                <Ionicons name="person" size={16} color={colors.primary} />
              </View>
              {!isMobile ? (
                <Text style={styles.profileHeaderText}>Perfil</Text>
              ) : null}
            </Pressable>
          </View>
        </View>

        {/* HERO */}

        <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
          <View style={styles.heroContent}>
            <Text style={styles.eyebrow}>ENCUENTRA AYUDA CERCA DE TI</Text>

            <Text
              style={[styles.heroTitle, isDesktop && styles.heroTitleDesktop]}>
              ¿Qué necesitas solucionar hoy?
            </Text>

            <Text
              style={[
                styles.heroDescription,

                isDesktop && styles.heroDescriptionDesktop,
              ]}>
              Cuéntanos qué necesitas y encuentra profesionales que puedan
              ayudarte.
            </Text>

            <View style={styles.searchArea}>
              <Input
                placeholder="Describe lo que necesitas..."
                value={search}
                onChangeText={setSearch}
                leftIcon={
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color={colors.textMuted}
                  />
                }
              />

              <View
                style={[styles.heroButton, !isMobile && styles.heroButtonWide]}>
                <Button onPress={handleStartRequest}>Publicar solicitud</Button>
              </View>
            </View>
          </View>

          {isDesktop ? (
            <View style={styles.heroVisual}>
              <View style={styles.heroVisualIcon}>
                <Ionicons
                  name="construct-outline"
                  size={46}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.heroVisualTitle}>
                Encuentra al profesional indicado
              </Text>

              <Text style={styles.heroVisualText}>
                Publica lo que necesitas y recibe propuestas de profesionales
                disponibles.
              </Text>

              <View style={styles.heroFeature}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.primary}
                />

                <Text style={styles.heroFeatureText}>Fácil y rápido</Text>
              </View>

              <View style={styles.heroFeature}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.primary}
                />

                <Text style={styles.heroFeatureText}>Compara ofertas</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* CATEGORÍAS */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Categorías populares</Text>

              <Text style={styles.sectionSubtitle}>
                Selecciona el tipo de servicio que necesitas.
              </Text>
            </View>
          </View>

          <View style={styles.categoryGrid}>
            {categories.slice(0, 6).map((category) => (
              <View
                key={category.id}
                style={[
                  styles.categoryWrapper,

                  isMobile
                    ? styles.categoryMobile
                    : isTablet
                      ? styles.categoryTablet
                      : styles.categoryDesktop,
                ]}>
                <CategoryCard
                  category={category}
                  onPress={() => handleCategory(category)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* CÓMO FUNCIONA */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>

              <Text style={styles.sectionSubtitle}>
                Encuentra ayuda en tres pasos sencillos.
              </Text>
            </View>
          </View>

          <View style={styles.howGrid}>
            <View
              style={[
                styles.howWrapper,

                isDesktop && styles.howWrapperDesktop,
              ]}>
              <HowItWorks
                icon="create-outline"
                number="1"
                title="Cuéntanos qué necesitas"
                description="Describe el problema y agrega los detalles importantes."
              />
            </View>

            <View
              style={[
                styles.howWrapper,

                isDesktop && styles.howWrapperDesktop,
              ]}>
              <HowItWorks
                icon="people-outline"
                number="2"
                title="Recibe ofertas"
                description="Profesionales disponibles podrán enviarte sus propuestas."
              />
            </View>

            <View
              style={[
                styles.howWrapper,

                isDesktop && styles.howWrapperDesktop,
              ]}>
              <HowItWorks
                icon="checkmark-circle-outline"
                number="3"
                title="Compara y elige"
                description="Revisa las opciones y selecciona la que prefieras."
              />
            </View>
          </View>
        </View>
      </ResponsiveContainer>

      {/* BLOQUEO POR RESEÑA OBLIGATORIA PENDIENTE */}
      {pendingReview ? (
        <MandatoryReviewModal
          visible={Boolean(pendingReview)}
          publicationId={pendingReview.publicacion_id}
          providerId={pendingReview.prestador_id}
          providerName={pendingReview.prestador_nombre}
          publicationTitle={pendingReview.titulo || pendingReview.descripcion}
          onSuccess={() => setPendingReview(null)}
        />
      ) : null}
    </Screen>
  );
}

function HowItWorks({ icon, number, title, description }) {
  return (
    <Card variant="outlined" style={styles.howCard}>
      <View style={styles.howRow}>
        <View style={styles.howIcon}>
          <Ionicons name={icon} size={24} color={colors.primary} />
        </View>

        <View style={styles.howContent}>
          <Text style={styles.howStep}>Paso {number}</Text>

          <Text style={styles.howTitle}>{title}</Text>

          <Text style={styles.howDescription}>{description}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcomeText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  location: {
    color: colors.textSecondary,

    marginLeft: 4,
    fontSize: 13,
  },

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

  /* HERO */

  hero: {
    marginTop: spacing.xxl,

    backgroundColor: colors.primaryLight,

    borderRadius: radius.lg,

    padding: spacing.xl,
  },

  heroDesktop: {
    flexDirection: "row",
    alignItems: "center",

    minHeight: 340,

    padding: spacing.xxl,
  },

  heroContent: {
    flex: 1,
  },

  eyebrow: {
    color: colors.primary,

    fontSize: 11,
    fontWeight: "800",

    letterSpacing: 1.1,

    marginBottom: spacing.sm,
  },

  heroTitle: {
    fontSize: 30,
    lineHeight: 38,

    fontWeight: "800",

    color: colors.text,

    maxWidth: 620,
  },

  heroTitleDesktop: {
    fontSize: 44,
    lineHeight: 51,

    maxWidth: 650,
  },

  heroDescription: {
    marginTop: spacing.sm,

    color: colors.textSecondary,

    fontSize: 15,
    lineHeight: 23,

    maxWidth: 600,
  },

  heroDescriptionDesktop: {
    fontSize: 16,
    lineHeight: 25,
  },

  searchArea: {
    width: "100%",
    maxWidth: 650,

    marginTop: spacing.xxl,
  },

  heroButton: {
    marginTop: spacing.md,
  },

  heroButtonWide: {
    alignSelf: "flex-start",

    minWidth: 190,
  },

  heroVisual: {
    width: 330,

    marginLeft: spacing.xxl,

    padding: spacing.xl,

    backgroundColor: colors.surface,

    borderRadius: radius.lg,

    borderWidth: 1,

    borderColor: colors.border,
  },

  heroVisualIcon: {
    width: 82,
    height: 82,

    borderRadius: 41,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: spacing.lg,
  },

  heroVisualTitle: {
    color: colors.text,

    fontSize: 18,
    lineHeight: 24,

    fontWeight: "800",
  },

  heroVisualText: {
    color: colors.textSecondary,

    fontSize: 13,
    lineHeight: 20,

    marginTop: spacing.sm,

    marginBottom: spacing.lg,
  },

  heroFeature: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: spacing.sm,
  },

  heroFeatureText: {
    color: colors.textSecondary,

    fontSize: 13,

    marginLeft: spacing.sm,
  },

  /* SECTIONS */

  section: {
    marginTop: spacing.xxxl,
  },

  sectionHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-end",

    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: 21,

    fontWeight: "800",

    color: colors.text,
  },

  sectionSubtitle: {
    color: colors.textSecondary,

    fontSize: 13,
    lineHeight: 19,

    marginTop: 4,
  },

  /* CATEGORIES */

  categoryGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  categoryWrapper: {
    padding: 6,
  },

  categoryMobile: {
    width: "50%",
  },

  categoryTablet: {
    width: "33.3333%",
  },

  categoryDesktop: {
    width: "33.3333%",
  },

  /* HOW IT WORKS */

  howGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  howWrapper: {
    width: "100%",

    paddingHorizontal: 6,

    marginBottom: spacing.md,
  },

  howWrapperDesktop: {
    width: "33.3333%",
  },

  howCard: {
    height: "100%",

    padding: spacing.lg,
  },

  howRow: {
    flexDirection: "row",

    alignItems: "flex-start",
  },

  howIcon: {
    width: 48,
    height: 48,

    borderRadius: 14,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  howContent: {
    flex: 1,

    marginLeft: spacing.lg,
  },

  howStep: {
    color: colors.primary,

    fontWeight: "700",

    fontSize: 12,
  },

  howTitle: {
    color: colors.text,

    fontWeight: "700",

    fontSize: 15,

    marginTop: 2,
  },

  howDescription: {
    color: colors.textSecondary,

    fontSize: 13,
    lineHeight: 20,

    marginTop: 4,
  },
});
