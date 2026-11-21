import { api } from "../../../core/api/client";
import { extractList } from "../../../core/api/response";
import { mapRequestFromApi, mapRequestsFromApi } from "../mappers/request.mapper";

export const fetchClientPublications = async () => {
  const { data } = await api.get("/publicaciones/mis-publicaciones");
  return mapRequestsFromApi(extractList(data));
};

export const fetchProfessionalPublications = async (barrio = null) => {
  const params = {};
  if (barrio) params.barrio = barrio;
  const { data } = await api.get("/publicaciones/categorias-prestador", { params });
  return mapRequestsFromApi(extractList(data));
};

export const fetchPublicationById = async (publicationId) => {
  const { data } = await api.get(`/publicaciones/${publicationId}`);
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

  return mapRequestFromApi(data);
};

export const startServiceRequest = async (publicationId) => {
  const { data } = await api.patch(`/publicaciones/${publicationId}/iniciar`);
  return mapRequestFromApi(data);
};

export const completeServiceRequest = async (publicationId) => {
  const { data } = await api.patch(`/publicaciones/${publicationId}/completar`);
  return mapRequestFromApi(data);
};
