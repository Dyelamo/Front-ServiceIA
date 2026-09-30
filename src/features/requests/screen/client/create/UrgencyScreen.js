import React from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../../../../../theme";

import { useRequestDraft } from "../../../context/RequestDraftContext";

import RequestWizardLayout from "../../../components/RequestWizardLayout";

const urgencyOptions = [
  {
    value: "ahora",
    label: "Lo antes posible",
    description: "Necesito ayuda cuanto antes.",
    icon: "flash-outline",
  },

  {
    value: "hoy",
    label: "Hoy",
    description: "Quiero resolverlo durante el día.",
    icon: "today-outline",
  },

  {
    value: "esta semana",
    label: "Esta semana",
    description: "Tengo flexibilidad durante los próximos días.",
    icon: "calendar-outline",
  },

  {
    value: "no tengo prisa",
    label: "No tengo prisa",
    description: "Puedo coordinar el servicio con tranquilidad.",
    icon: "time-outline",
  },
];

export default function UrgencyScreen({ navigation }) {
  const { draft, updateDraft } = useRequestDraft();

  const handleSelect = (option) => {
    updateDraft({
      urgency: option.value,
      urgencyLabel: option.label,
    });
  };

  const handleContinue = () => {
    if (!draft.urgency) {
      return;
    }

    navigation.navigate("CreateRequestPhotos");
  };

  return (
    <RequestWizardLayout
      navigation={navigation}
      currentStep={4}
      totalSteps={5}
      title="¿Para cuándo necesitas el servicio?"
      description="Selecciona la opción que mejor describa qué tan pronto necesitas ayuda."
      continueDisabled={!draft.urgency}
      onContinue={handleContinue}>
      <View style={styles.list}>
        {urgencyOptions.map((option) => {
          const selected = draft.urgency === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => handleSelect(option)}
              style={({ pressed }) => [
                styles.option,

                selected && styles.optionSelected,

                pressed && styles.optionPressed,
              ]}>
              <View
                style={[
                  styles.iconContainer,

                  selected && styles.iconContainerSelected,
                ]}>
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={selected ? colors.white : colors.primary}
                />
              </View>

              <View style={styles.content}>
                <Text style={[styles.title, selected && styles.titleSelected]}>
                  {option.label}
                </Text>

                <Text style={styles.description}>{option.description}</Text>
              </View>

              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected ? <View style={styles.radioDot} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </RequestWizardLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },

  option: {
    width: "100%",

    minHeight: 92,

    flexDirection: "row",
    alignItems: "center",

    padding: spacing.lg,

    marginBottom: spacing.md,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.lg,
  },

  optionSelected: {
    borderColor: colors.primary,

    backgroundColor: colors.primaryLight,
  },

  optionPressed: {
    opacity: 0.8,
  },

  iconContainer: {
    width: 48,
    height: 48,

    borderRadius: 14,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",
  },

  iconContainerSelected: {
    backgroundColor: colors.primary,
  },

  content: {
    flex: 1,

    marginHorizontal: spacing.lg,
  },

  title: {
    color: colors.text,

    fontSize: 16,
    fontWeight: "700",
  },

  titleSelected: {
    color: colors.primaryDark,
  },

  description: {
    marginTop: 4,

    color: colors.textSecondary,

    fontSize: 13,
    lineHeight: 19,
  },

  radio: {
    width: 22,
    height: 22,

    borderRadius: 11,

    borderWidth: 2,
    borderColor: colors.borderStrong,

    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: colors.primary,
  },

  radioDot: {
    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor: colors.primary,
  },
});
