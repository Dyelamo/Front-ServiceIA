// src/components/AppHeader.js
import React from "react";
import { Alert, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, radius, typography } from "../theme";
import { useAppMode } from "../hook/useAppMode";
  // import { getMyProfileApi } from "../features/usuario/usuario.api";
import { getMyProfessionalProfileApi } from "../features/usuario/usuario.api";

export default function AppHeader() {
  const navigation = useNavigation();
  const { mode, setMode, setProfessionalProfile } = useAppMode();
  const [isCheckingProfessional, setIsCheckingProfessional] =
    React.useState(false);

  const goTo = async (nextMode) => {
    if (nextMode === mode) return;

    if (nextMode === "profesional") {
      try {
        setIsCheckingProfessional(true);

        const profile = await getMyProfessionalProfileApi();

        // Si llegamos aquí, el usuario SÍ tiene perfil de prestador
        setProfessionalProfile(profile);

      } catch (error) {
        console.error(
          "Error validando perfil profesional:",
          error
        );

        // El backend devuelve 404 cuando no existe el prestador
        if (error?.response?.status === 404) {
          navigation.navigate("ProfessionalOnboarding");
          return;
        }

        Alert.alert(
          "No pudimos validar tu perfil",
          "Revisa tu conexión e inténtalo de nuevo."
        );

        return;

      } finally {
        setIsCheckingProfessional(false);
      }
    }

    setMode(nextMode);

    (navigation.getParent() || navigation).reset({
      index: 0,
      routes: [
        {
          name:
            nextMode === "cliente"
              ? "Client"
              : "Professional",
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logoCircle}>
          <Ionicons name="build" size={16} color={colors.white} />
        </View>
        <Text style={styles.brandText}>Manitas</Text>
      </View>

      <View style={styles.rightContainer}>
        <View style={styles.segment}>
          <Pressable
            onPress={() => goTo("cliente")}
            style={[
              styles.segmentBtn,
              mode === "cliente" && styles.segmentBtnActive,
            ]}>
            <Text
              style={[
                styles.segmentText,
                mode === "cliente" && styles.segmentTextActive,
              ]}>
              Cliente
            </Text>
          </Pressable>

          <Pressable
            onPress={() => goTo("profesional")}
            disabled={isCheckingProfessional}
            style={[
              styles.segmentBtn,
              mode === "profesional" && styles.segmentBtnActive,
            ]}>
            <Text
              style={[
                styles.segmentText,
                mode === "profesional" && styles.segmentTextActive,
              ]}>
              {isCheckingProfessional ? "Validando..." : "Profesional"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => navigation.navigate("Perfil")}
          style={styles.profileButton}>
          <Ionicons
            name="person-outline"
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logoCircle: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  brandText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    padding: 3,
  },
  segmentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  segmentBtnActive: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: colors.textPrimary,
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  profileButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
});
