import { api } from "../../../core/api/client";

import { extractList } from "../../../core/api/response";

import { mapOffersFromApi } from "../mappers/offer.mapper";

import { mapRequestFromApi } from "../../requests/mappers/request.mapper";

import { fetchPublicationById } from "../../requests/api/requests.api";
import { syncProviderCurrentLocation } from "../../location/provider-location";

export const createProfessionalOffer = async ({ publicationId, price, availability, message }) => {
  const { data } = await api.post("/postulaciones", {
    publicacion_id: publicationId,
    precio_ofertado: Number(price),

    disponibilidad: availability,

    mensaje: message,
  });

  return data;
};

export const withdrawProfessionalOffer = async (offerId) => {
  const { data } = await api.patch(`/postulaciones/${offerId}/retirar`);

  return data;
};

export const fetchProfessionalOffersWithPublications = async () => {
  await syncProviderCurrentLocation().catch(() => null);
  const { data } = await api.get("/postulaciones", {
    params: {
      limit: 20,
      offset: 0,
    },
  });

  const offers = mapOffersFromApi(extractList(data));

  const publicationCache = new Map();

  const enrichedOffers = await Promise.all(
    offers.map(async (offer) => {
      try {
        let publication = publicationCache.get(offer.publicationId);

        if (!publication) {
          const rawPublication = await fetchPublicationById(offer.publicationId);

          publication = mapRequestFromApi(rawPublication);

          publicationCache.set(offer.publicationId, publication);
        }

        return {
          ...offer,
          publication,
        };
      } catch (error) {
        console.error("Error obteniendo publicación de la oferta:", error);

        return {
          ...offer,
          publication: null,
        };
      }
    }),
  );

  return enrichedOffers;
};

export const fetchOffersForPublication = async (publicationId) => {
  const { data } = await api.get("/postulaciones", {
    params: {
      publicacion_id: publicationId,
      limit: 100,
      offset: 0,
      incluir_prestador: true,
    },
  });

  return mapOffersFromApi(extractList(data));
};

export const acceptOffer = async (offerId) => {
  const { data } = await api.patch(`/postulaciones/${offerId}/estado`, { estado: "aceptada" });

  return data;
};
