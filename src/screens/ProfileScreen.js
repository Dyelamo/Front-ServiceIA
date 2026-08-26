import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../theme";
import { getMyProfileApi } from "../features/usuario/usuario.api";
import { useAuth } from "../hook/useAuth";

export const ProfileScreen = ({ navigation, onBack }) => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getMyProfileApi();
      setProfile(data);
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      Alert.alert(
        "No se pudo cargar el perfil",
        error.response?.data?.detail || "Inténtalo de nuevo más tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const performLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
      Alert.alert("No se pudo cerrar la sesión", "Inténtalo de nuevo.");
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
        performLogout();
      }
      return;
    }

    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: performLogout },
      ],
    );
  };

  const goBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando tu perfil...</Text>
      </View>
    );
  }

  const fullName = profile?.nombre_completo || "Usuario";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable
            onPress={goBack}
            style={styles.backButton}
            accessibilityLabel="Volver">
            <Ionicons name="arrow-back" size={21} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.topTitle}>Mi perfil</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{fullName}</Text>
          <View style={styles.clientBadge}>
            <Ionicons name="person-outline" size={14} color={colors.primary} />
            <Text style={styles.clientBadgeText}>Cliente</Text>
          </View>
          <Text style={styles.identityHint}>
            Tu información para gestionar servicios
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Información personal</Text>
        <View style={styles.infoCard}>
          <InfoRow
            icon="mail-outline"
            label="Correo electrónico"
            value={profile?.email}
          />
          <InfoRow
            icon="call-outline"
            label="Teléfono"
            value={profile?.telefono}
            isLast={!profile?.ubicacion}
          />
          {profile?.ubicacion ? (
            <InfoRow
              icon="location-outline"
              label="Ubicación"
              value={profile.ubicacion}
              isLast
            />
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>Tu cuenta</Text>
        <View style={styles.actionCard}>
          <Pressable style={styles.actionRow} onPress={loadProfile}>
            <View style={styles.actionIcon}>
              <Ionicons
                name="refresh-outline"
                size={19}
                color={colors.primary}
              />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Actualizar información</Text>
              <Text style={styles.actionSubtitle}>
                Ver los datos más recientes
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={19}
              color={colors.textMuted}
            />
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}>
          {isLoggingOut ? (
            <ActivityIndicator color={colors.danger} />
          ) : (
            <>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.danger}
              />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </>
          )}
        </Pressable>
        <Text style={styles.versionText}>Manitas · Tu ayuda, más cerca</Text>
      </ScrollView>
    </View>
  );
};

function InfoRow({ icon, label, value, isLast }) {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>
      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "No registrado"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { ...typography.h2, color: colors.textPrimary },
  topBarSpacer: { width: 40 },
  identityCard: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 34, fontWeight: "800", color: colors.primary },
  name: { ...typography.h2, color: colors.white, textAlign: "center" },
  clientBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  clientBadgeText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "800",
    marginLeft: spacing.xs,
  },
  identityHint: {
    ...typography.small,
    color: colors.primaryLight,
    marginTop: spacing.md,
    textAlign: "center",
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  infoCopy: { flex: 1 },
  infoLabel: { ...typography.small, color: colors.textSecondary },
  infoValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginTop: 2,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  actionCopy: { flex: 1 },
  actionTitle: { ...typography.bodyBold, color: colors.textPrimary },
  actionSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.danger,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.danger,
    marginLeft: spacing.sm,
  },
  pressed: { opacity: 0.75 },
  versionText: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
