// src/screens/client/HomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import AppHeader from "../../components/AppHeader";
import PrimaryButton from "../../components/PrimaryButton";
import CategoryChip from "../../components/CategoryChip";
import { CATEGORIES } from "../../data/categories";
import { useRequestForm } from "../../hook/useRequestForm";

export default function HomeScreen({ navigation }) {
  const { form, updateForm } = useRequestForm();
  const [text, setText] = useState(form.description || "");

  const startSearch = () => {
    updateForm({ description: text });
    navigation.navigate("Step1Describe");
  };

  const goUrgent = () => {
    navigation.navigate("Step1Describe");
  };

  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerPanel}>
          <View style={styles.topInfo}>
            <Text style={styles.eyebrow}>Todo en un solo lugar</Text>
            <Pressable
              style={styles.publicationsLink}
              onPress={() => navigation.navigate("MisPublicaciones")}>
              <View style={styles.publicationsIcon}>
                <Ionicons
                  name="documents-outline"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.publicationsText}>Mis publicaciones</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          </View>

          <View style={styles.locationPill}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.primary}
            />
            <Text style={styles.locationText}>
              Profesionales verificados en Valledupar
            </Text>
          </View>
        </View>

        <Text style={styles.title}>¿Qué necesitas solucionar?</Text>
        <Text style={styles.subtitle}>
          Cuéntanos tu problema en tus palabras y encuentra ayuda en minutos.
        </Text>

        <View style={styles.searchCard}>
          <TextInput
            style={styles.input}
            placeholder="Necesito un plomero porque tengo una fuga debajo del lavamanos…"
            placeholderTextColor={colors.textMuted}
            multiline
            value={text}
            onChangeText={setText}
          />
          <View style={styles.inputFooter}>
            <Text style={styles.inputHint}>Describe tu necesidad</Text>
            <PrimaryButton
              title="Buscar profesionales"
              icon="search"
              iconPosition="left"
              onPress={startSearch}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorías populares</Text>
          <Text style={styles.sectionAction}>Ver todas</Text>
        </View>

        <View style={styles.chipsGrid}>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              style={styles.chip}
              onPress={() => {
                updateForm({ categoryId: cat.id });
                navigation.navigate("Step1Describe");
              }}
            />
          ))}
        </View>

        <View style={styles.needCard}>
          <View style={styles.needHeader}>
            <View style={styles.needBadge}>
              <Ionicons
                name="sparkles-outline"
                size={16}
                color={colors.primary}
              />
            </View>
            <View style={styles.needTextWrap}>
              <Text style={styles.needTitle}>Solicita tu servicio</Text>
              <Text style={styles.needSubtitle}>
                a tu necesidad, rápido y sin complicaciones.
              </Text>
            </View>
          </View>
          <PrimaryButton
            title="Solicitar servicio"
            icon="arrow-forward"
            style={styles.needButton}
            onPress={goUrgent}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  headerPanel: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  topInfo: { marginBottom: spacing.md },
  eyebrow: {
    ...typography.small,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    fontWeight: "700",
  },
  publicationsLink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  publicationsIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  publicationsText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  locationText: {
    ...typography.small,
    color: colors.primary,
    marginLeft: 6,
    fontWeight: "600",
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  searchCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    minHeight: 72,
    ...typography.body,
    color: colors.textPrimary,
    textAlignVertical: "top",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputFooter: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  inputHint: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  sectionAction: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "700",
  },
  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  chip: { marginBottom: spacing.sm },
  needCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  needHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  needBadge: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  needTextWrap: { flex: 1 },
  needTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  needSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  needButton: { alignSelf: "stretch" },
});
