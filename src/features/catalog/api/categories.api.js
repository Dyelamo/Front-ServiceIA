import { api } from "../../../core/api/client";
import { extractList } from "../../../core/api/response";
import { mapCategoriesFromApi } from "../mappers/category.mapper";

export const fetchCategories = async () => {
  const { data } = await api.get("/categorias");
  return mapCategoriesFromApi(extractList(data));
};
