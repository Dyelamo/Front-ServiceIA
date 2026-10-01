import { api } from "../../../core/api/client";

import { getUserId } from "../../../core/storage/auth.storage";

import { mapOffersFromApi } from "../mappers/offer.mapper";
import { mapRequestFromApi } from "../../requests/mappers/request.mapper";
import { fetchPublicationById } from "../../requests/api/requests.api";
const getList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.results || data?.items || data?.data || [];
};

export const fetchClientOffers = async () => {
  const { data } = await api.get("/publicaciones/");

  return getList(data);
};

export const createProfessionalOffer = async ({
  publicationId,
  price,
  availability,
  message,
}) => {
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
};

export const fetchProfessionalOffers = async () => {
  const { data } = await api.get("/postulaciones", {
    params: {
      limit: 20,
      offset: 0,
    },
  });

  return mapOffersFromApi(getList(data));
};

export const fetchProfessionalOffersWithPublications =
  async () => {
    const { data } = await api.get(
      "/postulaciones",
      {
        params: {
          limit: 20,
          offset: 0,
        },
      }
    );

    const offers =
      mapOffersFromApi(
        getList(data)
      );

    const publicationCache =
      new Map();

    const enrichedOffers =
      await Promise.all(
        offers.map(async (offer) => {
          try {
            let publication =
              publicationCache.get(
                offer.publicationId
              );

            if (!publication) {
              const rawPublication =
                await fetchPublicationById(
                  offer.publicationId
                );

              publication =
                mapRequestFromApi(
                  rawPublication
                );

              publicationCache.set(
                offer.publicationId,
                publication
              );
            }

            return {
              ...offer,
              publication,
            };
          } catch (error) {
            console.error(
              "Error obteniendo publicación de la oferta:",
              error
            );

            return {
              ...offer,
              publication: null,
            };
          }
        })
      );

    return enrichedOffers;
  };
