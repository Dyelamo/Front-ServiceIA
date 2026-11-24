import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LocationPicker from "../../../../location/LocationPicker";
import { hasPoint } from "../../../../location/location";

import { Input, Card } from "../../../../../shared/ui/index";
import { colors, radius, spacing } from "../../../../../theme/index";
import { useResponsive } from "../../../../../shared/hooks/useResponsive";
import { useRequestDraft } from "../../../context/RequestDraftContext";
import RequestWizardLayout from "../../../components/RequestWizardLayout";

const BARRIOS_VALLEDUPAR = [
  "Novalito",
  "Los Fundadores",
  "La Nevada",
  "Centro",
  "Doce de Octubre",
  "San Joaquín",
  "Garupal",
  "Alfonso López",
  "Dangond",
  "Villa del Rosario",
];

export default function LocationScreen({ navigation }) {
  const { draft, updateDraft } = useRequestDraft();
  const { isDesktop } = useResponsive();
  const selectedBarrio = draft.barrio;

  return (
    <RequestWizardLayout
      navigation={navigation}
      currentStep={3}
      title="¿Dónde necesitas el servicio?"
      description="Usa tu ubicación actual o escribe la dirección donde debe realizarse el trabajo."
      continueDisabled={!draft.address?.trim() || !hasPoint(draft)}
      onContinue={() => navigation.navigate("CreateRequestUrgency")}>
      <Card variant="outlined" style={styles.locationCard}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={25} color={colors.primary} />
        </View>

        <View style={styles.locationText}>
          <Text style={styles.city}>{draft.address || draft.location || "Valledupar, Cesar"}</Text>
          <Text style={styles.region}>
            Barrio o sector:{" "}
            <Text style={styles.highlightBarrio}>{selectedBarrio || "Por confirmar"}</Text>
          </Text>
        </View>
      </Card>

      <LocationPicker
        autoLocate
        point={draft}
        address={draft.address}
        onSelect={updateDraft}
        onAddress={({ direccion, barrio, ciudad }) =>
          updateDraft({
            address: direccion,
            ...(barrio ? { barrio } : {}),
            ...(ciudad ? { city: ciudad, location: ciudad } : {}),
          })
        }
      />

      <View style={styles.barrioSection}>
        <Text style={styles.sectionTitle}>Selecciona el sector / barrio:</Text>
        <View style={styles.barriosGrid}>
          {BARRIOS_VALLEDUPAR.map((barrio) => {
            const isSelected = selectedBarrio === barrio;
            return (
              <Pressable
                key={barrio}
                onPress={() => updateDraft({ barrio })}
                style={[styles.barrioChip, isSelected && styles.barrioChipActive]}>
                <Ionicons
                  name={isSelected ? "checkmark-circle" : "location-outline"}
                  size={14}
                  color={isSelected ? colors.primaryDark : colors.textSecondary}
                />
                <Text style={[styles.barrioChipText, isSelected && styles.barrioChipTextActive]}>
                  {barrio}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.customBarrio}>
        <Input
          label="Barrio o sector"
          placeholder="Ej. Centro"
          value={draft.barrio}
          onChangeText={(barrio) => updateDraft({ barrio })}
        />
      </View>

      <View style={[styles.fields, isDesktop && styles.fieldsDesktop]}>
        <View style={styles.field}>
          <Input
            label="Dirección exacta"
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
            label="Referencia adicional (opcional)"
            placeholder="Ej. Frente al parque, rejas blancas"
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
    flex: 1,
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
  highlightBarrio: {
    color: colors.primary,
    fontWeight: "700",
  },
  barrioSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  barriosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  barrioChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  barrioChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  barrioChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  barrioChipTextActive: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  customBarrio: {
    marginTop: spacing.lg,
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
