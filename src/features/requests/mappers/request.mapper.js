import { categories } from "../data/categories";
import { PUBLICATION_STATUS_LABELS } from "../../../core/domain/statuses";
import { resolveCategoryIcon } from "../../catalog/utils/category-presentation";

const URGENCY_LABELS = {
  ahora: "Lo antes posible",
  hoy: "Hoy",
  "esta semana": "Esta semana",
  "no tengo prisa": "No tengo prisa",
};

const findCategory = (categoryId) => {
  return categories.find((category) => category.id === categoryId);
};

export const mapRequestFromApi = (request) => {
  if (!request) {
    return null;
  }

  const category = request.categoria || findCategory(request.categoria_id);
  const categoryName = category?.nombre || category?.name || "Servicio";

  const direccion = request.direccion || "";
  const barrio = request.barrio || "";
  const formattedLocation =
    [barrio, direccion].filter(Boolean).join(", ") || request.ciudad || "Valledupar";

  return {
    id: request.id,
    userId: request.usuario_id,
    user: request.usuario,
    categoryId: request.categoria_id,
    categoryName,
    categoryIcon: resolveCategoryIcon(request.categoria_id || category?.id, categoryName),
    description: request.descripcion || "",
    urgency: request.urgencia,
    urgencyLabel: URGENCY_LABELS[request.urgencia] || request.urgencia || "No especificada",
    status: request.estado,
    statusLabel: PUBLICATION_STATUS_LABELS[request.estado] || request.estado || "Publicada",
    direccion: direccion,
    barrio: barrio,
    referencia: request.referencia || "",
    ciudad: request.ciudad || "Valledupar",
    latitud: request.latitud ?? null,
    longitud: request.longitud ?? null,
    distanceKm: request.distancia_km ?? null,
    providerHasPoint: request.prestador_tiene_punto,
    requestHasPoint: request.solicitud_tiene_punto,
    location: formattedLocation,
    haSidoCalificada: Boolean(request.ha_sido_calificada),
    ha_sido_calificada: Boolean(request.ha_sido_calificada),
    createdAt: request.created_at,
    updatedAt: request.updated_at,
    // Compatibilidad tanto con camelCase como snake_case
    categoria_id: request.categoria_id,
    categoria: request.categoria,
    descripcion: request.descripcion || "",
    urgencia: request.urgencia,
    estado: request.estado,
    created_at: request.created_at,
    updated_at: request.updated_at,
    usuario_id: request.usuario_id,
  };
};

export const mapRequestsFromApi = (requests = []) => {
  if (!Array.isArray(requests)) {
    return [];
  }

  return requests.map(mapRequestFromApi).filter(Boolean);
};
