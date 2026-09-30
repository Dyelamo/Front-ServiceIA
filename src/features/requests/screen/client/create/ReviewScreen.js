import React, { useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "../../../../../theme/index";

import { Card } from "../../../../../shared/ui/index";

import { createServiceRequest } from "../../../api/requests.api";

import { useRequestDraft } from "../../../../requests/context/RequestDraftContext";

import RequestWizardLayout from "../../../../requests/components/RequestWizardLayout";

export default function ReviewScreen({ navigation }) {
  const { draft } = useRequestDraft();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handlePublish = async () => {
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

      navigation.replace("CreateRequestSuccess", {
        result,
      });
    } catch (err) {
      console.error("Error publicando solicitud:", err);

      const backendMessage =
        err?.response?.data?.detail || err?.response?.data?.message;

      setError(
        backendMessage ||
          "No pudimos publicar tu solicitud. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequestWizardLayout
      navigation={navigation}
      currentStep={5}
      totalSteps={5}
      title="Revisa tu solicitud"
      description="Verifica que la información esté correcta antes de publicarla."
      continueLabel="Publicar solicitud"
      onContinue={handlePublish}
      loading={loading}>
      {error ? (
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={colors.error}
          />

          <Text style={styles.errorText}>
            {Array.isArray(error) ? error[0]?.msg : error?.msg || error}
          </Text>
        </View>
      ) : null}

      <Card variant="outlined" style={styles.card}>
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

        <Divider />

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
  card: {
    padding: spacing.xl,
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
    fontSize: 15,
    lineHeight: 22,
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

    marginTop: spacing.xxl,

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
