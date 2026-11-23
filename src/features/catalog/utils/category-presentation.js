import { categories as localCategories } from "../../requests/data/categories";

const normalizeCategoryName = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es-CO");

export function resolveCategoryIcon(categoryId, categoryName) {
  const normalizedId = categoryId ? String(categoryId) : "";
  const normalizedName = normalizeCategoryName(categoryName);
  const localCategory = localCategories.find(
    (category) =>
      category.id === normalizedId || normalizeCategoryName(category.name) === normalizedName,
  );

  return localCategory?.icon || "construct-outline";
}
