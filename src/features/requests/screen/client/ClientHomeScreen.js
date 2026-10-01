import React, { useState } from "react";

import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "../../../../theme/index";

import { Button, Card, Input } from "../../../../shared/ui/index";

import { ResponsiveContainer, Screen } from "../../../../shared/layout/index";

import { categories } from "../../../requests/data/categories";

import { useRequestDraft } from "../../../requests/context/RequestDraftContext";

import CategoryCard from "../../../requests/components/CategoryCard";



export default function ClientHomeScreen({ navigation }) {
  const { updateDraft } = useRequestDraft();

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
      <ResponsiveContainer maxWidth={1200} style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Serv-IA</Text>

            <Pressable style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={17}
                color={colors.primary}
              />

              <Text style={styles.location}>Valledupar</Text>
            </Pressable>
          </View>

          <Pressable style={styles.avatar}>
            <Ionicons name="person-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>¿Qué necesitas solucionar hoy?</Text>

          <Text style={styles.heroDescription}>
            Cuéntanos qué necesitas y encuentra profesionales que puedan
            ayudarte.
          </Text>

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

          <View style={styles.heroButton}>
            <Button onPress={handleStartRequest}>Publicar solicitud</Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías populares</Text>

          <View style={styles.categoryGrid}>
            {categories.slice(0, 6).map((category) => (
              <View key={category.id} style={styles.categoryWrapper}>
                <CategoryCard
                  category={category}
                  onPress={() => handleCategory(category)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>

          <HowItWorks
            icon="create-outline"
            number="1"
            title="Cuéntanos qué necesitas"
            description="Describe el problema y agrega los detalles importantes."
          />

          <HowItWorks
            icon="people-outline"
            number="2"
            title="Recibe ofertas"
            description="Profesionales disponibles podrán enviarte sus propuestas."
          />

          <HowItWorks
            icon="checkmark-circle-outline"
            number="3"
            title="Compara y elige"
            description="Revisa las opciones y selecciona la que prefieras."
          />
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
    paddingVertical: spacing.xxl,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcomeText: {
    color: colors.primary,
    fontSize: 22,
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

  hero: {
    marginTop: spacing.xxxl,
  },

  heroTitle: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    color: colors.text,
    maxWidth: 600,
  },

  heroDescription: {
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,

    color: colors.textSecondary,

    fontSize: 16,
    lineHeight: 24,
    maxWidth: 600,
  },

  heroButton: {
    marginTop: spacing.md,
  },

  section: {
    marginTop: spacing.massive,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.lg,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },

  categoryWrapper: {
    width: "50%",
    padding: 6,
  },

  howCard: {
    marginBottom: spacing.md,
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
    fontSize: 16,
    marginTop: 2,
  },

  howDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
