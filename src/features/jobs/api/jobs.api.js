import { api } from "../../../core/api/client";
import { syncProviderCurrentLocation } from "../../location/provider-location";
import { getReferenceImage } from "../../requests/utils/requestImages";

async function hydrateJobImages(jobs) {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return [];
  }

  return Promise.all(
    jobs.map(async (job) => {
      const pubId = job?.publicacion_id || job?.id;
      if (!pubId || getReferenceImage(job)) {
        return job;
      }

      if (Array.isArray(job.imagenes) && job.imagenes.length === 0) {
        return job;
      }

      try {
        const { data } = await api.get(`/publicaciones/${pubId}`);
        if (data && Array.isArray(data.imagenes)) {
          return {
            ...job,
            imagenes: data.imagenes,
          };
        }
      } catch {
        // Conservamos el trabajo aunque falle la carga de imágenes
      }

      return job;
    }),
  );
}

/**
 * Obtiene los trabajos asignados al prestador autenticado ('activos' o 'completados')
 */
export const fetchProviderJobs = async (tipo = "activos") => {
  await syncProviderCurrentLocation().catch(() => null);
  const { data } = await api.get("/publicaciones/trabajos", {
    params: { tipo },
  });
  const jobs = Array.isArray(data) ? data : [];
  return hydrateJobImages(jobs);
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
