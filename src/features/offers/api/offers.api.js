import { api } from "../../../core/api/client";

import {
  getUserId,
} from "../../../core/storage/auth.storage";

const getList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  return (
    data?.results ||
    data?.items ||
    data?.data ||
    []
  );
};

export const fetchClientOffers =
  async () => {
    const { data } = await api.get(
      "/publicaciones/"
    );

    return getList(data);
  };

export const createProfessionalOffer =
  async ({
    publicationId,
    price,
    availability,
    message,
  }) => {
    const prestadorId =
      await getUserId();

    if (!prestadorId) {
      throw new Error(
        "No hay un profesional autenticado"
      );
    }

    const { data } = await api.post(
      "/postulaciones",
      {
        publicacion_id:
          publicationId,

        prestador_id:
          prestadorId,

        precio_ofertado:
          Number(price),

        disponibilidad:
          availability,

        mensaje:
          message,
      }
    );

    return data;
  };

export const fetchProfessionalOffers =
  async () => {
    const prestadorId =
      await getUserId();

    if (!prestadorId) {
      return [];
    }

    const { data } = await api.get(
      "/postulaciones",
      {
        params: {
          limit: 20,
          offset: 0,
        },
      }
    );

    return getList(data);
  };