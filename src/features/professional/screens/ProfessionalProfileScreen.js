import React, { useCallback, useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useFocusEffect } from "@react-navigation/native";

import { colors, radius, spacing, layout } from "../../../theme/index";

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

import { getMyProfileApi } from "../../profile/api/user.api";

import { getMyProfessionalProfileApi } from "../api/professional.api";
import { fetchProviderReviews } from "../../reviews/api/reviews.api";

import { useAuth } from "../../../hook/useAuth";

import { useAppMode } from "../../app-mode/hooks/useAppMode";

import { categories as serviceCategories } from "../../requests/data/categories";

import { useResponsive } from "../../../shared/hooks/useResponsive";

export default function ProfessionalProfileScreen() {
  const { logout } = useAuth();

  const { setMode } = useAppMode();

  const { isMobile, isDesktop } = useResponsive();

  const [user, setUser] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const [userData, professionalData] = await Promise.all([
        getMyProfileApi(),
        getMyProfessionalProfileApi(),
      ]);

      setUser(userData);
      setProfessional(professionalData);

      if (userData?.id) {
        try {
          const revs = await fetchProviderReviews(userData.id);
          setReviewsData(revs);
        } catch (revErr) {
          console.error("Error al cargar reseñas del prestador:", revErr);
        }
      }

      setError(false);
    } catch (err) {
      console.error("Error cargando perfil profesional:", err);
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

  const handleUpdate = async () => {
    setUpdating(true);

    await loadProfile();

    setUpdating(false);
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
          <Skeleton height={210} style={styles.skeleton} />

          <Skeleton height={180} />
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error && !user && !professional) {
    return (
      <Screen>
        <AppHeader title="Mi perfil" maxWidth={layout.content.wide} />

        <ResponsiveContainer
          maxWidth={layout.content.wide}
          style={styles.container}>
          <ErrorState
            title="No pudimos cargar tu perfil profesional"
            description="Intenta nuevamente."
            onRetry={handleRetry}
            retrying={retrying}
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
      <AppHeader title="Mi perfil" maxWidth={layout.content.wide} />

      <ResponsiveContainer
        maxWidth={layout.content.wide}
        style={styles.container}>
        {error && (user || professional) ? (
          <View style={styles.updateWarning}>
            <Text style={styles.updateWarningTitle}>
              No pudimos actualizar tu perfil
            </Text>

            <Text style={styles.updateWarningText}>
              Seguimos mostrando la última información disponible.
            </Text>
          </View>
        ) : null}
        <Card variant="outlined" style={styles.heroCard}>
          <View style={[styles.hero, isMobile && styles.heroMobile]}>
            <Avatar name={fullName} size={76} />

            <View style={[styles.heroCopy, isMobile && styles.heroCopyMobile]}>
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

        <View style={[styles.columns, !isDesktop && styles.columnsMobile]}>
          <View style={[styles.mainColumn, !isDesktop && styles.fullColumn]}>
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

            <SectionCard title="Opiniones y Reseñas de Clientes" icon="star-outline">
              {reviewsData && reviewsData.total_resenas > 0 ? (
                <View>
                  <View style={styles.ratingSummaryRow}>
                    <Ionicons name="star" size={24} color="#F59E0B" />
                    <Text style={styles.ratingAverage}>{reviewsData.promedio}</Text>
                    <Text style={styles.ratingTotal}>
                      ({reviewsData.total_resenas} {reviewsData.total_resenas === 1 ? "reseña" : "reseñas"})
                    </Text>
                  </View>

                  <View style={styles.reviewsList}>
                    {reviewsData.resenas.map((r) => (
                      <View key={r.id} style={styles.reviewItem}>
                        <View style={styles.reviewItemHeader}>
                          <Text style={styles.reviewClientName}>{r.cliente_nombre}</Text>
                          <View style={styles.starsInline}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Ionicons
                                key={s}
                                name={s <= r.calificacion ? "star" : "star-outline"}
                                size={14}
                                color="#F59E0B"
                              />
                            ))}
                          </View>
                        </View>
                        <Text style={styles.reviewItemComment}>"{r.comentario}"</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyText}>
                  Aún no tienes reseñas registradas. Al completar trabajos para tus clientes en Valledupar, ellos calificarán obligatoriamente tu atención y aparecerán aquí.
                </Text>
              )}
            </SectionCard>
          </View>

          <View style={[styles.sideColumn, !isDesktop && styles.fullColumn]}>
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
              <Button
                variant="outline"
                onPress={handleUpdate}
                loading={updating}
                loadingLabel="Actualizando...">
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

  heroMobile: {
    flexDirection: "column",

    alignItems: "flex-start",
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

    alignItems: "flex-start",

    gap: spacing.xl,

    marginTop: spacing.xl,
  },

  columnsMobile: {
    flexDirection: "column",

    gap: spacing.xl,
  },

  mainColumn: {
    flex: 2,

    gap: spacing.xl,
  },

  sideColumn: {
    flex: 1,

    minWidth: 300,

    gap: spacing.xl,
  },

  fullColumn: {
    width: "100%",

    minWidth: 0,

    flexGrow: 0,

    flexShrink: 0,

    flexBasis: "auto",
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

  buttonGap: {
    height: spacing.md,
  },
  ratingSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: spacing.md,
  },
  ratingAverage: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  ratingTotal: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  reviewsList: {
    gap: spacing.md,
  },
  reviewItem: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  reviewClientName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  starsInline: {
    flexDirection: "row",
    gap: 2,
  },
  reviewItemComment: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
});
