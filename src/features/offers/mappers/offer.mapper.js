import { OFFER_STATUS_LABELS } from "../../../core/domain/statuses";

export const mapOfferFromApi = (offer) => {
  if (!offer) {
    return null;
  }

  const rawProvider = offer.prestador || offer.profesional || offer.provider || null;

  const providerUser = rawProvider?.usuario || null;
  const providerName =
    rawProvider?.nombre_completo ||
    providerUser?.nombre_completo ||
    rawProvider?.nombre ||
    "Profesional";

  return {
    id: offer.id,

    publicationId: offer.publicacion_id,
    distanceKm: offer.distancia_km ?? null,

    providerId: offer.prestador_id,

    conversationId:
      offer.id_conversacion ||
      offer.conversacion_id ||
      offer.conversacion?.id_conversacion ||
      offer.conversation_id ||
      null,

    provider: rawProvider
      ? {
          ...rawProvider,
          nombre_completo: providerName,
          telefono: rawProvider?.telefono || providerUser?.telefono || "",
          foto_perfil: rawProvider?.foto_perfil || providerUser?.foto_perfil || null,
        }
      : null,

    providerBusy: Boolean(rawProvider?.ocupado || rawProvider?.disponible === false),

    price: Number(offer.precio_ofertado || 0),

    availability: offer.disponibilidad || "No especificada",

    message: offer.mensaje || "",

    status: offer.estado || "pendiente",

    statusLabel:
      offer.estado === "en_espera" || rawProvider?.ocupado || rawProvider?.disponible === false
        ? "Profesional ocupado"
        : OFFER_STATUS_LABELS[offer.estado] || offer.estado || "Pendiente",

    createdAt: offer.created_at,

    updatedAt: offer.updated_at,

    publicacion_id: offer.publicacion_id,
    prestador_id: offer.prestador_id,
    precio_ofertado: offer.precio_ofertado,
    disponibilidad: offer.disponibilidad,
    mensaje: offer.mensaje,
    estado: offer.estado,
    created_at: offer.created_at,
    updated_at: offer.updated_at,
  };
};

export const mapOffersFromApi = (offers = []) => {
  if (!Array.isArray(offers)) {
    return [];
  }

  return offers.map(mapOfferFromApi).filter(Boolean);
};
