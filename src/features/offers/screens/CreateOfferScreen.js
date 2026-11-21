import React, { useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";

import { colors, layout, radius, spacing } from "../../../theme/index";

import { Button, Card, Input, TextArea } from "../../../shared/ui/index";

import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout/index";

import { useResponsive } from "../../../shared/hooks/useResponsive";
import { getApiErrorMessage } from "../../../core/errors/error-message";
import { queryKeys } from "../../../core/query/query-keys";

import { categories } from "../../requests/data/categories";

import { createProfessionalOffer } from "../api/offers.api";
import { offerSchema } from "../schema/offer.schema";

const URGENCY_LABELS = {
  ahora: "Lo antes posible",

  hoy: "Hoy",

  "esta semana": "Esta semana",

  "no tengo prisa": "No tengo prisa",
};

export default function CreateOfferScreen({ navigation, route }) {
  const request = route?.params?.request;

  const { isDesktop } = useResponsive();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: { price: "", availability: "", message: "" },
    mode: "onTouched",
  });
  const message = useWatch({ control, name: "message" }) || "";

  const categoryId = request?.categoria_id || request?.categoryId;
  const category = categories.find((item) => item.id === categoryId);

  const categoryName =
    request?.categoryName ||
    category?.label ||
    category?.name ||
    request?.categoria?.nombre ||
    "Servicio";

  const urgency =
    request?.urgencyLabel ||
    URGENCY_LABELS[request?.urgencia || request?.urgency] ||
    request?.urgencia ||
    request?.urgency ||
    "No especificada";

  const createOfferMutation = useMutation({
    mutationFn: createProfessionalOffer,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.professionalOffers }),
        queryClient.invalidateQueries({ queryKey: queryKeys.professionalRequests }),
      ]);
      navigation.navigate("ProfessionalTabs", {
        screen: "ProfessionalOffers",
        params: { offerSent: true },
      });
    },
    onError: (err) => {
      console.error("Error enviando oferta:", err);
      setError(getApiErrorMessage(err, "No pudimos enviar la oferta. Intenta nuevamente."));
    },
  });

  const submitOffer = ({ price, availability, message: offerMessage }) => {
    if (!request?.id || createOfferMutation.isPending) return;
    setError("");
    createOfferMutation.mutate({
      publicationId: request.id,
      price: Number(price),
      availability: availability.trim(),
      message: offerMessage.trim(),
    });
  };

  const loading = createOfferMutation.isPending;

  if (!request) {
    return (
      <Screen>
        <AppHeader
          title="Enviar oferta"
          onBack={loading ? undefined : () => navigation.goBack()}
          maxWidth={layout.content.wide}
        />

        <ResponsiveContainer maxWidth={layout.content.medium} style={styles.container}>
          <Text style={styles.missingText}>No encontramos la solicitud para crear la oferta.</Text>
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader
        title="Enviar oferta"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
      />

      <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
        <View style={[styles.columns, !isDesktop && styles.columnsMobile]}>
          {/* RESUMEN */}

          <View style={[styles.summaryColumn, !isDesktop && styles.fullColumn]}>
            <Card variant="outlined" style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={styles.summaryIcon}>
                  <Ionicons
                    name={category?.icon || "construct-outline"}
                    size={23}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.summaryHeaderCopy}>
                  <Text style={styles.summaryEyebrow}>SOLICITUD</Text>

                  <Text style={styles.summaryCategory}>{categoryName}</Text>
                </View>
              </View>

              <Text style={styles.requestDescription}>
                {request.descripcion || "Sin descripción"}
              </Text>

              <View style={styles.divider} />

              <SummaryRow
                icon="location-outline"
                label="Ubicación"
                value={request.location || request.direccion || "Valledupar, Cesar"}
              />

              <View style={styles.summaryGap} />

              <SummaryRow icon="time-outline" label="Urgencia" value={urgency} />
            </Card>
          </View>

          {/* FORMULARIO */}

          <View
            style={[
              styles.formColumn,

              !isDesktop && styles.fullColumn,

              !isDesktop && styles.formMobile,
            ]}>
            <Text style={styles.title}>Prepara tu propuesta</Text>

            <Text style={styles.description}>
              Indica cuánto cobrarías, cuándo puedes realizar el trabajo y cómo puedes ayudar al
              cliente.
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.error} />

                <Text style={styles.errorText}>
                  {Array.isArray(error) ? error[0]?.msg : error?.msg || error}
                </Text>
              </View>
            ) : null}

            <Card variant="outlined" style={styles.formCard}>
              <View style={[styles.fieldRow, !isDesktop && styles.fieldRowMobile]}>
                <View style={styles.field}>
                  <Controller
                    control={control}
                    name="price"
                    render={({ field: { onBlur, onChange, value } }) => (
                      <Input
                        label="Precio"
                        placeholder="Ej. 120000"
                        keyboardType="numeric"
                        value={value}
                        onBlur={onBlur}
                        editable={!loading}
                        onChangeText={(nextValue) => {
                          onChange(nextValue.replace(/[^0-9]/g, ""));
                          setError("");
                        }}
                        error={errors.price?.message}
                        helperText="Valor en pesos colombianos"
                      />
                    )}
                  />
                </View>

                <View style={[styles.field, !isDesktop && styles.fieldMobile]}>
                  <Controller
                    control={control}
                    name="availability"
                    render={({ field: { onBlur, onChange, value } }) => (
                      <Input
                        label="Disponibilidad"
                        placeholder="Ej. Hoy después de las 3:00 p.m."
                        value={value}
                        onBlur={onBlur}
                        editable={!loading}
                        onChangeText={(nextValue) => {
                          onChange(nextValue);
                          setError("");
                        }}
                        error={errors.availability?.message}
                        maxLength={120}
                      />
                    )}
                  />
                </View>
              </View>

              <View style={styles.messageField}>
                <Controller
                  control={control}
                  name="message"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <TextArea
                      label="Mensaje"
                      placeholder="Cuéntale al cliente cómo puedes ayudarlo..."
                      value={value}
                      onBlur={onBlur}
                      editable={!loading}
                      onChangeText={(nextValue) => {
                        onChange(nextValue);
                        setError("");
                      }}
                      error={errors.message?.message}
                      maxLength={500}
                    />
                  )}
                />

                <Text style={styles.counter}>{message.length}/500</Text>
              </View>

              <View style={[styles.action, isDesktop && styles.actionDesktop]}>
                <View style={[styles.actionButton, isDesktop && styles.actionButtonDesktop]}>
                  <Button
                    onPress={handleSubmit(submitOffer)}
                    disabled={loading}
                    loading={loading}
                    loadingLabel="Enviando oferta...">
                    Enviar oferta
                  </Button>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ResponsiveContainer>
    </Screen>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon} size={18} color={colors.primary} />

      <View style={styles.summaryRowCopy}>
        <Text style={styles.summaryLabel}>{label}</Text>

        <Text style={styles.summaryValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
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

  summaryColumn: {
    flex: 1,

    minWidth: 300,
  },

  formColumn: {
    flex: 2,
  },

  fullColumn: {
    width: "100%",
    minWidth: 0,

    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },

  formMobile: {
    marginTop: spacing.xxl,
  },

  summaryCard: {
    padding: spacing.xl,
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 46,
    height: 46,

    borderRadius: 13,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  summaryHeaderCopy: {
    flex: 1,

    marginLeft: spacing.md,
  },

  summaryEyebrow: {
    color: colors.textMuted,

    fontSize: 10,
    fontWeight: "800",

    letterSpacing: 0.8,
  },

  summaryCategory: {
    color: colors.primary,

    fontSize: 15,
    fontWeight: "700",

    marginTop: 2,
  },

  requestDescription: {
    color: colors.text,

    fontSize: 16,
    lineHeight: 23,

    fontWeight: "700",

    marginTop: spacing.xl,
  },

  divider: {
    height: 1,

    backgroundColor: colors.border,

    marginVertical: spacing.xl,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  summaryRowCopy: {
    flex: 1,

    marginLeft: spacing.md,
  },

  summaryLabel: {
    color: colors.textMuted,

    fontSize: 11,
  },

  summaryValue: {
    color: colors.text,

    fontSize: 14,
    fontWeight: "600",

    marginTop: 3,
  },

  summaryGap: {
    height: spacing.lg,
  },

  title: {
    color: colors.text,

    fontSize: 28,
    fontWeight: "800",
  },

  description: {
    color: colors.textSecondary,

    fontSize: 15,
    lineHeight: 22,

    marginTop: spacing.sm,

    maxWidth: 620,
  },

  formCard: {
    marginTop: spacing.xxl,

    padding: spacing.xl,
  },

  fieldRow: {
    flexDirection: "row",

    gap: spacing.lg,
  },

  fieldRowMobile: {
    flexDirection: "column",

    gap: 0,
  },

  field: {
    flex: 1,
  },

  fieldMobile: {
    marginTop: spacing.lg,
  },

  messageField: {
    marginTop: spacing.xl,
  },

  counter: {
    textAlign: "right",

    color: colors.textMuted,

    fontSize: 12,

    marginTop: spacing.xs,
  },

  action: {
    marginTop: spacing.xxl,
  },

  actionDesktop: {
    flexDirection: "row",

    justifyContent: "flex-end",
  },

  actionButton: {
    width: "100%",
  },

  actionButtonDesktop: {
    width: 220,
  },

  errorBox: {
    flexDirection: "row",

    marginTop: spacing.xxl,

    padding: spacing.md,

    backgroundColor: "#FEF2F2",

    borderRadius: radius.md,

    borderWidth: 1,

    borderColor: "#FECACA",
  },

  errorText: {
    flex: 1,

    marginLeft: spacing.sm,

    color: "#B91C1C",

    fontSize: 14,
    lineHeight: 20,
  },

  missingText: {
    color: colors.textSecondary,

    fontSize: 15,
  },
});
