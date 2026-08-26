import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../theme";
import { CATEGORIES } from "../data/categories";
import { registerProfessionalApi } from "../features/usuario/usuario.api";
import { useAppMode } from "../hook/useAppMode";

export default function ProfessionalOnboardingScreen({ navigation }) {
  const { setMode, setProfessionalProfile } = useAppMode();
  const [about, setAbout] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleCategory = (category) => {
    setError("");
    setSelectedCategories((current) =>
      current.includes(category.id)
        ? current.filter((id) => id !== category.id)
        : [...current, category.id],
    );
  };

  const completeRegistration = async () => {
    if (about.trim().length < 20) {
      setError("Cuéntanos un poco más: escribe al menos 20 caracteres.");
      return;
    }

    if (selectedCategories.length === 0) {
      setError("Elige al menos una especialidad para continuar.");
      return;
    }

    try {
      setError("");
      setIsSaving(true);

      const profile = await registerProfessionalApi({
        descripcion: about.trim(),
        categoria_ids: selectedCategories,
      });

      setProfessionalProfile(profile);
      setMode("profesional");

      navigation.reset({
        index: 0,
        routes: [{ name: "Professional" }],
      });

    } catch (requestError) {
      const detail = requestError.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => item.msg)
            .filter(Boolean)
            .join(", ")
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "No pudimos guardar tu perfil. Revisa tu conexión e inténtalo de nuevo."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={19} color={colors.textPrimary} />
          <Text style={styles.backText}>Volver a Cliente</Text>
        </Pressable>

        <View style={styles.iconCircle}>
          <Ionicons name="briefcase-outline" size={28} color={colors.white} />
        </View>
        <Text style={styles.eyebrow}>Perfil profesional</Text>
        <Text style={styles.title}>Haz que te encuentren</Text>
        <Text style={styles.subtitle}>
          Completa estos datos para empezar a recibir solicitudes que encajen
          contigo.
        </Text>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionNumber}>01</Text>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Sobre mí</Text>
              <Text style={styles.sectionHint}>
                Presenta tu experiencia a tus futuros clientes.
              </Text>
            </View>
          </View>
          <TextInput
            value={about}
            onChangeText={(value) => {
              setAbout(value);
              setError("");
            }}
            multiline
            maxLength={500}
            textAlignVertical="top"
            placeholder="Ej. Soy electricista con 8 años de experiencia en instalaciones y reparaciones residenciales..."
            placeholderTextColor={colors.textMuted}
            style={styles.aboutInput}
          />
          <Text style={styles.characterCount}>{about.length}/500</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionNumber}>02</Text>
            <View style={styles.sectionCopy}>
              <Text style={styles.sectionTitle}>Especialidades</Text>
              <Text style={styles.sectionHint}>
                Selecciona una o varias áreas de trabajo.
              </Text>
            </View>
          </View>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => {
              const selected = selectedCategories.includes(category.id);
              return (
                <Pressable
                  key={category.id}
                  onPress={() => toggleCategory(category)}
                  style={[
                    styles.category,
                    selected && styles.categorySelected,
                  ]}>
                  <Ionicons
                    name={category.icon}
                    size={18}
                    color={selected ? colors.white : colors.primary}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.categoryTextSelected,
                    ]}>
                    {category.label}
                  </Text>
                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={17}
                      color={colors.white}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.selectionCount}>
            {selectedCategories.length === 0
              ? "Aún no has elegido especialidades"
              : `${selectedCategories.length} especialidad${selectedCategories.length === 1 ? "" : "es"} seleccionada${selectedCategories.length === 1 ? "" : "s"}`}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.danger}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={completeRegistration}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitPressed,
          ]}>
          {isSaving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.submitText}>Crear perfil profesional</Text>
              <Ionicons name="arrow-forward" size={19} color={colors.white} />
            </>
          )}
        </Pressable>
        <Text style={styles.footerText}>
          Podrás actualizar estos datos desde tu perfil.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    alignSelf: "flex-start",
  },
  backText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: spacing.lg,
  },
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.xs },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  section: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionNumber: {
    ...typography.h2,
    color: colors.primary,
    marginRight: spacing.md,
  },
  sectionCopy: { flex: 1 },
  sectionTitle: { ...typography.h2, color: colors.textPrimary },
  sectionHint: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  aboutInput: {
    minHeight: 125,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    ...typography.body,
    backgroundColor: colors.background,
  },
  characterCount: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  category: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    maxWidth: "100%",
  },
  categorySelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
    marginHorizontal: spacing.sm,
    flexShrink: 1,
  },
  categoryTextSelected: { color: colors.white },
  selectionCount: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dangerLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    flex: 1,
    marginLeft: spacing.sm,
  },
  submitButton: {
    minHeight: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  submitPressed: { opacity: 0.85 },
  submitText: {
    ...typography.bodyBold,
    color: colors.white,
    marginRight: spacing.sm,
  },
  footerText: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
