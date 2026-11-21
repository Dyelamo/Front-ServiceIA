import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

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
  const [locating, setLocating] = useState(false);

  const selectedBarrio = draft.barrio || "Centro";

  const handleCurrentLocation = async () => {
    if (locating) {
      return;
    }

    setLocating(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso de ubicación requerido",
          "Puedes habilitarlo en la configuración o continuar escribiendo la dirección manualmente.",
        );
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude, accuracy } = current.coords;
      let addressUpdate = {};

      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

        if (place) {
          const streetAddress = [place.street, place.streetNumber].filter(Boolean).join(" ");
          const city = place.city || place.subregion || "Valledupar";
          const region = place.region || "Cesar";

          addressUpdate = {
            city,
            location: `${city}, ${region}`,
            barrio: place.district || place.name || selectedBarrio,
            address: draft.address || streetAddress,
          };
        }
      } catch (geocodeError) {
        console.warn("No pudimos convertir las coordenadas en una dirección:", geocodeError);
      }

      updateDraft({
        ...addressUpdate,
        latitud: latitude,
        longitud: longitude,
        locationAccuracy: accuracy,
      });
    } catch (error) {
      console.error("Error obteniendo la ubicación:", error);
      Alert.alert(
        "No pudimos obtener tu ubicación",
        "Verifica que el GPS esté activo o escribe la dirección manualmente.",
      );
    } finally {
      setLocating(false);
    }
  };

  return (
    <RequestWizardLayout
      navigation={navigation}
      currentStep={3}
      title="¿Dónde necesitas el servicio?"
      description="Usa tu ubicación actual o escribe la dirección donde debe realizarse el trabajo."
      continueDisabled={!draft.address?.trim()}
      onContinue={() => navigation.navigate("CreateRequestUrgency")}>
      <Card variant="outlined" style={styles.locationCard}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={25} color={colors.primary} />
        </View>

        <View style={styles.locationText}>
          <Text style={styles.city}>{draft.location || "Valledupar, Cesar"}</Text>
          <Text style={styles.region}>
            Barrio seleccionado: <Text style={styles.highlightBarrio}>{selectedBarrio}</Text>
          </Text>
          {draft.latitud && draft.longitud ? (
            <Text style={styles.coordinates}>
              {draft.latitud.toFixed(5)}, {draft.longitud.toFixed(5)}
            </Text>
          ) : null}
        </View>
      </Card>

      <Pressable
        accessibilityRole="button"
        disabled={locating}
        onPress={handleCurrentLocation}
        style={({ pressed }) => [styles.locationButton, pressed && styles.locationButtonPressed]}>
        <Ionicons
          name={locating ? "hourglass-outline" : "navigate-outline"}
          size={19}
          color={colors.primary}
        />
        <Text style={styles.locationButtonText}>
          {locating ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
        </Text>
      </Pressable>

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
  coordinates: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  locationButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
  },
  locationButtonPressed: {
    opacity: 0.75,
  },
  locationButtonText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "700",
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
