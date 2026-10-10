import React, { useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "../../../../../theme/index";

import { Card } from "../../../../../shared/ui/index";

import { useResponsive } from "../../../../../shared/hooks/useResponsive";

import { createServiceRequest } from "../../../api/requests.api";

import { useRequestDraft } from "../../../context/RequestDraftContext";

import RequestWizardLayout from "../../../components/RequestWizardLayout";

export default function ReviewScreen({ navigation }) {
  const { draft } = useRequestDraft();

  const { isDesktop } = useResponsive();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handlePublish = async () => {
    if (loading) {
      return;
    }

    if (!draft.description?.trim() || !draft.categoryId || !draft.urgency) {
      setError("Falta información necesaria para publicar la solicitud.");

      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await createServiceRequest({
        description: draft.description,

        categoryId: draft.categoryId,

        categoryLabel: draft.categoryName,

        urgency: draft.urgency,

        urgencyLabel: draft.urgencyLabel,

        location: draft.location,

        address: draft.address,

        reference: draft.reference,

        photos: draft.photos,
      });

      navigation.reset({
        index: 1,

        routes: [
          {
            name: "ClientTabs",
          },

          {
            name: "CreateRequestSuccess",

            params: {
              result,
            },
          },
        ],
      });

      resetDraft();

      navigation.reset({
        index: 1,

        routes: [
          {
            name: "ClientTabs",
          },

          {
            name: "CreateRequestSuccess",

            params: {
              result,
            },
          },
        ],
      });
    } catch (err) {
      console.error("Error publicando solicitud:", err);

      setError(
        getApiErrorMessage(
          err,
          "No pudimos publicar tu solicitud. Intenta nuevamente.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  function getApiErrorMessage(err, fallback) {
    const detail = err?.response?.data?.detail ?? err?.response?.data?.message;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      const first = detail[0];

      if (typeof first === "string") {
        return first;
      }

      if (first?.msg) {
        return first.msg;
      }
    }

    if (detail?.msg) {
      return detail.msg;
    }

    return fallback;
  }

  return (
    <RequestWizardLayout
      navigation={navigation}
      currentStep={5}
      totalSteps={5}
      title="Revisa tu solicitud"
      description="Verifica que la información esté correcta antes de publicarla."
      continueLabel="Publicar solicitud"
      loadingLabel="Publicando..."
      onContinue={handlePublish}
      loading={loading}>
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={colors.error}
          />

          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.reviewGrid}>
        <View
          style={[styles.cardWrapper, isDesktop && styles.cardWrapperDesktop]}>
          <Card variant="outlined" style={styles.card}>
            <Text style={styles.cardTitle}>Solicitud</Text>

            <ReviewRow
              icon="document-text-outline"
              label="Descripción"
              value={draft.description}
            />

            <Divider />

            <ReviewRow
              icon="grid-outline"
              label="Categoría"
              value={draft.categoryName || "Sin categoría"}
            />
          </Card>
        </View>

        <View
          style={[styles.cardWrapper, isDesktop && styles.cardWrapperDesktop]}>
          <Card variant="outlined" style={styles.card}>
            <Text style={styles.cardTitle}>Detalles</Text>

            <ReviewRow
              icon="location-outline"
              label="Ubicación"
              value={
                draft.address
                  ? `${draft.address}, Valledupar`
                  : draft.location || "Valledupar, Cesar"
              }
            />

            {draft.reference ? (
              <>
                <Divider />

                <ReviewRow
                  icon="navigate-outline"
                  label="Referencia"
                  value={draft.reference}
                />
              </>
            ) : null}

            <Divider />

            <ReviewRow
              icon="time-outline"
              label="Urgencia"
              value={draft.urgencyLabel || "No especificada"}
            />

            <Divider />

            <ReviewRow
              icon="images-outline"
              label="Fotos"
              value={
                draft.photos.length > 0
                  ? `${draft.photos.length} agregada${
                      draft.photos.length === 1 ? "" : "s"
                    }`
                  : "Sin fotos"
              }
            />
          </Card>
        </View>
      </View>

      <View style={styles.notice}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={colors.primary}
        />

        <Text style={styles.noticeText}>
          Al publicar, los profesionales disponibles podrán consultar la
          solicitud y enviarte ofertas.
        </Text>
      </View>
    </RequestWizardLayout>
  );
}

function ReviewRow({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>

      <View style={styles.rowContent}>
        <Text style={styles.label}>{label}</Text>

        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  reviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    marginHorizontal: -6,
  },

  cardWrapper: {
    width: "100%",

    padding: 6,
  },

  cardWrapperDesktop: {
    width: "50%",
  },

  card: {
    height: "100%",

    padding: spacing.xl,
  },

  cardTitle: {
    color: colors.text,

    fontSize: 17,
    fontWeight: "800",

    marginBottom: spacing.lg,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconContainer: {
    width: 36,
    height: 36,

    borderRadius: 10,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  rowContent: {
    flex: 1,

    marginLeft: spacing.md,
  },

  label: {
    color: colors.textSecondary,

    fontSize: 12,
    fontWeight: "600",
  },

  value: {
    marginTop: 4,

    color: colors.text,

    fontSize: 14,
    lineHeight: 21,

    fontWeight: "500",
  },

  divider: {
    height: 1,

    backgroundColor: colors.border,

    marginVertical: spacing.lg,
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",

    marginTop: spacing.xl,

    padding: spacing.lg,

    backgroundColor: colors.primaryLight,

    borderRadius: 12,
  },

  noticeText: {
    flex: 1,

    color: colors.textSecondary,

    fontSize: 13,
    lineHeight: 19,

    marginLeft: spacing.sm,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",

    marginBottom: spacing.lg,

    padding: spacing.md,

    backgroundColor: "#FEF2F2",

    borderWidth: 1,
    borderColor: "#FECACA",

    borderRadius: 12,
  },

  errorText: {
    flex: 1,

    color: "#B91C1C",

    marginLeft: spacing.sm,

    fontSize: 14,
    lineHeight: 20,
  },
});
