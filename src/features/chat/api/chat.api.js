import { api } from "../../../core/api/client";
import { extractList } from "../../../core/api/response";

export const fetchConversationMessages = async (conversationId) => {
  const { data } = await api.get(`/chat/conversacion/${encodeURIComponent(conversationId)}`);

  return extractList(data);
};

export const createChatWebSocketUrl = (token) => {
  const configuredBaseUrl = api.defaults.baseURL || "";
  let baseUrl = configuredBaseUrl;

  if (!/^https?:\/\//i.test(baseUrl)) {
    if (typeof window === "undefined" || !window.location?.origin) {
      throw new Error("Configura EXPO_PUBLIC_API_URL con una URL absoluta para conectar el chat.");
    }

    baseUrl = new URL(baseUrl, window.location.origin).toString();
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const socketBaseUrl = normalizedBaseUrl.replace(/^http/i, "ws");

  return `${socketBaseUrl}/chat/ws?token=${encodeURIComponent(token)}`;
};
