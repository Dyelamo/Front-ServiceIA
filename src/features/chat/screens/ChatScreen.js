import React, { useContext, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../core/query/query-keys";
import { getApiErrorMessage } from "../../../core/errors/error-message";
import { getAccessToken, getUserId } from "../../../core/storage/auth.storage";
import { Button, Input } from "../../../shared/ui";
import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout";
import { colors, layout, radius, spacing } from "../../../theme";
import {
  createChatWebSocketUrl,
  fetchConversation,
  fetchConversationMessages,
} from "../api/chat.api";
import { mapChatMessageFromApi } from "../mappers/conversation.mapper";
import { AppModeContext } from "../../app-mode/context/AppModeContext";

const EMPTY_MESSAGES = [];

export default function ChatScreen({ navigation, route }) {
  const {
    conversationId,
    partnerId: routePartnerId,
    partnerName: routePartnerName = "Conversación",
    publicationTitle: routePublicationTitle,
  } = route?.params || {};
  const { mode } = useContext(AppModeContext);
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [userId, setUserId] = useState(null);
  const [socketStatus, setSocketStatus] = useState("connecting");
  const [socketError, setSocketError] = useState("");
  const [sending, setSending] = useState(false);
  const [connectionAttempt, setConnectionAttempt] = useState(0);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  const conversationQuery = useQuery({
    queryKey: queryKeys.conversation(conversationId, mode),
    queryFn: () => fetchConversation(conversationId, mode),
    enabled: Boolean(conversationId),
  });
  const messagesQuery = useQuery({
    queryKey: queryKeys.conversationMessages(conversationId, mode),
    queryFn: () => fetchConversationMessages(conversationId, mode),
    enabled: Boolean(conversationId),
  });

  const conversation = conversationQuery.data;
  const messages = messagesQuery.data || EMPTY_MESSAGES;
  const partnerId = conversation?.partner?.id || routePartnerId;
  const partnerName = conversation?.partner?.nombre_completo || routePartnerName;
  const publicationTitle = conversation?.publication?.descripcion || routePublicationTitle;
  const isClosed = conversation?.status === "cerrada";

  useEffect(() => {
    getUserId()
      .then(setUserId)
      .catch(() => setUserId(null));
  }, []);

  useEffect(() => {
    let active = true;
    let socket;

    const connect = async () => {
      if (!conversationId || !partnerId || conversationQuery.isLoading) return;
      if (isClosed) {
        setSocketStatus("closed");
        return;
      }

      setSocketStatus("connecting");
      try {
        const token = await getAccessToken();
        if (!active) return;
        if (!token) throw new Error("No hay una sesión activa para conectar el chat.");

        socket = new WebSocket(createChatWebSocketUrl(token, mode));
        socketRef.current = socket;
        socket.onopen = () => {
          if (active) {
            setSocketStatus("connected");
            setSocketError("");
          }
        };
        socket.onmessage = (event) => {
          if (!active) return;
          const result = parseSocketEvent(event.data);
          if (result.error) {
            setSocketError(result.error);
            return;
          }
          if (!result.message) return;
          if (
            result.message.conversationId &&
            String(result.message.conversationId) !== String(conversationId)
          ) {
            return;
          }
          queryClient.setQueryData(
            queryKeys.conversationMessages(conversationId, mode),
            (current = []) => appendUniqueMessage(current, result.message),
          );
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations(mode, "all") });
        };
        socket.onerror = () => {
          if (active) {
            setSocketStatus("error");
            setSocketError("No pudimos conectar con el chat.");
          }
        };
        socket.onclose = () => {
          if (active) setSocketStatus("disconnected");
        };
      } catch (error) {
        if (active) {
          setSocketStatus("error");
          setSocketError(error?.message || "No pudimos conectar con el chat.");
        }
      }
    };

    connect();
    return () => {
      active = false;
      socket?.close();
      socketRef.current = null;
    };
  }, [
    connectionAttempt,
    conversationId,
    conversationQuery.isLoading,
    isClosed,
    mode,
    partnerId,
    queryClient,
  ]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    const content = draft.trim();
    const socket = socketRef.current;
    if (!content || isClosed || !socket || socket.readyState !== WebSocket.OPEN) return;

    setSending(true);
    try {
      socket.send(
        JSON.stringify({
          destino: partnerId,
          mensaje: content,
          id_conversacion: conversationId,
          rol: mode,
        }),
      );
      setDraft("");
    } catch {
      setSocketError("No pudimos enviar el mensaje. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  if (!conversationId) {
    return <InvalidConversation navigation={navigation} />;
  }

  if (conversationQuery.isError) {
    return (
      <Screen>
        <AppHeader title="Mensajes" onBack={() => navigation.goBack()} />
        <ResponsiveContainer maxWidth={layout.content.medium} style={styles.invalid}>
          <Text style={styles.errorText}>
            {getApiErrorMessage(conversationQuery.error, "No pudimos cargar esta conversación.")}
          </Text>
          <Button variant="outline" onPress={conversationQuery.refetch} style={styles.retryButton}>
            Reintentar
          </Button>
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={colors.background}>
      <AppHeader
        title={partnerName}
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
      />
      <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
        {publicationTitle ? <Text style={styles.publicationTitle}>{publicationTitle}</Text> : null}

        {isClosed ? (
          <View style={styles.closedNotice}>
            <Ionicons name="lock-closed-outline" size={18} color="#9A3412" />
            <Text style={styles.closedNoticeText}>
              Esta conversación finalizó y ahora es de solo lectura.
              {conversation?.deleteAfter
                ? ` Se conservará hasta el ${formatFullDate(conversation.deleteAfter)}.`
                : ""}
            </Text>
          </View>
        ) : (
          <View style={styles.connection}>
            <View
              style={[styles.connectionDot, socketStatus === "connected" && styles.connectedDot]}
            />
            <Text style={styles.connectionText}>
              {socketStatus === "connected"
                ? "Conectado"
                : socketStatus === "connecting"
                  ? "Conectando..."
                  : "Desconectado"}
            </Text>
          </View>
        )}

        {messagesQuery.isError || socketError ? (
          <View style={styles.errorRow}>
            <Text style={styles.errorText}>
              {socketError ||
                getApiErrorMessage(messagesQuery.error, "No pudimos cargar el historial.")}
            </Text>
            {!isClosed && socketStatus !== "connected" ? (
              <Button
                size="sm"
                variant="outline"
                fullWidth={false}
                onPress={() => {
                  setSocketError("");
                  setConnectionAttempt((current) => current + 1);
                }}>
                Reconectar
              </Button>
            ) : null}
          </View>
        ) : null}

        <KeyboardAvoidingView
          style={styles.chat}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.messageList}
            keyboardShouldPersistTaps="handled">
            {messagesQuery.isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : messages.length === 0 ? (
              <Text style={styles.emptyText}>
                {isClosed ? "Esta conversación no tiene mensajes." : "Aún no hay mensajes."}
              </Text>
            ) : (
              messages.map((message) => {
                const ownMessage = String(message.senderId) === String(userId);
                return (
                  <View
                    key={message.id}
                    style={[
                      styles.messageBubble,
                      ownMessage ? styles.ownMessage : styles.partnerMessage,
                    ]}>
                    <Text style={[styles.messageText, ownMessage && styles.ownMessageText]}>
                      {message.content}
                    </Text>
                    <Text style={[styles.messageTime, ownMessage && styles.ownMessageTime]}>
                      {formatTime(message.createdAt)}
                    </Text>
                  </View>
                );
              })
            )}
          </ScrollView>

          {!isClosed ? (
            <View style={styles.composer}>
              <Input
                value={draft}
                onChangeText={setDraft}
                placeholder="Escribe un mensaje..."
                accessibilityLabel="Escribe un mensaje"
                containerStyle={styles.input}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                maxLength={1000}
              />
              <Button
                onPress={sendMessage}
                disabled={socketStatus !== "connected" || !draft.trim() || sending}
                fullWidth={false}
                accessibilityLabel="Enviar mensaje"
                style={styles.sendButton}
                leftIcon={<Ionicons name="send" size={18} color="#FFFFFF" />}>
                Enviar
              </Button>
            </View>
          ) : null}
        </KeyboardAvoidingView>
      </ResponsiveContainer>
    </Screen>
  );
}

function InvalidConversation({ navigation }) {
  return (
    <Screen>
      <AppHeader title="Mensajes" onBack={() => navigation.goBack()} />
      <ResponsiveContainer maxWidth={layout.content.medium} style={styles.invalid}>
        <Text style={styles.errorText}>No encontramos los datos de esta conversación.</Text>
      </ResponsiveContainer>
    </Screen>
  );
}

function parseSocketEvent(rawEvent) {
  try {
    const event = JSON.parse(rawEvent);
    if (event?.type === "error")
      return { error: event.detail || "No pudimos procesar el mensaje." };
    const rawMessage = event?.message || event;
    return { message: mapChatMessageFromApi(rawMessage, `incoming-${Date.now()}`) };
  } catch {
    return { error: "El servidor envió una respuesta de chat no válida." };
  }
}

function appendUniqueMessage(messages, nextMessage) {
  if (!nextMessage?.content) return messages;
  return messages.some((message) => String(message.id) === String(nextMessage.id))
    ? messages
    : [...messages, nextMessage];
}

function formatTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

function formatFullDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "la fecha indicada"
    : date.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

const styles = StyleSheet.create({
  invalid: { paddingVertical: spacing.xxl },
  retryButton: { marginTop: spacing.lg },
  container: { flex: 1, minHeight: 0, paddingTop: spacing.md, paddingBottom: spacing.md },
  publicationTitle: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.sm },
  connection: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
    marginRight: spacing.xs,
  },
  connectedDot: { backgroundColor: "#16A34A" },
  connectionText: { color: colors.textSecondary, fontSize: 12 },
  closedNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#FFF7ED",
  },
  closedNoticeText: {
    flex: 1,
    color: "#9A3412",
    fontSize: 13,
    lineHeight: 19,
    marginLeft: spacing.sm,
  },
  chat: {
    flex: 1,
    minHeight: 300,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  messageList: { flexGrow: 1, justifyContent: "flex-end", padding: spacing.lg },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginVertical: spacing.xl,
  },
  messageBubble: {
    maxWidth: "82%",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  ownMessage: { alignSelf: "flex-end", backgroundColor: colors.primary },
  partnerMessage: { alignSelf: "flex-start", backgroundColor: colors.surfaceSecondary },
  messageText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  ownMessageText: { color: "#FFFFFF" },
  messageTime: { color: colors.textMuted, fontSize: 10, textAlign: "right", marginTop: 4 },
  ownMessageTime: { color: "#DBEAFE" },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: { flex: 1 },
  sendButton: { marginBottom: 0 },
  errorText: { flex: 1, color: colors.error, fontSize: 13, lineHeight: 19 },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
});
