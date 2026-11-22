import { api } from "../../../core/api/client";
import { extractList } from "../../../core/api/response";

export const fetchConversationMessages = async (conversationId) => {
  const { data } = await api.get(
    `/chat/conversacion/${encodeURIComponent(conversationId)}`,
  );

  return extractList(data);
};

export const createChatWebSocketUrl = (token) => {
  const configuredBaseUrl =
    api.defaults.baseURL ||
    process.env.EXPO_PUBLIC_API_URL ||
    "http://localhost:8000";
  let baseUrl = configuredBaseUrl;

  if (!/^https?:\/\//i.test(baseUrl)) {
    if (typeof window !== "undefined" && window.location?.origin) {
      baseUrl = new URL(baseUrl, window.location.origin).toString();
    } else {
      baseUrl = "http://localhost:8000";
    }
  }

  // Si estamos en un navegador y accedemos por IP de red, ajustar localhost
  if (
    typeof window !== "undefined" &&
    window.location?.hostname &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    baseUrl.includes("localhost")
  ) {
    baseUrl = baseUrl.replace("localhost", window.location.hostname);
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const socketBaseUrl = normalizedBaseUrl.replace(/^http/i, "ws");

  return `${socketBaseUrl}/chat/ws?token=${encodeURIComponent(token)}`;
};

export const fetchUnreadChatCount = async () => {
  try {
    const { data } = await api.get("/chat/no-leidos");
    return Number(data?.no_leidos || 0);
  } catch {
    return 0;
  }
};

export const markChatMessagesAsRead = async (conversationId) => {
  try {
    const url = conversationId
      ? `/chat/marcar-leidos?conversacion_id=${encodeURIComponent(conversationId)}`
      : "/chat/marcar-leidos";
    await api.patch(url);
  } catch {
    // ignore
  }
};
