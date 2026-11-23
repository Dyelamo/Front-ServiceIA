import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, layout, radius, spacing } from "../../../theme";
import { Avatar, Button, Card, Divider, ErrorState, Skeleton } from "../../../shared/ui";
import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout";
import { useResponsive } from "../../../shared/hooks/useResponsive";
import { getProfessionalByIdApi } from "../api/professional.api";
import { fetchProviderReviews } from "../../reviews/api/reviews.api";
import { categories as serviceCategories } from "../../requests/data/categories";
import { formatDistance } from "../../location/location";

export default function WorkerProfileScreen({ navigation, route }) {
  const { isDesktop, isMobile } = useResponsive();
  const workerId =
    route?.params?.workerId || route?.params?.provider?.id || route?.params?.providerId;
  const initialProvider = route?.params?.provider;
  const initialName =
    route?.params?.workerName ||
    initialProvider?.nombre_completo ||
    initialProvider?.usuario?.nombre_completo ||
    "Profesional";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profile, setProfile] = useState(initialProvider || null);
  const [reviewsData, setReviewsData] = useState(null);

  const loadData = useCallback(async () => {
    if (!workerId) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const [prestadorData, resenasData] = await Promise.all([
        getProfessionalByIdApi(workerId).catch((err) => {
          console.error("Error cargando datos del prestador:", err);
          return null;
        }),
        fetchProviderReviews(workerId).catch((err) => {
          console.error("Error cargando reseñas del prestador:", err);
          return null;
        }),
      ]);

      if (prestadorData) {
        setProfile(prestadorData);
      }
      if (resenasData) {
        setReviewsData(resenasData);
      }
    } catch (e) {
      console.error("Error en WorkerProfileScreen:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const fullName = profile?.nombre_completo || profile?.usuario?.nombre_completo || initialName;
  const location = profile?.ubicacion || profile?.usuario?.ubicacion || "Valledupar, Cesar";
  const description = profile?.descripcion || profile?.sobre_mi || "";
  const isAvailable = profile?.disponible ?? true;
  const isVerified = profile?.verificado ?? false;
  const specialties = Array.isArray(profile?.categorias)
    ? profile.categorias
    : Array.isArray(profile?.especialidades)
      ? profile.especialidades
      : [];

  const promedio = reviewsData?.promedio ?? 0;
  const totalResenas = reviewsData?.total_resenas ?? 0;
  const resenas = reviewsData?.resenas ?? [];

  if (loading && !profile) {
    return (
      <Screen>
        <AppHeader
          title="Perfil del Profesional"
          onBack={() => navigation.goBack()}
          maxWidth={layout.content.wide}
        />
        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          <Skeleton height={200} style={styles.skeleton} />
          <Skeleton height={140} style={styles.skeleton} />
          <Skeleton height={220} />
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (error && !profile) {
    return (
      <Screen>
        <AppHeader
          title="Perfil del Profesional"
          onBack={() => navigation.goBack()}
          maxWidth={layout.content.wide}
        />
        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          <ErrorState
            title="No se pudo cargar el perfil"
            description="Ocurrió un error al consultar la información del trabajador."
            onRetry={loadData}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader
        title="Perfil del Profesional"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
      />

      <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
        {/* HERO CARD */}
        <Card variant="outlined" style={styles.heroCard}>
          <View style={[styles.hero, isMobile && styles.heroMobile]}>
            <Avatar name={fullName} size={80} />

            <View style={[styles.heroCopy, isMobile && styles.heroCopyMobile]}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{fullName}</Text>
                {isVerified ? (
                  <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                ) : null}
              </View>

              <Text style={styles.role}>Profesional de servicios verificado</Text>
              {route?.params?.distanceKm !== undefined ? (
                <Text style={styles.role}>
                  Distancia a tu solicitud · {formatDistance(route.params.distanceKm)}
                </Text>
              ) : null}

              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: isAvailable ? colors.successLight : colors.surfaceHover,
                    },
                  ]}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: isAvailable ? colors.success : colors.textMuted,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: isAvailable ? colors.successDark : colors.textMuted,
                      },
                    ]}>
                    {isAvailable ? "Disponible" : "No disponible"}
                  </Text>
                </View>

                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={15} color={colors.textMuted} />
                  <Text style={styles.location}>{location}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* PROMEDIO Y RESUMEN DE CALIFICACIONES (Tarjeta destacada) */}
        <Card variant="outlined" style={styles.ratingHeroCard}>
          <View style={styles.ratingHeroContent}>
            <View style={styles.ratingNumberBlock}>
              <Text style={styles.ratingBigNumber}>
                {totalResenas > 0 ? promedio.toFixed(1) : "—"}
              </Text>
              <Text style={styles.ratingScale}>/ 5.0</Text>
            </View>

            <View style={styles.ratingHeroInfo}>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={
                      star <= Math.round(promedio)
                        ? "star"
                        : star - 0.5 <= promedio
                          ? "star-half"
                          : "star-outline"
                    }
                    size={22}
                    color="#F59E0B"
                  />
                ))}
              </View>
              <Text style={styles.ratingHeroTitle}>
                {totalResenas > 0
                  ? `Promedio de satisfacción del ${Math.round((promedio / 5) * 100)}%`
                  : "Profesional nuevo sin calificaciones"}
              </Text>
              <Text style={styles.ratingHeroSubtitle}>
                {totalResenas > 0
                  ? `Basado en ${totalResenas} ${totalResenas === 1 ? "calificación de cliente" : "calificaciones de clientes"}`
                  : "Las calificaciones se generan automáticamente tras completar servicios."}
              </Text>
            </View>
          </View>
        </Card>

        <View style={[styles.columns, !isDesktop && styles.columnsMobile]}>
          {/* COLUMNA PRINCIPAL */}
          <View style={[styles.mainColumn, !isDesktop && styles.fullColumn]}>
            {/* SOBRE MÍ */}
            <SectionCard title="Sobre el profesional" icon="person-outline">
              <Text style={description ? styles.description : styles.emptyText}>
                {description || "Este profesional aún no ha añadido una descripción a su perfil."}
              </Text>
            </SectionCard>

            {/* ESPECIALIDADES */}
            <SectionCard title="Especialidades y Categorías" icon="construct-outline">
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
                <Text style={styles.emptyText}>No tiene especialidades registradas.</Text>
              )}
            </SectionCard>

            {/* LISTA DE OPINIONES DE CLIENTES */}
            <SectionCard title={`Reseñas de Clientes (${totalResenas})`} icon="chatbubbles-outline">
              {resenas.length > 0 ? (
                <View style={styles.reviewsList}>
                  {resenas.map((r) => (
                    <View key={r.id} style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <View style={styles.reviewerInfo}>
                          <View style={styles.reviewerAvatar}>
                            <Text style={styles.reviewerAvatarText}>
                              {(r.cliente_nombre || "C").charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.reviewerName}>
                              {r.cliente_nombre || "Cliente ServIA"}
                            </Text>
                            <Text style={styles.reviewDate}>{formatDate(r.created_at)}</Text>
                          </View>
                        </View>

                        <View style={styles.reviewStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                              key={star}
                              name={star <= r.calificacion ? "star" : "star-outline"}
                              size={15}
                              color="#F59E0B"
                            />
                          ))}
                        </View>
                      </View>

                      <View style={styles.commentContainer}>
                        <Ionicons
                          name="quote"
                          size={16}
                          color={colors.primary}
                          style={styles.quoteIcon}
                        />
                        <Text style={styles.reviewComment}>{r.comentario}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyReviews}>
                  <Ionicons name="star-outline" size={32} color={colors.textMuted} />
                  <Text style={styles.emptyReviewsTitle}>Sin opiniones todavía</Text>
                  <Text style={styles.emptyReviewsSubtitle}>
                    Cuando este profesional termine trabajos contratados, sus clientes dejarán aquí
                    una reseña obligatoria con su puntuación.
                  </Text>
                </View>
              )}
            </SectionCard>
          </View>

          {/* COLUMNA LATERAL (INFORMACIÓN) */}
          <View style={[styles.sideColumn, !isDesktop && styles.fullColumn]}>
            <SectionCard title="Garantía de Confianza" icon="shield-checkmark-outline">
              <View style={styles.trustItem}>
                <Ionicons name="checkmark-done-circle-outline" size={20} color={colors.success} />
                <View style={styles.trustItemCopy}>
                  <Text style={styles.trustItemTitle}>Reseñas 100% Reales</Text>
                  <Text style={styles.trustItemDesc}>
                    Solo los clientes que contratan y completan un servicio pueden calificar.
                  </Text>
                </View>
              </View>

              <Divider style={styles.trustDivider} />

              <View style={styles.trustItem}>
                <Ionicons name="time-outline" size={20} color={colors.primary} />
                <View style={styles.trustItemCopy}>
                  <Text style={styles.trustItemTitle}>Servicio en Valledupar</Text>
                  <Text style={styles.trustItemDesc}>
                    Profesional local activo en la comunidad.
                  </Text>
                </View>
              </View>

              <Divider style={styles.trustDivider} />

              <View style={styles.trustItem}>
                <Ionicons name="star-outline" size={20} color="#F59E0B" />
                <View style={styles.trustItemCopy}>
                  <Text style={styles.trustItemTitle}>Promedio Transparente</Text>
                  <Text style={styles.trustItemDesc}>
                    Puntuación calculada automáticamente sobre todas las calificaciones.
                  </Text>
                </View>
              </View>
            </SectionCard>

            <Button
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              leftIcon={<Ionicons name="arrow-back-outline" size={18} color={colors.primary} />}>
              Volver a la publicación
            </Button>
          </View>
        </View>
      </ResponsiveContainer>
    </Screen>
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

function getSpecialtyName(specialty) {
  if (typeof specialty === "string") {
    const category = serviceCategories.find((item) => item.id === specialty);
    return category?.label || specialty;
  }
  const id = specialty?.id || specialty?.categoria_id;
  const category = serviceCategories.find((item) => item.id === id);
  return specialty?.nombre || specialty?.name || specialty?.label || category?.label || "Servicio";
}

function formatDate(value) {
  if (!value) return "Reciente";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Reciente";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
  },
  skeleton: {
    marginBottom: spacing.lg,
  },
  heroCard: {
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
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
  heroCopyMobile: {
    marginLeft: 0,
    marginTop: spacing.lg,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  name: {
    color: colors.text,
    fontSize: 24,
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
    width: 8,
    height: 8,
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
    gap: 4,
  },
  location: {
    color: colors.textMuted,
    fontSize: 13,
  },

  /* RATING HERO CARD */
  ratingHeroCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderColor: "#FDE68A",
  },
  ratingHeroContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
  },
  ratingNumberBlock: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  ratingBigNumber: {
    fontSize: 34,
    fontWeight: "900",
    color: "#B45309",
  },
  ratingScale: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D97706",
    marginLeft: 4,
  },
  ratingHeroInfo: {
    flex: 1,
  },
  starRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
  ratingHeroTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  ratingHeroSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  /* COLUMNS */
  columns: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  columnsMobile: {
    flexDirection: "column",
  },
  mainColumn: {
    flex: 2,
  },
  sideColumn: {
    flex: 1,
  },
  fullColumn: {
    flex: 1,
  },

  /* SECTIONS */
  sectionCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  sectionContent: {
    marginTop: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: "italic",
  },

  /* ESPECIALIDADES */
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

  /* REVIEWS */
  reviewsList: {
    gap: spacing.md,
  },
  reviewCard: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewerAvatarText: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 14,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    paddingLeft: spacing.xs,
  },
  quoteIcon: {
    marginTop: 2,
    opacity: 0.6,
  },
  reviewComment: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    flex: 1,
  },
  emptyReviews: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  emptyReviewsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptyReviewsSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    lineHeight: 17,
  },

  /* TRUST */
  trustItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  trustItemCopy: {
    flex: 1,
  },
  trustItemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  trustItemDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  trustDivider: {
    marginVertical: spacing.sm,
  },
  backButton: {
    marginTop: spacing.md,
  },
});
