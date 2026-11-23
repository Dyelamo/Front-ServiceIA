import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../core/query/query-keys";
import { useAppMode } from "../../app-mode/hooks/useAppMode";
import { getMyProfessionalProfileApi } from "../api/professional.api";

export function useProfessionalAvailability() {
  const { professionalProfile, setProfessionalProfile } = useAppMode();
  const query = useQuery({
    queryKey: queryKeys.professionalProfile,
    queryFn: getMyProfessionalProfileApi,
    initialData: professionalProfile || undefined,
    staleTime: 30_000,
    refetchOnMount: "always",
    refetchInterval: 15_000,
  });

  useEffect(() => {
    if (query.data) {
      setProfessionalProfile(query.data);
    }
  }, [query.data, setProfessionalProfile]);

  return {
    ...query,
    isAvailable: query.data?.disponible !== false,
  };
}

export default useProfessionalAvailability;
