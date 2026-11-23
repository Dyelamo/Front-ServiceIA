import { fetchConversation } from "../../chat/api/chat.api";
import { fetchPublicationById } from "../../requests/api/requests.api";

async function openPublication(navigation, publicationId, mode, extraParams = {}) {
  if (!publicationId) throw new Error("La notificación no incluye una publicación.");
  const request = await fetchPublicationById(publicationId);
  navigation.navigate(mode === "profesional" ? "ProfessionalRequestDetail" : "RequestDetail", {
    request,
    ...extraParams,
  });
}

export async function openNotificationDestination({ notification, mode, navigation }) {
  const data = notification?.data || {};
  const destination = data.destination;
  const publicationId = data.publication_id || notification?.referencia_id;

  switch (destination) {
    case "publication_offers":
      await openPublication(navigation, publicationId, "cliente", {
        focusSection: "offers",
        offerId: data.offer_id,
      });
      return true;
    case "chat": {
      if (!data.conversation_id) throw new Error("La conversación no está disponible.");
      const conversation = await fetchConversation(data.conversation_id, mode);
      navigation.navigate("Chat", {
        conversationId: conversation.id,
        partnerId: conversation.partner?.id,
        partnerName: conversation.partner?.nombre_completo || "Conversación",
        publicationTitle: conversation.publication?.descripcion,
      });
      return true;
    }
    case "job_detail":
      if (mode === "profesional") {
        navigation.navigate("ProfessionalTabs", {
          screen: "Jobs",
          params: { publicationId },
        });
      } else {
        await openPublication(navigation, publicationId, mode);
      }
      return true;
    case "review":
      await openPublication(navigation, publicationId, "cliente", {
        focusSection: "review",
        providerId: data.provider_id,
      });
      return true;
    case "reviews":
      navigation.navigate("ProfessionalTabs", {
        screen: "ProfessionalProfile",
        params: { focusSection: "reviews" },
      });
      return true;
    default:
      if (publicationId) {
        await openPublication(navigation, publicationId, mode);
        return true;
      }
      return false;
  }
}
