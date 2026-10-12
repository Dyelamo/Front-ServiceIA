import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  colors,
  layout,
  spacing,
} from "../../../../theme/index";

import {
  Button,
  Card,
  Divider
} from "../../../../shared/ui/index";

import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../../shared/layout/index";

import {
  useResponsive,
} from "../../../../shared/hooks/useResponsive";

import {
  categories,
} from "../../data/categories";

function getCategory(
  categoryId
) {
  return categories.find(
    (item) =>
      item.id === categoryId
  );
}

const urgencyLabels = {
  ahora:
    "Lo antes posible",

  hoy:
    "Hoy",

  "esta semana":
    "Esta semana",

  "no tengo prisa":
    "No tengo prisa",
};

export default function ProfessionalRequestDetailScreen({
  navigation,
  route,
}) {
  const {
    isDesktop,
  } = useResponsive();

  const request =
    route?.params?.request;

  if (!request) {
    return (
      <Screen>
        <AppHeader
          title="Solicitud"
          onBack={() =>
            navigation.goBack()
          }
          maxWidth={
            layout.content.wide
          }
        />

        <ResponsiveContainer
          maxWidth={
            layout.content.medium
          }
          style={styles.container}
        >
          <Text
            style={
              styles.notFound
            }
          >
            No encontramos la
            solicitud.
          </Text>
        </ResponsiveContainer>
      </Screen>
    );
  }

  const category =
    getCategory(
      request.categoria_id
    );

  const categoryName =
    category?.label ||
    category?.name ||
    "Servicio";

  const description =
    request.descripcion ||
    "Sin descripción";

  const urgency =
    urgencyLabels[
      request.urgencia
    ] ||
    request.urgencia ||
    "No especificada";

  return (
    <Screen
      scroll
      backgroundColor={
        colors.background
      }
    >
      <AppHeader
        title="Detalle de solicitud"
        onBack={() =>
          navigation.goBack()
        }
        maxWidth={
          layout.content.wide
        }
      />

      <ResponsiveContainer
        maxWidth={
          layout.content.wide
        }
        style={styles.container}
      >
        {/* ENCABEZADO */}

        <View style={styles.heading}>
          <View
            style={
              styles.categoryIcon
            }
          >
            <Ionicons
              name={
                category?.icon ||
                "construct-outline"
              }
              size={26}
              color={colors.primary}
            />
          </View>

          <View
            style={
              styles.headingContent
            }
          >
            <Text
              style={
                styles.category
              }
            >
              {categoryName}
            </Text>

            <Text
              style={[
                styles.title,

                isDesktop &&
                  styles.titleDesktop,
              ]}
            >
              {description}
            </Text>
          </View>
        </View>

        {/* COLUMNAS */}

        <View
          style={[
            styles.columns,

            !isDesktop &&
              styles.columnsMobile,
          ]}
        >
          {/* DESCRIPCIÓN */}

          <View
            style={[
              styles.mainColumn,

              !isDesktop &&
                styles.fullColumn,
            ]}
          >
            <Card
              variant="outlined"
              style={styles.card}
            >
              <SectionHeader
                icon="document-text-outline"
                title="Descripción"
              />

              <Text
                style={
                  styles.description
                }
              >
                {description}
              </Text>
            </Card>
          </View>

          {/* SIDEBAR */}

          <View
            style={[
              styles.sideColumn,

              !isDesktop &&
                styles.fullColumn,

              !isDesktop &&
                styles.sideMobile,
            ]}
          >
            <Card
              variant="outlined"
              style={styles.card}
            >
              <SectionHeader
                icon="information-circle-outline"
                title="Información"
              />

              <InfoRow
                icon="grid-outline"
                label="Categoría"
                value={categoryName}
              />

              <Divider />

              <InfoRow
                icon="location-outline"
                label="Ubicación"
                value="Valledupar, Cesar"
              />

              <Divider />

              <InfoRow
                icon="time-outline"
                label="Urgencia"
                value={urgency}
              />

              <Divider />

              <InfoRow
                icon="calendar-outline"
                label="Publicado"
                value={formatDate(
                  request.created_at
                )}
              />
            </Card>

            <View
              style={styles.notice}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.primary}
              />

              <Text
                style={
                  styles.noticeText
                }
              >
                Revisa los detalles
                antes de enviar una
                oferta. Podrás indicar
                precio, disponibilidad
                y un mensaje.
              </Text>
            </View>

            <View
              style={styles.action}
            >
              <Button
                onPress={() =>
                  navigation.navigate(
                    "CreateOffer",
                    {
                      request,
                    }
                  )
                }
              >
                Enviar oferta
              </Button>
            </View>
          </View>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

function SectionHeader({
  icon,
  title,
}) {
  return (
    <View
      style={
        styles.sectionHeader
      }
    >
      <View
        style={
          styles.sectionIcon
        }
      >
        <Ionicons
          name={icon}
          size={19}
          color={colors.primary}
        />
      </View>

      <Text
        style={styles.cardTitle}
      >
        {title}
      </Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <View
      style={styles.infoRow}
    >
      <Ionicons
        name={icon}
        size={18}
        color={colors.primary}
      />

      <View
        style={
          styles.infoContent
        }
      >
        <Text
          style={
            styles.infoLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.infoValue
          }
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "es-CO",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingVertical:
        spacing.xxl,
    },

    notFound: {
      color:
        colors.textSecondary,

      fontSize: 15,
    },

    heading: {
      flexDirection: "row",

      alignItems:
        "flex-start",

      marginBottom:
        spacing.xxl,
    },

    categoryIcon: {
      width: 54,
      height: 54,

      borderRadius: 15,

      backgroundColor:
        colors.primaryLight,

      alignItems: "center",
      justifyContent: "center",
    },

    headingContent: {
      flex: 1,

      marginLeft:
        spacing.lg,
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

      alignItems:
        "flex-start",

      gap:
        spacing.xl,
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
      marginTop:
        spacing.lg,
    },

    card: {
      width: "100%",

      padding:
        spacing.xl,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",

      marginBottom:
        spacing.xl,
    },

    sectionIcon: {
      width: 38,
      height: 38,

      borderRadius: 11,

      backgroundColor:
        colors.primaryLight,

      alignItems: "center",
      justifyContent: "center",
    },

    cardTitle: {
      color: colors.text,

      fontSize: 17,
      fontWeight: "800",

      marginLeft:
        spacing.md,
    },

    description: {
      color:
        colors.textSecondary,

      fontSize: 15,
      lineHeight: 24,
    },

    infoRow: {
      flexDirection: "row",
      alignItems:
        "flex-start",
    },

    infoContent: {
      flex: 1,

      marginLeft:
        spacing.md,
    },

    infoLabel: {
      color:
        colors.textMuted,

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

      alignItems:
        "flex-start",

      marginTop:
        spacing.lg,

      padding:
        spacing.lg,

      backgroundColor:
        colors.primaryLight,

      borderRadius: 12,
    },

    noticeText: {
      flex: 1,

      marginLeft:
        spacing.sm,

      color:
        colors.textSecondary,

      fontSize: 13,
      lineHeight: 20,
    },

    action: {
      marginTop:
        spacing.lg,
    },
  });