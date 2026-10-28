import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "../../../theme/index";

import { Button, TextArea } from "../../../shared/ui/index";

import { ResponsiveContainer } from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

import { categories } from "../../requests/data/categories";

import { getMyProfileApi } from "../../profile/api/user.api";

import { registerProfessionalApi } from "../api/professional.api";

import { useAppMode } from "../../app-mode/hooks/useAppMode";

const STEPS = {
  INTRO: "intro",
  PROFILE: "profile",
  CATEGORIES: "categories",
  SUCCESS: "success",
};

export default function ProfessionalOnboardingScreen({ navigation }) {
  const { isDesktop } = useResponsive();

  const { setMode, setProfessionalProfile } = useAppMode();

  const [step, setStep] = useState(STEPS.INTRO);

  const [userProfile, setUserProfile] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(true);

  const [about, setAbout] = useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [error, setError] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoadingProfile(true);

      const profile = await getMyProfileApi();

      setUserProfile(profile);
    } catch (err) {
      console.error("Error cargando perfil del usuario:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    navigation.goBack();
  };

  const handleStart = () => {
    setError("");
    setStep(STEPS.PROFILE);
  };

  const handleContinueProfile = () => {
    const description = about.trim();

    if (description.length < 20) {
      setError(
        "Cuéntanos un poco más sobre tu experiencia. Escribe al menos 20 caracteres.",
      );

      return;
    }

    setError("");

    setStep(STEPS.CATEGORIES);
  };

  const handleBack = () => {
    if (isSaving) {
      return;
    }

    setError("");

    if (step === STEPS.PROFILE) {
      setStep(STEPS.INTRO);
      return;
    }

    if (step === STEPS.CATEGORIES) {
      setStep(STEPS.PROFILE);
      return;
    }

    navigation.goBack();
  };

  const toggleCategory = (categoryId) => {
    setError("");

    setSelectedCategories((current) => {
      const exists = current.includes(categoryId);

      if (exists) {
        return current.filter((id) => id !== categoryId);
      }

      return [...current, categoryId];
    });
  };

  const completeRegistration = async () => {
    if (isSaving) {
      return;
    }

    if (selectedCategories.length === 0) {
      setError("Selecciona al menos una especialidad.");

      return;
    }

    try {
      setError("");
      setIsSaving(true);

      const profile = await registerProfessionalApi({
        descripcion: about.trim(),

        categoria_ids: selectedCategories,
      });

      const mergedProfile = {
        ...userProfile,
        ...profile,

        nombre_completo:
          userProfile?.nombre_completo || profile?.nombre_completo,

        email: userProfile?.email || profile?.email,

        telefono: userProfile?.telefono || profile?.telefono,

        ubicacion: userProfile?.ubicacion || profile?.ubicacion,
      };

      setProfessionalProfile?.(mergedProfile);

      setStep(STEPS.SUCCESS);
    } catch (requestError) {
      console.error("Error creando perfil profesional:", requestError);

      const detail = requestError?.response?.data?.detail;

      if (Array.isArray(detail)) {
        const message = detail
          .map((item) => item?.msg)
          .filter(Boolean)
          .join(", ");

        setError(message || "No pudimos crear tu perfil profesional.");

        return;
      }

      if (typeof detail === "string") {
        setError(detail);

        return;
      }

      if (detail?.msg) {
        setError(detail.msg);

        return;
      }

      setError("No pudimos crear tu perfil profesional. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoProfessional = () => {
    setMode("profesional");
  };

  const handleGoClientHome = () => {
    navigation.goBack();
  };

  if (loadingProfile) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingBrand}>Serv-IA</Text>

        <ActivityIndicator size="large" color={colors.primary} />

        <Text style={styles.loadingText}>Preparando tu perfil...</Text>
      </View>
    );
  }

  if (step === STEPS.INTRO) {
    return <IntroStep onStart={handleStart} onClose={handleClose} />;
  }

  if (step === STEPS.PROFILE) {
    return (
      <ProfileStep
        userProfile={userProfile}
        about={about}
        setAbout={setAbout}
        error={error}
        onBack={handleBack}
        onContinue={handleContinueProfile}
        isDesktop={isDesktop}
      />
    );
  }

  if (step === STEPS.CATEGORIES) {
    return (
      <CategoriesStep
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        error={error}
        onBack={handleBack}
        onSubmit={completeRegistration}
        loading={isSaving}
      />
    );
  }

  return (
    <SuccessStep
      onProfessional={handleGoProfessional}
      onHome={handleGoClientHome}
    />
  );
}

function IntroStep({ onStart, onClose }) {
  return (
    <View style={styles.screen}>
      <ResponsiveContainer maxWidth={520} style={styles.introContainer}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Ahora no"
          style={styles.skipButton}>
          <Text style={styles.skipText}>Ahora no</Text>
        </Pressable>

        <View style={styles.introContent}>
          <View style={styles.heroCircleLarge}>
            <View style={styles.heroCircle}>
              <Ionicons
                name="briefcase-outline"
                size={42}
                color={colors.white}
              />
            </View>
          </View>

          <Text style={styles.introTitle}>
            Conviértete en profesional de Serv-IA
          </Text>

          <Text style={styles.introDescription}>
            Encuentra nuevas oportunidades y ofrece tus servicios a clientes que
            los necesitan.
          </Text>

          <View style={styles.benefits}>
            <BenefitItem
              icon="search-outline"
              title="Recibe solicitudes"
              description="Encuentra clientes que necesitan servicios de tus especialidades."
            />

            <BenefitItem
              icon="paper-plane-outline"
              title="Envía ofertas"
              description="Presenta tu precio, disponibilidad y propuesta."
            />

            <BenefitItem
              icon="briefcase-outline"
              title="Consigue trabajos"
              description="Gestiona tus oportunidades desde el modo profesional."
            />
          </View>
        </View>

        <Button onPress={onStart} size="lg" style={styles.fullButton}>
          Comenzar
        </Button>
      </ResponsiveContainer>
    </View>
  );
}

function BenefitItem({ icon, title, description }) {
  return (
    <View style={styles.benefitItem}>
      <View style={styles.benefitIcon}>
        <Ionicons name={icon} size={21} color={colors.primary} />
      </View>

      <View style={styles.benefitContent}>
        <Text style={styles.benefitTitle}>{title}</Text>

        <Text style={styles.benefitDescription}>{description}</Text>
      </View>
    </View>
  );
}

function ProfileStep({
  userProfile,
  about,
  setAbout,
  error,
  onBack,
  onContinue,
}) {
  const initials = getInitials(userProfile?.nombre_completo);

  return (
    <View style={styles.screen}>
      <OnboardingHeader step={1} total={2} onBack={onBack} />

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ResponsiveContainer maxWidth={640}>
          <Text style={styles.stepTitle}>Tu perfil profesional</Text>

          <Text style={styles.stepDescription}>
            Esta información ayudará a los clientes a conocerte mejor.
          </Text>

          <View style={styles.profilePreview}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <Text style={styles.profileName}>
              {userProfile?.nombre_completo || "Tu perfil"}
            </Text>

            {userProfile?.email ? (
              <Text style={styles.profileEmail}>{userProfile.email}</Text>
            ) : null}
          </View>

          <View style={styles.formSection}>
            <TextArea
              label="Descripción profesional"
              placeholder="Ej. Soy plomero con experiencia en reparación de fugas, instalaciones sanitarias y mantenimiento residencial."
              value={about}
              onChangeText={(value) => {
                setAbout(value);
              }}
              maxLength={500}
              error={error || undefined}
              accessibilityLabel="Descripción profesional"
            />

            <Text style={styles.counter}>{about.length}/500</Text>
          </View>
        </ResponsiveContainer>
      </ScrollView>

      <View style={styles.footer}>
        <ResponsiveContainer maxWidth={640}>
          <Button onPress={onContinue} size="lg">
            Continuar
          </Button>
        </ResponsiveContainer>
      </View>
    </View>
  );
}

function CategoriesStep({
  selectedCategories,
  toggleCategory,
  error,
  onBack,
  onSubmit,
  loading,
}) {
  return (
    <View style={styles.screen}>
      <OnboardingHeader step={2} total={2} onBack={onBack} disabled={loading} />

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ResponsiveContainer maxWidth={760}>
          <Text style={styles.stepTitle}>Tus especialidades</Text>

          <Text style={styles.stepDescription}>
            Selecciona las categorías en las que puedes prestar servicios.
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={colors.error}
              />

              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.categoriesGrid}>
            {categories.map((category) => {
              const selected = selectedCategories.includes(category.id);

              return (
                <Pressable
                  key={category.id}
                  disabled={loading}
                  onPress={() => toggleCategory(category.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: selected,
                  }}
                  style={({ pressed }) => [
                    styles.categoryItem,

                    selected && styles.categoryItemSelected,

                    pressed && !loading && styles.categoryItemPressed,

                    loading && styles.categoryItemDisabled,
                  ]}>
                  <View
                    style={[
                      styles.categoryIcon,

                      selected && styles.categoryIconSelected,
                    ]}>
                    <Ionicons
                      name={category.icon || "construct-outline"}
                      size={20}
                      color={colors.primary}
                    />
                  </View>

                  <Text
                    numberOfLines={2}
                    style={[
                      styles.categoryName,

                      selected && styles.categoryNameSelected,
                    ]}>
                    {category.name}
                  </Text>

                  {selected ? (
                    <View style={styles.checkBadge}>
                      <Ionicons
                        name="checkmark"
                        size={13}
                        color={colors.white}
                      />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.selectedCount}>
            {selectedCategories.length}{" "}
            {selectedCategories.length === 1
              ? "especialidad seleccionada"
              : "especialidades seleccionadas"}
          </Text>
        </ResponsiveContainer>
      </ScrollView>

      <View style={styles.footer}>
        <ResponsiveContainer maxWidth={760}>
          <Button
            onPress={onSubmit}
            loading={loading}
            loadingLabel="Creando perfil..."
            disabled={loading}
            size="lg">
            Crear perfil profesional
          </Button>
        </ResponsiveContainer>
      </View>
    </View>
  );
}

function SuccessStep({ onProfessional, onHome }) {
  return (
    <View style={styles.successScreen}>
      <ResponsiveContainer maxWidth={520} style={styles.successContainer}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Ionicons
              name="checkmark-circle-outline"
              size={48}
              color={colors.primary}
            />
          </View>

          <Text style={styles.successTitle}>¡Perfil creado!</Text>

          <Text style={styles.successDescription}>
            Ya puedes comenzar a recibir solicitudes y enviar ofertas a clientes
            en Serv-IA.
          </Text>

          <Button
            onPress={onProfessional}
            size="lg"
            style={styles.successButton}>
            Ver solicitudes disponibles
          </Button>

          <Pressable
            onPress={onHome}
            accessibilityRole="button"
            style={styles.homeButton}>
            <Text style={styles.homeButtonText}>Ir al inicio</Text>
          </Pressable>
        </View>
      </ResponsiveContainer>
    </View>
  );
}

function OnboardingHeader({ step, total, onBack, disabled = false }) {
  const progress = `${(step / total) * 100}%`;

  return (
    <View style={styles.header}>
      <ResponsiveContainer maxWidth={760}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={onBack}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={disabled ? colors.textMuted : colors.textSecondary}
            />

            <Text
              style={[styles.backText, disabled && styles.backTextDisabled]}>
              Atrás
            </Text>
          </Pressable>

          <Text style={styles.stepCounter}>
            Paso {step} de {total}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,

              {
                width: progress,
              },
            ]}
          />
        </View>
      </ResponsiveContainer>
    </View>
  );
}

function getInitials(name = "") {
  const words = String(name).trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingScreen: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.background,

    padding: spacing.xl,
  },

  loadingBrand: {
    color: colors.primary,

    fontSize: 24,
    fontWeight: "900",

    marginBottom: spacing.xl,
  },

  loadingText: {
    color: colors.textSecondary,

    marginTop: spacing.md,

    fontSize: 14,
  },

  introContainer: {
    flex: 1,

    paddingTop: spacing.xl,

    paddingBottom: spacing.xl,
  },

  skipButton: {
    alignSelf: "flex-start",

    paddingVertical: spacing.sm,
  },

  skipText: {
    color: colors.textSecondary,

    fontSize: 14,
    fontWeight: "600",
  },

  introContent: {
    flex: 1,

    justifyContent: "center",

    paddingVertical: spacing.xl,
  },

  heroCircleLarge: {
    width: 132,
    height: 132,

    borderRadius: 66,

    alignSelf: "center",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primaryLight,

    marginBottom: spacing.xxl,
  },

  heroCircle: {
    width: 72,
    height: 72,

    borderRadius: 22,

    backgroundColor: colors.primary,

    alignItems: "center",
    justifyContent: "center",
  },

  introTitle: {
    color: colors.text,

    fontSize: 27,
    lineHeight: 34,

    fontWeight: "900",

    textAlign: "center",

    maxWidth: 420,

    alignSelf: "center",
  },

  introDescription: {
    color: colors.textSecondary,

    fontSize: 15,
    lineHeight: 23,

    textAlign: "center",

    marginTop: spacing.md,

    maxWidth: 430,

    alignSelf: "center",
  },

  benefits: {
    marginTop: spacing.xxl,

    gap: spacing.md,
  },

  benefitItem: {
    flexDirection: "row",

    alignItems: "center",

    padding: spacing.md,

    borderRadius: 16,

    backgroundColor: colors.surfaceSecondary,
  },

  benefitIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: colors.surface,

    alignItems: "center",
    justifyContent: "center",
  },

  benefitContent: {
    flex: 1,

    marginLeft: spacing.md,
  },

  benefitTitle: {
    color: colors.text,

    fontSize: 14,
    fontWeight: "800",
  },

  benefitDescription: {
    color: colors.textSecondary,

    fontSize: 12,
    lineHeight: 18,

    marginTop: 2,
  },

  fullButton: {
    width: "100%",
  },

  header: {
    backgroundColor: colors.surface,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    paddingVertical: spacing.lg,
  },

  headerTop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: spacing.md,
  },

  backButton: {
    flexDirection: "row",

    alignItems: "center",

    minHeight: 36,
  },

  backText: {
    color: colors.textSecondary,

    fontSize: 14,
    fontWeight: "600",

    marginLeft: spacing.xs,
  },

  backTextDisabled: {
    color: colors.textMuted,
  },

  stepCounter: {
    color: colors.text,

    fontSize: 13,
    fontWeight: "700",
  },

  progressTrack: {
    height: 6,

    borderRadius: 999,

    overflow: "hidden",

    backgroundColor: colors.border,
  },

  progressBar: {
    height: "100%",

    borderRadius: 999,

    backgroundColor: colors.primary,
  },

  scrollContent: {
    flexGrow: 1,

    paddingVertical: spacing.xxl,
  },

  stepTitle: {
    color: colors.text,

    fontSize: 25,
    lineHeight: 32,

    fontWeight: "900",
  },

  stepDescription: {
    color: colors.textSecondary,

    fontSize: 14,
    lineHeight: 21,

    marginTop: spacing.xs,

    marginBottom: spacing.xl,
  },

  profilePreview: {
    alignItems: "center",

    marginBottom: spacing.xxl,
  },

  avatar: {
    width: 78,
    height: 78,

    borderRadius: 39,

    backgroundColor: colors.primaryLight,

    borderWidth: 1,
    borderColor: colors.border,

    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: colors.primary,

    fontSize: 24,
    fontWeight: "900",
  },

  profileName: {
    color: colors.text,

    fontSize: 16,
    fontWeight: "800",

    marginTop: spacing.md,
  },

  profileEmail: {
    color: colors.textSecondary,

    fontSize: 13,

    marginTop: spacing.xs,
  },

  formSection: {
    width: "100%",
  },

  counter: {
    alignSelf: "flex-end",

    color: colors.textMuted,

    fontSize: 12,

    marginTop: spacing.xs,
  },

  footer: {
    backgroundColor: colors.surface,

    borderTopWidth: 1,
    borderTopColor: colors.border,

    paddingVertical: spacing.md,
  },

  errorBox: {
    flexDirection: "row",

    alignItems: "flex-start",

    marginBottom: spacing.lg,

    padding: spacing.md,

    backgroundColor: "#FEF2F2",

    borderWidth: 1,
    borderColor: "#FECACA",

    borderRadius: 12,
  },

  errorText: {
    flex: 1,

    color: "#B91C1C",

    marginLeft: spacing.sm,

    fontSize: 14,
    lineHeight: 20,
  },

  categoriesGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  categoryItem: {
    width: "50%",

    minHeight: 72,

    flexDirection: "row",

    alignItems: "center",

    padding: spacing.md,

    marginVertical: 6,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16,

    backgroundColor: colors.surface,

    position: "relative",

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  categoryItemSelected: {
    borderColor: colors.primary,

    backgroundColor: colors.primaryLight,
  },

  categoryItemPressed: {
    opacity: 0.8,
  },

  categoryItemDisabled: {
    opacity: 0.6,
  },

  categoryIcon: {
    width: 38,
    height: 38,

    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.surfaceSecondary,
  },

  categoryIconSelected: {
    backgroundColor: colors.surface,
  },

  categoryName: {
    flex: 1,

    color: colors.text,

    fontSize: 13,
    lineHeight: 18,

    fontWeight: "600",

    marginLeft: spacing.sm,

    paddingRight: spacing.sm,
  },

  categoryNameSelected: {
    color: colors.primaryDark,

    fontWeight: "800",
  },

  checkBadge: {
    position: "absolute",

    top: 7,
    right: 7,

    width: 20,
    height: 20,

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.primary,
  },

  selectedCount: {
    color: colors.textSecondary,

    fontSize: 13,
    fontWeight: "600",

    marginTop: spacing.lg,

    textAlign: "center",
  },

  successScreen: {
    flex: 1,

    backgroundColor: colors.background,
  },

  successContainer: {
    flex: 1,

    justifyContent: "center",
  },

  successContent: {
    alignItems: "center",

    paddingVertical: spacing.xxxl || spacing.xxl,
  },

  successIcon: {
    width: 96,
    height: 96,

    borderRadius: 48,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: spacing.xl,
  },

  successTitle: {
    color: colors.text,

    fontSize: 28,
    fontWeight: "900",

    textAlign: "center",
  },

  successDescription: {
    color: colors.textSecondary,

    fontSize: 15,
    lineHeight: 23,

    textAlign: "center",

    maxWidth: 420,

    marginTop: spacing.md,
  },

  successButton: {
    width: "100%",

    marginTop: spacing.xxl,
  },

  homeButton: {
    padding: spacing.md,

    marginTop: spacing.sm,
  },

  homeButtonText: {
    color: colors.textSecondary,

    fontSize: 14,
    fontWeight: "700",
  },
});
