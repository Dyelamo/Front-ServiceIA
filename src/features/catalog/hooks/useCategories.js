import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../core/query/query-keys";
import { categories as fallbackCategories } from "../../requests/data/categories";
import { fetchCategories } from "../api/categories.api";

export function useCategories() {
  const query = useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000,
  });

  return {
    ...query,
    categories: query.data?.length ? query.data : fallbackCategories,
    usingFallback: query.isError || !query.data?.length,
  };
}
