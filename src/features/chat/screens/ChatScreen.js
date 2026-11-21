import React, { useEffect, useRef, useState } from "react";
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

import { getAccessToken, getUserId } from "../../../core/storage/auth.storage";
import { Button, Input } from "../../../shared/ui";
import {
  AppHeader,
  ResponsiveContainer,
  Screen,
} from "../../../shared/layout";
import { colors, layout, radius, spacing } from "../../../theme";
import {
  createChatWebSocketUrl,
  fetchConversationMessages,
} from "../api/chat.api";

export default function ChatScreen({ navigation, route }) {
  const {
    conversationId,
    partnerId,
    partnerName = "Conversación",
    publicationTitle,
  } = route?.params || {};
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [userId, setUserId] = useState(null);
  const [socketStatus, setSocketStatus] = useState("connecting");
  const [historyError, setHistoryError] = useState(false);
  const [socketError, setSocketError] = useState("");
  const [sending, setSending] = useState(false);
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    let active = true;
    let socket;

    const connect = async () => {
      if (!conversationId || !partnerId) {
        setSocketStatus("unavailable");
        return;
      }

      try {
        const [token, currentUserId] = await Promise.all([
          getAccessToken(),
          getUserId(),
        ]);
        if (!active) {
          return;
        }

        setUserId(currentUserId);

        if (!token) {
          throw new Error("No hay una sesión activa para conectar el chat.");
        }

        try {
          const loadedMessages =
            await fetchConversationMessages(conversationId);
          if (active) {
            setMessages(
              loadedMessages.map((message, index) =>
                normalizeMessage(message, index, partnerId),
              ),
            );
          }
        } catch (historyErrorValue) {
          console.error("Error cargando historial del chat:", historyErrorValue);
          if (active) {
            setHistoryError(true);
          }
        }

        socket = new WebSocket(createChatWebSocketUrl(token));
        socketRef.current = socket;
        socket.onopen = () => {
          if (active) {
            setSocketStatus("connected");
            setSocketError("");
          }
        };
        socket.onmessage = (event) => {
          if (!active) {
            return;
          }

          setMessages((currentMessages) => [
            ...currentMessages,
            normalizeIncomingMessage(event.data, partnerId),
          ]);
        };
        socket.onerror = () => {
          if (active) {
            setSocketStatus("error");
            setSocketError("No pudimos conectar con el chat.");
          }
        };
        socket.onclose = () => {
          if (active) {
            setSocketStatus("disconnected");
          }
        };
      } catch (error) {
        console.error("Error iniciando conversación:", error);
        if (active) {
          setSocketStatus("error");
          setSocketError(
            error?.response?.data?.detail ||
              error?.message ||
              "No pudimos cargar la conversación.",
          );
          if (error?.response) {
            setHistoryError(true);
          }
        }
      }
    };

    connect();

    return () => {
      active = false;
      if (socket) {
        socket.close();
      }
      socketRef.current = null;
    };
  }, [conversationId, partnerId]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    const content = draft.trim();
    const socket = socketRef.current;
    if (!content || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    setSending(true);
    try {
      socket.send(
        JSON.stringify({
          destino: partnerId,
          mensaje: content,
          id_conversacion: conversationId,
        }),
      );
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `local-${Date.now()}`,
          senderId: userId,
          content,
          createdAt: new Date().toISOString(),
        },
      ]);
      setDraft("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setSocketError("No pudimos enviar el mensaje. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  if (!conversationId || !partnerId) {
    return (
      <Screen>
        <AppHeader
          title="Mensajes"
          onBack={() => navigation.goBack()}
          maxWidth={layout.content.wide}
        />
        <ResponsiveContainer maxWidth={layout.content.medium} style={styles.invalid}>
          <Text style={styles.errorText}>
            Esta conversación no tiene los datos necesarios para abrirse.
          </Text>
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
        {publicationTitle ? (
          <Text style={styles.publicationTitle}>{publicationTitle}</Text>
        ) : null}
        <View style={styles.connection}>
          <View
            style={[
              styles.connectionDot,
              socketStatus === "connected" && styles.connectedDot,
            ]}
          />
          <Text style={styles.connectionText}>
            {socketStatus === "connected"
              ? "Conectado"
              : socketStatus === "connecting"
                ? "Conectando..."
                : "Desconectado"}
          </Text>
        </View>
        {historyError || socketError ? (
          <Text style={styles.errorText}>
            {socketError || "No pudimos cargar el historial del chat."}
          </Text>
        ) : null}

        <KeyboardAvoidingView
          style={styles.chat}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.messageList}
            keyboardShouldPersistTaps="handled">
            {messages.length === 0 && socketStatus === "connecting" ? (
              <ActivityIndicator color={colors.primary} />
            ) : messages.length === 0 ? (
              <Text style={styles.emptyText}>
                Aún no hay mensajes. Inicia la conversación.
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
                    <Text
                      style={[
                        styles.messageText,
                        ownMessage && styles.ownMessageText,
                      ]}>
                      {message.content}
                    </Text>
                    <Text
                      style={[
                        styles.messageTime,
                        ownMessage && styles.ownMessageTime,
                      ]}>
                      {formatTime(message.createdAt)}
                    </Text>
                  </View>
                );
              })
            )}
          </ScrollView>

          <View style={styles.composer}>
            <Input
              value={draft}
              onChangeText={setDraft}
              placeholder="Escribe un mensaje..."
              accessibilityLabel="Escribe un mensaje"
              containerStyle={styles.input}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <Button
              onPress={sendMessage}
              disabled={
                socketStatus !== "connected" || !draft.trim() || sending
              }
              fullWidth={false}
              accessibilityLabel="Enviar mensaje"
              style={styles.sendButton}
              leftIcon={<Ionicons name="send" size={18} color="#FFFFFF" />}>
              Enviar
            </Button>
          </View>
        </KeyboardAvoidingView>
      </ResponsiveContainer>
    </Screen>
  );
}

function normalizeMessage(message, index, fallbackSenderId) {
  return {
    id: message?.id || message?._id || `history-${index}`,
    senderId:
      message?.id_remitente ||
      message?.remitente_id ||
      message?.senderId ||
      fallbackSenderId,
    content:
      message?.contenido ||
      message?.mensaje ||
      message?.message ||
      "",
    createdAt:
      message?.created_at ||
      message?.fecha_creacion ||
      message?.createdAt ||
      null,
  };
}

function normalizeIncomingMessage(rawMessage, fallbackSenderId) {
  try {
    const parsedMessage = JSON.parse(rawMessage);
    return normalizeMessage(
      parsedMessage,
      Date.now(),
      parsedMessage?.id_remitente || fallbackSenderId,
    );
  } catch {
    return {
      id: `incoming-${Date.now()}`,
      senderId: fallbackSenderId,
      content: String(rawMessage).replace(/^Message text was:\s*/, ""),
      createdAt: new Date().toISOString(),
    };
  }
}

function formatTime(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

const styles = StyleSheet.create({
  invalid: {
    paddingVertical: spacing.xxl,
  },
  container: {
    flex: 1,
    minHeight: 0,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  publicationTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  connection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
    marginRight: spacing.xs,
  },
  connectedDot: {
    backgroundColor: "#16A34A",
  },
  connectionText: {
    color: colors.textSecondary,
    fontSize: 12,
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
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: spacing.lg,
  },
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
  ownMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  partnerMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceSecondary,
  },
  messageText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "#FFFFFF",
  },
  messageTime: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: "right",
    marginTop: 4,
  },
  ownMessageTime: {
    color: "#DBEAFE",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
  },
  sendButton: {
    marginBottom: 0,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: spacing.md,
  },
});
