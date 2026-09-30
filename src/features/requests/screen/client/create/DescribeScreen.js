import React from "react";

import { Text, StyleSheet } from "react-native";

import { TextArea } from "../../../../../shared/ui/index";

import { colors, spacing } from "../../../../../theme/index.js";

import { useRequestDraft } from "../../../context/RequestDraftContext";

import RequestWizardLayout from "../../../components/RequestWizardLayout";

export default function DescribeScreen({ navigation }) {
  const { draft, updateDraft } = useRequestDraft();

  const isValid = draft.description.trim().length >= 10;

  return (
    <RequestWizardLayout
      navigation={navigation}
      currentStep={1}
      title="¿Qué necesitas solucionar?"
      description="Cuéntanos qué está pasando. Entre más detalles proporciones, mejores ofertas podrás recibir."
      continueDisabled={!isValid}
      onContinue={() => navigation.navigate("CreateRequestCategory")}>
      <TextArea
        placeholder="Ej. Tengo una fuga debajo del lavaplatos desde esta mañana..."
        value={draft.description}
        onChangeText={(description) =>
          updateDraft({
            description,
          })
        }
        maxLength={500}
      />

      <Text style={styles.counter}>{draft.description.length}/500</Text>
    </RequestWizardLayout>
  );
}

const styles = StyleSheet.create({
  counter: {
    textAlign: "right",
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
