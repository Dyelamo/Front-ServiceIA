export const mapConversationFromApi = (conversation) => {
  if (!conversation) return null;

  return {
    id: conversation.id_conversacion,
    offerId: conversation.id_postulacion,
    status: conversation.estado || "activa",
    createdAt: conversation.created_at || null,
    closedAt: conversation.closed_at || null,
    deleteAfter: conversation.delete_after || null,
    publication: conversation.publication || null,
    offer: conversation.offer
      ? {
          ...conversation.offer,
          price: Number(conversation.offer.precio_ofertado || 0),
        }
      : null,
    partner: conversation.partner || null,
    lastMessage: conversation.last_message
      ? {
          content: conversation.last_message.contenido || "",
          createdAt: conversation.last_message.fecha_hora || null,
        }
      : null,
    unreadCount: Number(conversation.unread_count || 0),
  };
};

export const mapConversationsFromApi = (conversations = []) =>
  Array.isArray(conversations) ? conversations.map(mapConversationFromApi).filter(Boolean) : [];

export const mapChatMessageFromApi = (message, fallbackId = "message") => ({
  id: message?.id_mensaje || message?.id || fallbackId,
  senderId: message?.id_remitente || message?.remitente_id || null,
  recipientId: message?.id_destinatario || message?.destinatario_id || null,
  conversationId: message?.id_conversacion || message?.conversacion_id || null,
  content: message?.contenido || message?.mensaje || "",
  createdAt: message?.fecha_hora || message?.created_at || null,
});
