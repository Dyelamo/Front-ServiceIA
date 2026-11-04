const STATUS_LABELS = {
  pendiente: "Pendiente",
  aceptada: "Aceptada",
  aceptado: "Aceptada",
  en_espera: "En espera",
  rechazada: "Rechazada",
  rechazado: "Rechazada",
  cancelada: "Cancelada",
  cancelado: "Cancelada",
};

export const mapOfferFromApi = (offer) => {
  if (!offer) {
    return null;
  }

  return {
    id: offer.id,

    publicationId:
      offer.publicacion_id,

    providerId:
      offer.prestador_id,

    conversationId:
      offer.id_conversacion ||
      offer.conversacion_id ||
      offer.conversacion?.id_conversacion ||
      offer.conversation_id ||
      null,

    provider:
      offer.prestador ||
      offer.profesional ||
      offer.provider ||
      null,

    price:
      Number(
        offer.precio_ofertado || 0
      ),

    availability:
      offer.disponibilidad ||
      "No especificada",

    message:
      offer.mensaje || "",

    status:
      offer.estado ||
      "pendiente",

    statusLabel:
      STATUS_LABELS[
        offer.estado
      ] ||
      offer.estado ||
      "Pendiente",

    createdAt:
      offer.created_at,

    updatedAt:
      offer.updated_at,
  };
};

export const mapOffersFromApi = (
  offers = []
) => {
  if (!Array.isArray(offers)) {
    return [];
  }

  return offers
    .map(mapOfferFromApi)
    .filter(Boolean);
};