// src/screens/professional/ProfileScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../theme";
import AppHeader from "../../components/AppHeader";
import SecondaryButton from "../../components/SecondaryButton";
import { MOCK_PROFESSIONAL } from "../../data/mockData";
import { getMyProfessionalProfileApi } from "../../features/usuario/usuario.api";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMyProfessionalProfileApi();
      setProfile(data);
    } catch (error) {
      Alert.alert(
        "No se pudo cargar el perfil",
        "Inténtalo de nuevo más tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando perfil profesional...</Text>
      </View>
    );
  }

  const fullName = profile?.nombre_completo || MOCK_PROFESSIONAL.name;
  const initial = fullName.charAt(0).toUpperCase();
  const categories = profile?.categorias || [];
  const isAvailable = profile?.disponible ?? true;
  const isActive = profile?.activo ?? true;

  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              {profile?.foto_perfil ? (
                <Image
                  source={{ uri: profile.foto_perfil }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>{initial}</Text>
              )}
            </View>
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={styles.name}>{fullName}</Text>
              <Text style={styles.role}>Prestador de servicios</Text>
              <View
                style={[
                  styles.availabilityPill,
                  isAvailable ? styles.available : styles.unavailable,
                ]}>
                <View
                  style={[
                    styles.statusDot,
                    isAvailable ? styles.availableDot : styles.unavailableDot,
                  ]}
                />
                <Text
                  style={[
                    styles.availabilityText,
                    isAvailable ? styles.availableText : styles.unavailableText,
                  ]}>
                  {isAvailable ? "Disponible" : "No disponible"}
                </Text>
              </View>
              {profile?.verificado && (
                <View style={styles.verifiedPill}>
                  <Ionicons
                    name="checkmark-circle"
                    size={12}
                    color={colors.success}
                  />
                  <Text style={styles.verifiedText}>Verificado</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="star-outline" size={16} color={colors.primary} />
              <Text style={styles.statValue}>{MOCK_PROFESSIONAL.rating}</Text>
              <Text style={styles.statLabel}>Calificación</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.statValue}>{MOCK_PROFESSIONAL.services}</Text>
              <Text style={styles.statLabel}>Servicios</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.statValue}>{MOCK_PROFESSIONAL.reviews}</Text>
              <Text style={styles.statLabel}>Reseñas</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.locationText}>
              {profile?.ubicacion || "Ubicación no registrada"}
            </Text>
            <View style={styles.accountStatus}>
              <Ionicons
                name={isActive ? "checkmark-circle" : "close-circle"}
                size={14}
                color={isActive ? colors.success : colors.danger}
              />
              <Text
                style={[
                  styles.accountStatusText,
                  { color: isActive ? colors.success : colors.danger },
                ]}>
                {isActive ? "Perfil activo" : "Perfil inactivo"}
              </Text>
            </View>
          </View>

          <SecondaryButton
            title="Actualizar perfil"
            icon="refresh"
            onPress={loadProfile}
            style={{ marginTop: spacing.lg }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre mí</Text>
          <Text style={styles.aboutText}>
            {profile?.descripcion ||
              "Aún no has agregado una descripción profesional."}
          </Text>
          <InfoLine
            icon="call-outline"
            label="Teléfono"
            value={profile?.telefono}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mis categorías</Text>
          {categories.length > 0 ? (
            categories.map((category) => (
              <View style={styles.categoryRow} key={category.id}>
                <View style={styles.categoryIcon}>
                  <Ionicons
                    name="briefcase-outline"
                    size={17}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.categoryCopy}>
                  <Text style={styles.categoryName}>{category.nombre}</Text>
                  {!!category.descripcion && (
                    <Text style={styles.categoryDescription}>
                      {category.descripcion}
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.aboutText}>No hay categorías registradas.</Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.verificationHeader}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={colors.success}
            />
            <Text style={styles.sectionTitle}> Verificación</Text>
          </View>
          {MOCK_PROFESSIONAL.verification.map((item) => (
            <View key={item.id} style={styles.verificationRow}>
              <Text style={styles.verificationLabel}>{item.label}</Text>
              <View style={styles.verificationStatus}>
                {item.status === "verificado" ? (
                  <>
                    <Ionicons
                      name="document-text-outline"
                      size={14}
                      color={colors.success}
                    />
                    <Text style={styles.verifiedStatusText}>Verificado</Text>
                  </>
                ) : (
                  <Text style={styles.pendingStatusText}>Pendiente</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function InfoLine({ icon, label, value }) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.infoLineLabel}>{label}</Text>
      <Text style={styles.infoLineValue}>{value || "No registrado"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: radius.pill },
  avatarText: { ...typography.h1, color: colors.primary },
  name: { ...typography.h3, color: colors.textPrimary },
  role: { ...typography.caption, color: colors.textSecondary, marginBottom: 4 },
  availabilityPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  available: { backgroundColor: colors.successLight },
  unavailable: { backgroundColor: colors.dangerLight },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    marginRight: spacing.xs,
  },
  availableDot: { backgroundColor: colors.success },
  unavailableDot: { backgroundColor: colors.danger },
  availabilityText: { ...typography.small, fontWeight: "700" },
  availableText: { color: colors.success },
  unavailableText: { color: colors.danger },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.successLight,
    borderRadius: radius.pill,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  verifiedText: {
    ...typography.small,
    color: colors.success,
    fontWeight: "700",
    marginLeft: 4,
  },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  statValue: { ...typography.h3, color: colors.textPrimary, marginTop: 4 },
  statLabel: { ...typography.small, color: colors.textSecondary },
  locationRow: { flexDirection: "row", alignItems: "center" },
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  accountStatus: { flexDirection: "row", alignItems: "center" },
  accountStatusText: {
    ...typography.small,
    fontWeight: "700",
    marginLeft: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.lg,
  },
  infoLineLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  infoLineValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "600",
    marginLeft: "auto",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  categoryCopy: { flex: 1 },
  categoryName: { ...typography.bodyBold, color: colors.textPrimary },
  categoryDescription: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  verificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  verificationLabel: { ...typography.caption, color: colors.textPrimary },
  verificationStatus: { flexDirection: "row", alignItems: "center" },
  verifiedStatusText: {
    ...typography.small,
    color: colors.success,
    fontWeight: "700",
    marginLeft: 4,
  },
  pendingStatusText: {
    ...typography.small,
    color: colors.warning,
    fontWeight: "700",
  },
});
