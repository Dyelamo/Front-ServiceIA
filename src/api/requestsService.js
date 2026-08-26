// src/api/requestsService.js
// Capa de servicio para solicitudes de servicio. Hoy simula la llamada;
// cuando tengas backend, reemplaza el cuerpo de cada función por `api.post/get(...)`.
// src/api/requestsService.js
import api from "./client";
import { getUserId } from "../features/services/auth.storage";

export async function createServiceRequest(payload) {
  const body = {
    descripcion: payload.description,
    categoria_id: payload.categoryId,
    urgencia: payload.urgencyLabel,
  };

  try {
    const { data } = await api.post("/publicaciones", body);
    return {
      description: payload.description,
      category: payload.categoryLabel,
      serviceType: "Servicio general",
      urgency: payload.urgencyLabel,
      presentialVisit: true,
      location: payload.location,
      followUpQuestions: [
        "¿Cuándo notaste el problema por primera vez?",
        "¿Tienes fotos adicionales del área afectada?",
      ],
    };
  } catch (error) {
    console.error("Error al crear la solicitud de servicio:", error);
    throw error;
  }
}

export async function fetchNewRequests() {
  // return api.get('/professional/requests').then((res) => res.data);
  return [];
}

function getList(data) {
  if (Array.isArray(data)) return data;
  return data?.results || data?.items || data?.data || [];
}

export async function fetchClientPublications() {
  const { data } = await api.get("/publicaciones");
  return getList(data);
}

export async function fetchClientOffers() {
  const { data } = await api.get("/publicaciones/");
  return getList(data);
}
export async function fetchProfessionalPublications() {
  const { data } = await api.get("/publicaciones/categorias-prestador");
  return getList(data);
}

export async function createProfessionalOffer({
  publicationId,
  price,
  availability,
  message,
}) {
  const prestadorId = await getUserId();
  if (!prestadorId) {
    throw new Error("No hay un profesional autenticado");
  }

  const { data } = await api.post("/postulaciones", {
    publicacion_id: publicationId,
    prestador_id: prestadorId,
    precio_ofertado: Number(price),
    disponibilidad: availability,
    mensaje: message,
  });

  return data;
}

export async function fetchProfessionalOffers() {
  const prestadorId = await getUserId();
  if (!prestadorId) return [];

  const { data } = await api.get("/postulaciones", {
    params: {
      prestador_id: prestadorId,
      limit: 20,
      offset: 0,
    },
  });
  return getList(data);
}

export default {
  createServiceRequest,
  fetchNewRequests,
  fetchClientPublications,
  fetchClientOffers,
  fetchProfessionalPublications,
  createProfessionalOffer,
  fetchProfessionalOffers,
};
