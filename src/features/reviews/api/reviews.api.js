import { api } from "../../../core/api/client";

/**
 * Crea una reseña obligatoria para una publicación finalizada.
 */
export const createReview = async ({ publicacionId, prestadorId, calificacion, comentario }) => {
  const { data } = await api.post("/resenas", {
    publicacion_id: publicacionId,
    prestador_id: prestadorId,
    calificacion: Number(calificacion),
    comentario: String(comentario).trim(),
  });
  return data;
};

/**
 * Consulta si el cliente autenticado tiene alguna reseña pendiente por realizar.
 */
export const fetchPendingReview = async () => {
  try {
    const { data } = await api.get("/resenas/pendiente");
    return data;
  } catch (error) {
    console.error("Error consultando reseña pendiente:", error);
    return null;
  }
};

/**
 * Obtiene el resumen de calificaciones y las opiniones de un prestador.
 */
export const fetchProviderReviews = async (prestadorId) => {
  const { data } = await api.get(`/resenas/prestador/${prestadorId}`);
  return data;
};

/**
 * Obtiene la reseña específica de una publicación.
 */
export const fetchPublicationReview = async (publicacionId) => {
  try {
    const { data } = await api.get(`/resenas/publicacion/${publicacionId}`);
    return data;
  } catch (_error) {
    return null;
  }
};
