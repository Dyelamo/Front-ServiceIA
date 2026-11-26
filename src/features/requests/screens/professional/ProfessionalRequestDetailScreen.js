import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { colors, layout, spacing } from "../../../../theme/index";

import { Button, Card, Divider } from "../../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../../shared/layout/index";

import { useResponsive } from "../../../../shared/hooks/useResponsive";
import { useProfessionalAvailability } from "../../../professional/hooks/useProfessionalAvailability";
import { resolveCategoryIcon } from "../../../catalog/utils/category-presentation";

import { categories } from "../../data/categories";
import { publicationDistance } from "../../../location/location";
import { queryKeys } from "../../../../core/query/query-keys";
import { fetchPublicationById } from "../../api/requests.api";
import { getRequestImages } from "../../utils/requestImages";
import RequestImageGallery from "../../components/RequestImageGallery";
import ProfessionalNotificationButton from "../../../notifications/components/ProfessionalNotificationButton";

function getCategory(categoryId) {
  return categories.find((item) => item.id === categoryId);
}

const urgencyLabels = {
  ahora: "Lo antes posible",

  hoy: "Hoy",

  "esta semana": "Esta semana",

  "no tengo prisa": "No tengo prisa",
};

export default function ProfessionalRequestDetailScreen({ navigation, route }) {
  const { isDesktop } = useResponsive();
  const { isAvailable } = useProfessionalAvailability();

  const initialRequest = route?.params?.request;
  const { data: request = initialRequest } = useQuery({
    queryKey: queryKeys.publicationDetail(initialRequest?.id),
    queryFn: () => fetchPublicationById(initialRequest.id),
    enabled: Boolean(initialRequest?.id),
  });

  if (!request) {
    return (
      <Screen>
        <AppHeader
          title="Solicitud"
          onBack={() => navigation.goBack()}
          maxWidth={layout.content.wide}
          action={<ProfessionalNotificationButton navigation={navigation} />}
        />

        <ResponsiveContainer maxWidth={layout.content.medium} style={styles.container}>
          <Text style={styles.notFound}>No encontramos la solicitud.</Text>
        </ResponsiveContainer>
      </Screen>
    );
  }

  const categoryId = request.categoria_id || request.categoryId;
  const category = getCategory(categoryId);

  const categoryName =
    request.categoryName ||
    category?.label ||
    category?.name ||
    request.categoria?.nombre ||
    "Servicio";

  const categoryIcon = request.categoryIcon || resolveCategoryIcon(categoryId, categoryName);

  const description = request.description || request.descripcion || "Sin descripción";

  const urgency =
    request.urgencyLabel ||
    urgencyLabels[request.urgencia || request.urgency] ||
    request.urgencia ||
    request.urgency ||
    "No especificada";

  const locationText =
    request.location ||
    (request.barrio
      ? `${request.barrio} - ${request.direccion || "Valledupar"}${request.referencia ? ` (${request.referencia})` : ""}`
      : request.direccion || "Valledupar, Cesar");

  const images = getRequestImages(request);

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader
        title="Detalle de solicitud"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
        action={<ProfessionalNotificationButton navigation={navigation} />}
      />

      <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
        {/* ENCABEZADO */}

        <View style={styles.heading}>
          <View style={styles.categoryIcon}>
            <Ionicons name={categoryIcon} size={26} color={colors.primary} />
          </View>

          <View style={styles.headingContent}>
            <Text style={styles.category}>{categoryName}</Text>

            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>{description}</Text>
          </View>
        </View>

        {/* COLUMNAS */}

        <View style={[styles.columns, !isDesktop && styles.columnsMobile]}>
          {/* FOTOS Y DESCRIPCIÓN */}

          <View style={[styles.mainColumn, !isDesktop && styles.fullColumn]}>
            {images.length > 0 ? (
              <Card variant="outlined" style={[styles.card, styles.cardSpacing]}>
                <SectionHeader
                  icon="images-outline"
                  title={`Fotos de la necesidad (${images.length})`}
                />

                <RequestImageGallery
                  images={images}
                  emptyMessage="El cliente no adjuntó imágenes en esta solicitud."
                />
              </Card>
            ) : null}

            <Card variant="outlined" style={styles.card}>
              <SectionHeader icon="document-text-outline" title="Descripción" />

              <Text style={styles.description}>{description}</Text>
            </Card>

            {images.length === 0 ? (
              <Card variant="outlined" style={[styles.card, styles.cardTopSpacing]}>
                <SectionHeader icon="images-outline" title="Fotos de la necesidad" />

                <RequestImageGallery
                  images={images}
                  emptyMessage="El cliente no adjuntó imágenes en esta solicitud."
                />
              </Card>
            ) : null}
          </View>

          {/* SIDEBAR */}

          <View
            style={[
              styles.sideColumn,

              !isDesktop && styles.fullColumn,

              !isDesktop && styles.sideMobile,
            ]}>
            <Card variant="outlined" style={styles.card}>
              <SectionHeader icon="information-circle-outline" title="Información" />

              <InfoRow icon="grid-outline" label="Categoría" value={categoryName} />

              <Divider />

              <InfoRow icon="location-outline" label="Ubicación" value={locationText} />
              {request.referencia ? (
                <InfoRow icon="flag-outline" label="Referencia" value={request.referencia} />
              ) : null}
              <InfoRow
                icon="navigate-outline"
                label="Distancia"
                value={publicationDistance(request)}
              />

              <Divider />

              <InfoRow icon="time-outline" label="Urgencia" value={urgency} />

              <Divider />

              <InfoRow
                icon="images-outline"
                label="Fotos adjuntas"
                value={
                  images.length > 0
                    ? `${images.length} foto${images.length === 1 ? "" : "s"}`
                    : "Sin fotos"
                }
              />

              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Publicado"
                value={formatDate(request.created_at)}
              />
            </Card>

            <View style={styles.notice}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />

              <Text style={styles.noticeText}>
                Revisa los detalles antes de enviar una oferta. Podrás indicar precio,
                disponibilidad y un mensaje.
              </Text>
            </View>

            {!isAvailable ? (
              <View style={styles.busyNotice}>
                <Ionicons name="briefcase-outline" size={20} color="#9A3412" />
                <Text style={styles.busyNoticeText}>
                  Ya tienes un servicio activo. Podrás enviar otra oferta cuando finalice o se
                  cancele.
                </Text>
              </View>
            ) : null}

            <View style={styles.action}>
              <Button
                disabled={!isAvailable}
                onPress={() =>
                  navigation.navigate("CreateOffer", {
                    request,
                  })
                }>
                Enviar oferta
              </Button>
            </View>
          </View>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={19} color={colors.primary} />
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.primary} />

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },

  notFound: {
    color: colors.textSecondary,

    fontSize: 15,
  },

  heading: {
    flexDirection: "row",

    alignItems: "flex-start",

    marginBottom: spacing.xxl,
  },

  categoryIcon: {
    width: 54,
    height: 54,

    borderRadius: 15,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  headingContent: {
    flex: 1,

    marginLeft: spacing.lg,
  },

  category: {
    color: colors.primary,

    fontSize: 14,
    fontWeight: "700",
  },

  title: {
    color: colors.text,

    fontSize: 22,
    lineHeight: 30,

    fontWeight: "800",

    marginTop: 3,
  },

  titleDesktop: {
    fontSize: 29,
    lineHeight: 38,

    maxWidth: 800,
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

    minWidth: 320,
  },

  fullColumn: {
    width: "100%",
    minWidth: 0,

    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },

  sideMobile: {
    marginTop: spacing.lg,
  },

  card: {
    width: "100%",

    padding: spacing.xl,
  },

  cardSpacing: {
    marginBottom: spacing.lg,
  },

  cardTopSpacing: {
    marginTop: spacing.lg,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: spacing.xl,
  },

  sectionIcon: {
    width: 38,
    height: 38,

    borderRadius: 11,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    color: colors.text,

    fontSize: 17,
    fontWeight: "800",

    marginLeft: spacing.md,
  },

  description: {
    color: colors.textSecondary,

    fontSize: 15,
    lineHeight: 24,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoContent: {
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
    lineHeight: 20,

    fontWeight: "600",

    marginTop: 3,
  },

  notice: {
    flexDirection: "row",

    alignItems: "flex-start",

    marginTop: spacing.lg,

    padding: spacing.lg,

    backgroundColor: colors.primaryLight,

    borderRadius: 12,
  },

  noticeText: {
    flex: 1,

    marginLeft: spacing.sm,

    color: colors.textSecondary,

    fontSize: 13,
    lineHeight: 20,
  },

  busyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 12,
  },

  busyNoticeText: {
    flex: 1,
    marginLeft: spacing.sm,
    color: "#9A3412",
    fontSize: 13,
    lineHeight: 20,
  },

  action: {
    marginTop: spacing.lg,
  },
});
