import React, { useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing, layout } from "../../../../theme/index";

import { Button, Card, Input } from "../../../../shared/ui/index";

import { ResponsiveContainer, Screen } from "../../../../shared/layout/index";

import { useResponsive } from "../../../../shared/hooks/useResponsive";

import { categories } from "../../../requests/data/categories";

import { useRequestDraft } from "../../../requests/context/RequestDraftContext";

import CategoryCard from "../../../requests/components/CategoryCard";

export default function ClientHomeScreen({ navigation }) {
  const { updateDraft } = useRequestDraft();

  const { isMobile, isTablet, isDesktop } = useResponsive();

  const [search, setSearch] = useState("");

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

          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={22} color={colors.text} />
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

  avatar: {
    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: colors.surface,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: colors.border,
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
