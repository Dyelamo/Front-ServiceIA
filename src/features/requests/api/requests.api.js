import { api } from "../../../core/api/client";

import { extractList } from "../../../core/api/response";

import {
  mapRequestsFromApi,
} from "../mappers/request.mapper";

export const fetchClientPublications =
  async () => {
    const { data } = await api.get(
      "/publicaciones/mis-publicaciones"
    );

    return mapRequestsFromApi(
      extractList(data)
    );
  };

export const fetchProfessionalPublications =
  async () => {
    const { data } = await api.get(
      "/publicaciones/categorias-prestador"
    );

    return extractList(data);
  };

export const fetchPublicationById =
  async (publicationId) => {
    const { data } = await api.get(
      `/publicaciones/${publicationId}`
    );

    return data;
  };

export const createServiceRequest =
  async ({
    description,
    categoryId,
    urgency,
  }) => {
    const { data } = await api.post(
      "/publicaciones",
      {
        descripcion: description,
        categoria_id: categoryId,
        urgencia: urgency,
      }
    );

    return data;
  };