import React, { useCallback, useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect } from "@react-navigation/native";

import { colors, radius, spacing } from "../../../theme/index";

import { Avatar, Button, Card, ErrorState, Skeleton } from "../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";

import { getMyProfileApi } from "../../profile/api/user.api";

import { getMyProfessionalProfileApi } from "../api/professional.api";

import { useAuth } from "../../../hook/useAuth";

import { useAppMode } from "../../app-mode/hooks/useAppMode";

import { categories as serviceCategories } from "../../requests/data/categories";

export default function ProfessionalProfileScreen() {
  const { logout } = useAuth();

  const { setMode } = useAppMode();

  const [user, setUser] = useState(null);

  const [professional, setProfessional] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setError(false);

      const [userData, professionalData] = await Promise.all([
        getMyProfileApi(),
        getMyProfessionalProfileApi(),
      ]);

      setUser(userData);
      setProfessional(professionalData);
    } catch (err) {
      console.error("Error cargando perfil profesional:", err);

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

        <ResponsiveContainer maxWidth={1040} style={styles.container}>
          <Skeleton height={210} style={styles.skeleton} />

          <Skeleton height={180} />
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <AppHeader title="Mi perfil" />

        <ResponsiveContainer maxWidth={1040} style={styles.container}>
          <ErrorState
            title="No pudimos cargar tu perfil profesional"
            description="Intenta nuevamente."
            onRetry={loadProfile}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  const fullName =
    user?.nombre_completo ||
    user?.nombre ||
    user?.nombres ||
    professional?.nombre_completo ||
    "Profesional";

  const email = user?.email || professional?.email || "No registrado";

  const phone = user?.telefono || professional?.telefono || "No registrado";

  const location =
    user?.ubicacion || professional?.ubicacion || "Valledupar, Cesar";

  const description = professional?.descripcion || professional?.sobre_mi || "";

  const specialties = Array.isArray(professional?.categorias)
    ? professional.categorias
    : Array.isArray(professional?.especialidades)
      ? professional.especialidades
      : [];

  const isAvailable = professional?.disponible ?? true;

  const isActive = professional?.activo ?? true;

  const isVerified = professional?.verificado ?? false;

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader title="Mi perfil" />

      <ResponsiveContainer maxWidth={1040} style={styles.container}>
        <Card variant="outlined" style={styles.heroCard}>
          <View style={styles.hero}>
            <Avatar name={fullName} size={76} />

            <View style={styles.heroCopy}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{fullName}</Text>

                {isVerified ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.success}
                  />
                ) : null}
              </View>

              <Text style={styles.role}>Profesional de servicios</Text>

              <View style={styles.metaRow}>
                <StatusPill active={isAvailable} />

                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={15}
                    color={colors.textMuted}
                  />

                  <Text style={styles.location}>{location}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.columns}>
          <View style={styles.mainColumn}>
            <SectionCard title="Sobre mí" icon="person-outline">
              <Text style={description ? styles.description : styles.emptyText}>
                {description ||
                  "Aún no has agregado una descripción profesional."}
              </Text>
            </SectionCard>

            <SectionCard title="Especialidades" icon="construct-outline">
              {specialties.length > 0 ? (
                <View style={styles.specialties}>
                  {specialties.map((specialty, index) => {
                    const name = getSpecialtyName(specialty);

                    return (
                      <View key={`${name}-${index}`} style={styles.specialty}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={16}
                          color={colors.primary}
                        />

                        <Text style={styles.specialtyText}>{name}</Text>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.emptyText}>
                  No tienes especialidades registradas.
                </Text>
              )}
            </SectionCard>
          </View>

          <View style={styles.sideColumn}>
            <SectionCard title="Información" icon="information-circle-outline">
              <InfoRow icon="mail-outline" label="Correo" value={email} />

              <Divider />

              <InfoRow icon="call-outline" label="Teléfono" value={phone} />

              <Divider />

              <InfoRow
                icon="shield-checkmark-outline"
                label="Estado"
                value={isActive ? "Perfil activo" : "Perfil inactivo"}
              />
            </SectionCard>

            <SectionCard title="Cuenta" icon="settings-outline">
              <Button variant="outline" onPress={loadProfile}>
                Actualizar información
              </Button>

              <View style={styles.buttonGap} />

              <Button variant="outline" onPress={() => setMode("cliente")}>
                Cambiar a modo cliente
              </Button>

              <View style={styles.buttonGap} />

              <Button variant="outline" onPress={logout}>
                Cerrar sesión
              </Button>
            </SectionCard>
          </View>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

function getSpecialtyName(specialty) {
  if (typeof specialty === "string") {
    const category = serviceCategories.find((item) => item.id === specialty);

    return category?.label || specialty;
  }

  const id = specialty?.id || specialty?.categoria_id;

  const category = serviceCategories.find((item) => item.id === id);

  return (
    specialty?.nombre ||
    specialty?.name ||
    specialty?.label ||
    category?.label ||
    "Servicio"
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <Card variant="outlined" style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Ionicons name={icon} size={19} color={colors.primary} />
        </View>

        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <View style={styles.sectionContent}>{children}</View>
    </Card>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.primary} />

      <View style={styles.infoCopy}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{value || "No registrado"}</Text>
      </View>
    </View>
  );
}

function StatusPill({ active }) {
  return (
    <View
      style={[
        styles.statusPill,
        {
          backgroundColor: active ? "#DCFCE7" : "#FEE2E2",
        },
      ]}>
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: active ? "#16A34A" : "#DC2626",
          },
        ]}
      />

      <Text
        style={[
          styles.statusText,
          {
            color: active ? "#15803D" : "#B91C1C",
          },
        ]}>
        {active ? "Disponible" : "No disponible"}
      </Text>
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

  skeleton: {
    marginBottom: spacing.lg,
  },

  heroCard: {
    padding: spacing.xxl,
  },

  hero: {
    flexDirection: "row",
    alignItems: "center",
  },

  heroCopy: {
    flex: 1,
    marginLeft: spacing.xl,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  name: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "800",
  },

  role: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 3,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.md,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: spacing.xs,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  location: {
    color: colors.textSecondary,
    fontSize: 13,
    marginLeft: 5,
  },

  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl,
    marginTop: spacing.xl,
  },

  mainColumn: {
    flexGrow: 2,
    flexBasis: 540,
    gap: spacing.xl,
  },

  sideColumn: {
    flexGrow: 1,
    flexBasis: 300,
    gap: spacing.xl,
  },

  sectionCard: {
    padding: spacing.xl,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginLeft: spacing.md,
  },

  sectionContent: {
    marginTop: spacing.xl,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },

  specialties: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  specialty: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  specialtyText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
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
