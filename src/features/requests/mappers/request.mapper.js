import { categories } from "../data/categories";

const URGENCY_LABELS = {
  ahora: "Lo antes posible",
  hoy: "Hoy",
  "esta semana": "Esta semana",
  "no tengo prisa": "No tengo prisa",
};

const STATUS_LABELS = {
  activo: "Activa",
  publicada: "Publicada",
  con_ofertas: "Con ofertas",
  acuerdo: "Acuerdo alcanzado",
  en_progreso: "En progreso",
  terminado: "Completado",
  completado: "Completada",
  completada: "Completada",
  cancelado: "Cancelada",
  cancelada: "Cancelada",
};

const findCategory = (categoryId) => {
  return categories.find((category) => category.id === categoryId);
};

export const mapRequestFromApi = (request) => {
  if (!request) {
    return null;
  }

  const category = request.categoria || findCategory(request.categoria_id);

  const direccion = request.direccion || "Valledupar, Cesar";
  const barrio = request.barrio || "Valledupar";
  const formattedLocation = barrio !== "Valledupar" ? `${barrio}, ${direccion}` : direccion;

  return {
    id: request.id,
    userId: request.usuario_id,
    user: request.usuario,
    categoryId: request.categoria_id,
    categoryName: category?.nombre || category?.name || "Servicio",
    categoryIcon: category?.icono || category?.icon || "construct-outline",
    description: request.descripcion || "",
    urgency: request.urgencia,
    urgencyLabel: URGENCY_LABELS[request.urgencia] || request.urgencia || "No especificada",
    status: request.estado,
    statusLabel: STATUS_LABELS[request.estado] || request.estado || "Publicada",
    direccion: direccion,
    barrio: barrio,
    referencia: request.referencia || "",
    ciudad: request.ciudad || "Valledupar",
    latitud: request.latitud ?? null,
    longitud: request.longitud ?? null,
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
