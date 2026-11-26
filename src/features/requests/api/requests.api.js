import { api } from "../../../core/api/client";
import { extractList } from "../../../core/api/response";
import { mapRequestFromApi, mapRequestsFromApi } from "../mappers/request.mapper";
import { getReferenceImage } from "../utils/requestImages";
import { syncProviderCurrentLocation } from "../../location/provider-location";

function needsImageHydration(rawItem) {
  if (!rawItem?.id) {
    return false;
  }

  if (getReferenceImage(rawItem)) {
    return false;
  }

  if (!Array.isArray(rawItem.imagenes)) {
    return true;
  }

  return rawItem.imagenes.length > 0;
}

async function hydratePublicationsImages(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return [];
  }

  return Promise.all(
    rawItems.map(async (item) => {
      if (!needsImageHydration(item)) {
        return item;
      }

      try {
        const { data } = await api.get(`/publicaciones/${item.id}`);
        if (data && Array.isArray(data.imagenes)) {
          return {
            ...item,
            imagenes: data.imagenes,
          };
        }
      } catch {
        // Si falla la hidratación de una card puntual, mantenemos los datos base
      }

      return item;
    }),
  );
}

export const fetchClientPublications = async () => {
  const { data } = await api.get("/publicaciones/mis-publicaciones");
  const rawList = extractList(data);
  const hydratedList = await hydratePublicationsImages(rawList);
  return mapRequestsFromApi(hydratedList);
};

export const fetchProfessionalPublications = async (barrio = null) => {
  await syncProviderCurrentLocation().catch(() => null);
  const params = {};
  if (barrio) params.barrio = barrio;
  const { data } = await api.get("/publicaciones/categorias-prestador", { params });
  const rawList = extractList(data);
  const hydratedList = await hydratePublicationsImages(rawList);
  return mapRequestsFromApi(hydratedList);
};

export const fetchPublicationById = async (publicationId) => {
  const { data } = await api.get(`/publicaciones/${publicationId}`);
  return mapRequestFromApi(data);
};

export const updatePublicationLocation = async (id, location) => {
  const { data } = await api.put(`/publicaciones/${id}`, location);
  return mapRequestFromApi(data);
};

export const createServiceRequest = async ({
  description,
  categoryId,
  urgency,
  address,
  barrio,
  reference,
  city = "Valledupar",
  latitud = null,
  longitud = null,
  photos = [],
}) => {
  const { data } = await api.post("/publicaciones", {
    descripcion: description,
    categoria_id: categoryId,
    urgencia: urgency,
    direccion: address || "Valledupar, Cesar",
    barrio: barrio || "Valledupar",
    referencia: reference || "",
    ciudad: city || "Valledupar",
    latitud,
    longitud,
  });

  if (photos.length > 0) {
    const form = new FormData();

    for (const photo of photos) {
      if (typeof window !== "undefined") {
        const blob = await fetch(photo.uri).then((response) => response.blob());
        form.append("files", blob, photo.name || "foto.jpg");
      } else {
        form.append("files", {
          uri: photo.uri,
          name: photo.name || "foto.jpg",
          type: photo.mimeType || "image/jpeg",
        });
      }
    }

    try {
      const uploadResponse = await api.post(`/publicaciones/${data.id}/imagenes`, form, {
        timeout: 60000,
      });
      return mapRequestFromApi(uploadResponse.data);
    } catch (error) {
      await api.delete(`/publicaciones/${data.id}`).catch(() => null);
      throw error;
    }
  }

  return mapRequestFromApi(data);
};

export const startServiceRequest = async (publicationId) => {
  const { data } = await api.patch(`/publicaciones/${publicationId}/iniciar`);
  return mapRequestFromApi(data);
};

export const completeServiceRequest = async (publicationId) => {
  const { data } = await api.patch(`/publicaciones/${publicationId}/confirmar-finalizacion`);
  return mapRequestFromApi(data);
};

export const cancelServiceRequest = async ({ publicationId, reason }) => {
  const { data } = await api.patch(`/publicaciones/${publicationId}/cancelar`, {
    motivo: reason,
  });
  return mapRequestFromApi(data);
};
