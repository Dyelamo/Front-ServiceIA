import React from "react";

import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Input, Card } from "../../../../../shared/ui/index";

import { colors, spacing } from "../../../../../theme/index";

import { useResponsive } from "../../../../../shared/hooks/useResponsive";

import { useRequestDraft } from "../../../context/RequestDraftContext";

import RequestWizardLayout from "../../../components/RequestWizardLayout";

export default function LocationScreen({ navigation }) {
  const { draft, updateDraft } = useRequestDraft();

  const { isDesktop } = useResponsive();

  return (
    <RequestWizardLayout
      navigation={navigation}
      currentStep={3}
      title="¿Dónde necesitas el servicio?"
      description="Indícanos dónde debe realizarse el trabajo."
      onContinue={() => navigation.navigate("CreateRequestUrgency")}>
      <Card variant="outlined" style={styles.locationCard}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={25} color={colors.primary} />
        </View>

        <View style={styles.locationText}>
          <Text style={styles.city}>Valledupar</Text>

          <Text style={styles.region}>Cesar, Colombia</Text>
        </View>
      </Card>

      <View style={[styles.fields, isDesktop && styles.fieldsDesktop]}>
        <View style={styles.field}>
          <Input
            label="Dirección"
            placeholder="Ej. Calle 16 #12-34"
            value={draft.address}
            onChangeText={(address) =>
              updateDraft({
                address,
              })
            }
          />
        </View>

        <View style={[styles.field, !isDesktop && styles.fieldMobileSpacing]}>
          <Input
            label="Referencia (opcional)"
            placeholder="Ej. Casa blanca frente al parque"
            value={draft.reference}
            onChangeText={(reference) =>
              updateDraft({
                reference,
              })
            }
          />
        </View>
      </View>
    </RequestWizardLayout>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    flexDirection: "row",
    alignItems: "center",

    padding: spacing.lg,
  },

  locationIcon: {
    width: 48,
    height: 48,

    borderRadius: 14,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  locationText: {
    marginLeft: spacing.md,
  },

  city: {
    color: colors.text,

    fontSize: 16,
    fontWeight: "700",
  },

  region: {
    color: colors.textSecondary,

    fontSize: 13,

    marginTop: 2,
  },

  fields: {
    marginTop: spacing.xl,
  },

  fieldsDesktop: {
    flexDirection: "row",

    gap: spacing.lg,
  },

  field: {
    flex: 1,
  },

  fieldMobileSpacing: {
    marginTop: spacing.lg,
  },
});
