import React from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import {
  categories,
} from "../../../data/categories";

import {
  useRequestDraft,
} from "../../../context/RequestDraftContext";

import CategoryCard
  from "../../../components/CategoryCard";

import RequestWizardLayout
  from "../../../components/RequestWizardLayout";

import {
  useResponsive,
} from "../../../../../shared/hooks/useResponsive";

export default function CategoryScreen({
  navigation,
}) {
  const {
    draft,
    updateDraft,
  } = useRequestDraft();

  const {
    isMobile,
  } = useResponsive();

  return (
    <RequestWizardLayout
      navigation={navigation}
      currentStep={2}
      title="¿Qué tipo de servicio necesitas?"
      description="Selecciona la categoría que mejor describa tu necesidad."
      continueDisabled={
        !draft.categoryId
      }
      onContinue={() =>
        navigation.navigate(
          "CreateRequestLocation"
        )
      }
    >
      <View style={styles.grid}>
        {categories.map(
          (category) => (
            <View
              key={category.id}
              style={[
                styles.item,

                isMobile
                  ? styles.itemMobile
                  : styles.itemWide,
              ]}
            >
              <CategoryCard
                category={category}
                selected={
                  draft.categoryId ===
                  category.id
                }
                onPress={() =>
                  updateDraft({
                    categoryId:
                      category.id,

                    categoryName:
                      category.name ||
                      category.label,
                  })
                }
              />
            </View>
          )
        )}
      </View>
    </RequestWizardLayout>
  );
}

const styles =
  StyleSheet.create({
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",

      marginHorizontal: -6,
    },

    item: {
      padding: 6,
    },

    itemMobile: {
      width: "50%",
    },

    itemWide: {
      width: "33.3333%",
    },
  });