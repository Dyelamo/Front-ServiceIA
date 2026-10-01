import {
  categories,
} from "../data/categories";

const URGENCY_LABELS = {
  ahora: "Lo antes posible",
  hoy: "Hoy",
  "esta semana": "Esta semana",
  "no tengo prisa": "No tengo prisa",
};

const STATUS_LABELS = {
  activo: "Activa",
  publicada: "Publicada",

  cancelado: "Cancelada",
  cancelada: "Cancelada",

  completado: "Completada",
  completada: "Completada",
};

const findCategory = (
  categoryId
) => {
  return categories.find(
    (category) =>
      category.id === categoryId
  );
};

export const mapRequestFromApi = (
  request
) => {
  if (!request) {
    return null;
  }

  const category =
    findCategory(
      request.categoria_id
    );

  return {
    id: request.id,

    userId:
      request.usuario_id,

    categoryId:
      request.categoria_id,

    categoryName:
      category?.name ||
      "Servicio",

    categoryIcon:
      category?.icon ||
      "construct-outline",

    description:
      request.descripcion ||
      "",

    urgency:
      request.urgencia,

    urgencyLabel:
      URGENCY_LABELS[
        request.urgencia
      ] ||
      request.urgencia ||
      "No especificada",

    status:
      request.estado,

    statusLabel:
      STATUS_LABELS[
        request.estado
      ] ||
      request.estado ||
      "Publicada",

    createdAt:
      request.created_at,

    updatedAt:
      request.updated_at,
  };
};

export const mapRequestsFromApi = (
  requests = []
) => {
  if (!Array.isArray(requests)) {
    return [];
  }

  return requests
    .map(mapRequestFromApi)
    .filter(Boolean);
};