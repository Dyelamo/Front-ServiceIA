import React, { useCallback, useContext } from "react";

import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../core/query/query-keys";
import { AppModeContext } from "../../app-mode/context/AppModeContext";
import { EmptyState, ErrorState, Skeleton } from "../../../shared/ui";
import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout";
import { colors, layout, radius, spacing } from "../../../theme";
import { fetchConversations } from "../api/chat.api";

export default function MessagesScreen({ navigation }) {
  const { mode } = useContext(AppModeContext);
  const {
    data: conversations = [],
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.conversations(mode, "all"),
    queryFn: () => fetchConversations({ role: mode }),
  });

  useFocusEffect(useCallback(() => void refetch(), [refetch]));

  const openConversation = (conversation) => {
    navigation.navigate("Chat", {
      conversationId: conversation.id,
      partnerId: conversation.partner?.id,
      partnerName: conversation.partner?.nombre_completo || "Conversación",
      publicationTitle: conversation.publication?.descripcion,
    });
  };

  if (isLoading) {
    return (
      <Screen>
        <AppHeader
          title={mode === "profesional" ? "Mensajes profesionales" : "Mensajes"}
          maxWidth={layout.content.wide}
        />
        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} height={100} />
          ))}
        </ResponsiveContainer>
      </Screen>
    );
  }

  if (isError && conversations.length === 0) {
    return (
      <Screen>
        <AppHeader
          title={mode === "profesional" ? "Mensajes profesionales" : "Mensajes"}
          maxWidth={layout.content.wide}
        />
        <ResponsiveContainer maxWidth={layout.content.wide} style={styles.container}>
          <ErrorState
            title="No pudimos cargar tus conversaciones"
            description="Intenta nuevamente."
            onRetry={refetch}
            retrying={isFetching}
          />
        </ResponsiveContainer>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={colors.background}>
      <AppHeader
        title={mode === "profesional" ? "Mensajes profesionales" : "Mensajes"}
        maxWidth={layout.content.wide}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={styles.scrollContent}>
        <ResponsiveContainer maxWidth={layout.content.wide}>
          {isError ? (
            <Text style={styles.warning}>
              No pudimos actualizar la lista. Mostramos los datos disponibles.
            </Text>
          ) : null}

          {conversations.length === 0 ? (
            <EmptyState
              icon="chatbubbles-outline"
              title="Aún no tienes conversaciones"
              description={
                mode === "profesional"
                  ? "Aparecerán cuando un cliente acepte una de tus ofertas."
                  : "Aparecerán cuando aceptes la oferta de un profesional."
              }
            />
          ) : (
            conversations.map((conversation) => {
              const isClosed = conversation.status === "cerrada";
              return (
                <Pressable
                  key={conversation.id}
                  onPress={() => openConversation(conversation)}
                  style={({ pressed }) => [
                    styles.conversationCard,
                    isClosed && styles.closedCard,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.avatar}>
                    <Ionicons name="person-outline" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.conversationContent}>
                    <View style={styles.titleRow}>
                      <Text numberOfLines={1} style={styles.partnerName}>
                        {conversation.partner?.nombre_completo || "Conversación"}
                      </Text>
                      <Text style={[styles.state, isClosed && styles.closedState]}>
                        {isClosed ? "Cerrado" : "Activo"}
                      </Text>
                    </View>
                    <Text numberOfLines={1} style={styles.publication}>
                      {conversation.publication?.descripcion || "Servicio"}
                    </Text>
                    <Text numberOfLines={1} style={styles.lastMessage}>
                      {conversation.lastMessage?.content ||
                        `Oferta aceptada · ${formatCurrency(conversation.offer?.price)}`}
                    </Text>
                  </View>
                  <View style={styles.trailing}>
                    {conversation.lastMessage?.createdAt ? (
                      <Text style={styles.date}>
                        {formatDate(conversation.lastMessage.createdAt)}
                      </Text>
                    ) : null}
                    {conversation.unreadCount > 0 ? (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                      </View>
                    ) : (
                      <Ionicons name="chevron-forward" size={19} color={colors.textMuted} />
                    )}
                  </View>
                </Pressable>
              );
            })
          )}
        </ResponsiveContainer>
      </ScrollView>
    </Screen>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.xxl, gap: spacing.md },
  scrollContent: { paddingVertical: spacing.xl },
  conversationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  closedCard: { opacity: 0.8, backgroundColor: colors.surfaceSecondary },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },
  conversationContent: { flex: 1, marginHorizontal: spacing.md },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  partnerName: { flex: 1, color: colors.text, fontSize: 15, fontWeight: "700" },
  state: { color: "#15803D", fontSize: 11, fontWeight: "700" },
  closedState: { color: colors.textMuted },
  publication: { color: colors.textSecondary, fontSize: 13, marginTop: 3 },
  lastMessage: { color: colors.textMuted, fontSize: 12, marginTop: 5 },
  trailing: { alignItems: "flex-end", gap: spacing.sm },
  date: { color: colors.textMuted, fontSize: 10 },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  unreadText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  pressed: { opacity: 0.8 },
  warning: {
    color: "#9A3412",
    backgroundColor: "#FFF7ED",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
});
