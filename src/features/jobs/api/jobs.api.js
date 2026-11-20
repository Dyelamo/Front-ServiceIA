import { api } from "../../../core/api/client";

/**
 * Obtiene los trabajos asignados al prestador autenticado ('activos' o 'completados')
 */
export const fetchProviderJobs = async (tipo = "activos") => {
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
