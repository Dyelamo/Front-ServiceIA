import React, { useCallback, useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect } from "@react-navigation/native";

import { colors, layout, spacing } from "../../../theme/index";

import {
  Avatar,
  Button,
  Card,
  ErrorState,
  Skeleton,
  Divider
} from "../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";

import { getMyProfileApi } from "../api/user.api";

import { useAuth } from "../../../hook/useAuth";

import { useAppMode } from "../../app-mode/hooks/useAppMode";

export default function ClientProfileScreen() {
  const { logout } = useAuth();

  const { setMode } = useAppMode();

  const { isMobile, isDesktop } = useResponsive();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [retrying, setRetrying] = useState(false);

  const [error, setError] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getMyProfileApi();

      setProfile(data);
      setError(false);
    } catch (err) {
      if (err?.response?.status !== 401) {
        console.error("Error cargando perfil:", err);
      }

      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = async () => {
    setRetrying(true);

    await loadProfile();

    setRetrying(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  if (loading) {
    return (
      <Screen>
        <AppHeader title="Mi perfil" maxWidth={layout.content.wide} />

        <ResponsiveContainer
          maxWidth={layout.content.wide}
          style={styles.container}>
          <Skeleton height={190} />
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error && !profile) {
    return (
      <Screen>
        <AppHeader title="Mi perfil" maxWidth={layout.content.wide} />

        <ResponsiveContainer
          maxWidth={layout.content.wide}
          style={styles.container}>
          <ErrorState
            title="No pudimos cargar tu perfil"
            description="Intenta nuevamente."
            onRetry={handleRetry}
            retrying={retrying}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  const fullName =
    profile?.nombre_completo ||
    profile?.nombre ||
    profile?.nombres ||
    "Usuario";

  const email = profile?.email || profile?.correo || "No registrado";

  const phone = profile?.telefono || "No registrado";

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader title="Mi perfil" maxWidth={layout.content.wide} />

      <ResponsiveContainer
        maxWidth={layout.content.wide}
        style={styles.container}>
        {error && profile ? (
          <View style={styles.updateWarning}>
            <Text style={styles.updateWarningTitle}>
              No pudimos actualizar tu perfil
            </Text>

            <Text style={styles.updateWarningText}>
              Estamos mostrando la última información que cargamos
              correctamente.
            </Text>
          </View>
        ) : null}
        <Card variant="outlined" style={styles.heroCard}>
          <View style={[styles.hero, isMobile && styles.heroMobile]}>
            <Avatar name={fullName} size={76} />

            <View style={[styles.heroCopy, isMobile && styles.heroCopyMobile]}>
              <Text style={styles.name}>{fullName}</Text>

              <Text style={styles.role}>Cliente</Text>

              <Text style={styles.heroDescription}>
                Gestiona tu información personal y el modo de tu cuenta.
              </Text>
            </View>
          </View>
        </Card>

        <View style={[styles.columns, !isDesktop && styles.columnsMobile]}>
          <View style={[styles.mainColumn, !isDesktop && styles.fullColumn]}>
            <Text style={styles.sectionTitle}>Información personal</Text>

            <Card variant="outlined" style={styles.card}>
              <InfoRow icon="mail-outline" label="Correo" value={email} />

              <Divider />

              <InfoRow icon="call-outline" label="Teléfono" value={phone} />
            </Card>
          </View>

          <View style={[styles.sideColumn, !isDesktop && styles.fullColumn]}>
            <Text style={styles.sectionTitle}>Cuenta</Text>

            <Card variant="outlined" style={styles.card}>
              <Button variant="outline" onPress={() => setMode("profesional")}>
                Cambiar a modo profesional
              </Button>

              <View style={styles.buttonGap} />

              <Button variant="outline" onPress={logout}>
                Cerrar sesión
              </Button>
            </Card>
          </View>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>

      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },

  heroCard: {
    padding: spacing.xl,
  },

  hero: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroMobile: {
    flexDirection: "column",

    alignItems: "flex-start",
  },

  heroCopy: {
    flex: 1,

    marginLeft: spacing.lg,
  },

  heroCopyMobile: {
    marginLeft: 0,

    marginTop: spacing.lg,
  },

  name: {
    color: colors.text,

    fontSize: 25,

    fontWeight: "800",
  },

  role: {
    color: colors.primary,

    fontSize: 13,

    fontWeight: "700",

    marginTop: 4,
  },

  heroDescription: {
    color: colors.textSecondary,

    fontSize: 13,

    lineHeight: 20,

    marginTop: spacing.sm,

    maxWidth: 520,
  },

  columns: {
    flexDirection: "row",

    alignItems: "flex-start",

    gap: spacing.xl,
  },

  columnsMobile: {
    flexDirection: "column",

    gap: 0,
  },

  mainColumn: {
    flex: 2,
  },

  sideColumn: {
    flex: 1,

    minWidth: 300,
  },

  fullColumn: {
    width: "100%",

    minWidth: 0,

    flexGrow: 0,

    flexShrink: 0,

    flexBasis: "auto",
  },

  sectionTitle: {
    color: colors.text,

    fontSize: 17,

    fontWeight: "700",

    marginTop: spacing.xxl,

    marginBottom: spacing.md,
  },

  card: {
    width: "100%",

    padding: spacing.xl,
  },

  infoRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  infoIcon: {
    width: 40,
    height: 40,

    borderRadius: 11,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  infoCopy: {
    flex: 1,

    marginLeft: spacing.md,
  },

  infoLabel: {
    color: colors.textMuted,

    fontSize: 11,
  },

  infoValue: {
    color: colors.text,

    fontSize: 14,

    fontWeight: "600",

    marginTop: 3,
  },
  
  buttonGap: {
    height: spacing.md,
  },
});
