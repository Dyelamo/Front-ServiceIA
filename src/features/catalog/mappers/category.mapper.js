import { resolveCategoryIcon } from "../utils/category-presentation";

export const mapCategoryFromApi = (category) => {
  const id = String(category?.id || "");
  const name = category?.nombre || category?.label || category?.name || "Servicio";

  return {
    id,
    name,
    label: name,
    description: category?.descripcion || category?.description || "",
    icon: resolveCategoryIcon(id, name),
  };
};

export const mapCategoriesFromApi = (categories = []) =>
  Array.isArray(categories) ? categories.map(mapCategoryFromApi).filter((item) => item.id) : [];
