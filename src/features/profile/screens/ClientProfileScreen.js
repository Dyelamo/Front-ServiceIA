import React, { useCallback, useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect } from "@react-navigation/native";

import { colors, radius, spacing } from "../../../theme/index";

import { Avatar, Button, Card, ErrorState, Skeleton } from "../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";

import { getMyProfileApi } from "../api/user.api";

import { useAuth } from "../../../hook/useAuth";

import { useAppMode } from "../../app-mode/hooks/useAppMode";

export default function ClientProfileScreen() {
  const { logout } = useAuth();

  const { setMode } = useAppMode();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setError(false);

      const data = await getMyProfileApi();

      setProfile(data);
    } catch (err) {
      console.error("Error cargando perfil:", err);

      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  if (loading) {
    return (
      <Screen>
        <AppHeader title="Mi perfil" />

        <ResponsiveContainer maxWidth={760} style={styles.container}>
          <Skeleton height={190} />
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <AppHeader title="Mi perfil" />

        <ResponsiveContainer maxWidth={760} style={styles.container}>
          <ErrorState
            title="No pudimos cargar tu perfil"
            description="Intenta nuevamente."
            onRetry={loadProfile}
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
      <AppHeader title="Mi perfil" />

      <ResponsiveContainer maxWidth={760} style={styles.container}>
        <Card variant="outlined" style={styles.heroCard}>
          <View style={styles.hero}>
            <Avatar name={fullName} size={72} />

            <View style={styles.heroCopy}>
              <Text style={styles.name}>{fullName}</Text>

              <Text style={styles.role}>Cliente</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Información personal</Text>

        <Card variant="outlined" style={styles.card}>
          <InfoRow icon="mail-outline" label="Correo" value={email} />

          <Divider />

          <InfoRow icon="call-outline" label="Teléfono" value={phone} />
        </Card>

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

function Divider() {
  return <View style={styles.divider} />;
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

  heroCopy: {
    flex: 1,
    marginLeft: spacing.lg,
  },

  name: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "800",
  },

  role: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },

  card: {
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

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  buttonGap: {
    height: spacing.md,
  },
});
