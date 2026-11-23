import { api } from "../../../core/api/client";
import { extractList } from "../../../core/api/response";
import {
  mapChatMessageFromApi,
  mapConversationFromApi,
  mapConversationsFromApi,
} from "../mappers/conversation.mapper";

export const fetchConversations = async ({ role, status } = {}) => {
  const { data } = await api.get("/conversaciones", {
    params: { rol: role, ...(status ? { estado: status } : {}), limit: 100, offset: 0 },
  });
  return mapConversationsFromApi(extractList(data));
};

export const fetchConversation = async (conversationId, role) => {
  const { data } = await api.get(`/conversaciones/${encodeURIComponent(conversationId)}`, {
    params: { rol: role },
  });
  return mapConversationFromApi(data);
};

export const fetchConversationMessages = async (conversationId, role) => {
  const { data } = await api.get(`/conversaciones/${encodeURIComponent(conversationId)}/mensajes`, {
    params: { rol: role },
  });
  return extractList(data).map((message, index) =>
    mapChatMessageFromApi(message, `history-${index}`),
  );
};

export const createChatWebSocketUrl = (token, role) => {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL || api.defaults.baseURL || "";
  let baseUrl = configuredBaseUrl;

  if (!/^https?:\/\//i.test(baseUrl)) {
    if (typeof window === "undefined" || !window.location?.origin) {
      throw new Error("Configura EXPO_PUBLIC_API_URL con una URL absoluta para conectar el chat.");
    }

    baseUrl = new URL(baseUrl, window.location.origin).toString();
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const socketBaseUrl = normalizedBaseUrl.replace(/^http/i, "ws");

  return `${socketBaseUrl}/chat/ws?token=${encodeURIComponent(token)}&rol=${encodeURIComponent(role)}`;
};
