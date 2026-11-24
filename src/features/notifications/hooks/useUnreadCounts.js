import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../core/query/query-keys";
import { fetchConversations } from "../../chat/api/chat.api";
import { fetchNotifications } from "../api/notifications.api";

export function useUnreadCounts(role) {
  const conversations = useQuery({
    queryKey: queryKeys.conversations(role, "all"),
    queryFn: () => fetchConversations({ role }),
    refetchInterval: 15_000,
  });
  const notifications = useQuery({
    queryKey: queryKeys.notifications(role),
    queryFn: () => fetchNotifications(role),
    refetchInterval: 15_000,
  });

  return {
    messages: (conversations.data || []).reduce(
      (total, conversation) => total + Number(conversation.unreadCount || 0),
      0,
    ),
    notifications: Number(notifications.data?.no_leidas || 0),
  };
}

export function unreadBadge(count) {
  if (!count) return undefined;
  return count > 99 ? "99+" : count;
}
