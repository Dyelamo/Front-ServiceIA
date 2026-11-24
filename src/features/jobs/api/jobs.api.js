import { api } from "../../../core/api/client";
import { syncProviderCurrentLocation } from "../../location/provider-location";

/**
 * Obtiene los trabajos asignados al prestador autenticado ('activos' o 'completados')
 */
export const fetchProviderJobs = async (tipo = "activos") => {
  await syncProviderCurrentLocation().catch(() => null);
  const { data } = await api.get("/publicaciones/trabajos", {
    params: { tipo },
  });
  return Array.isArray(data) ? data : [];
};

/**
 * Inicia formalmente el trabajo ('en_progreso')
 */
export const startJob = async (publicationId) => {
  const { data } = await api.patch(`/publicaciones/${publicationId}/iniciar`);
  return data;
};

/**
 * Marca el trabajo como terminado ('terminado')
 */
export const completeJob = async (publicationId) => {
  const { data } = await api.patch(`/publicaciones/${publicationId}/completar`);
  return data;
};

export const cancelJob = async ({ publicationId, reason }) => {
  const { data } = await api.patch(`/publicaciones/${publicationId}/cancelar`, {
    motivo: reason,
  });
  return data;
};
