import { useState, useEffect, useCallback } from "react";
import { fetchUnreadChatCount, markChatMessagesAsRead } from "../api/chat.api";

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback(async () => {
    try {
      const count = await fetchUnreadChatCount();
      setUnreadCount(count);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshUnread();
    const timer = setInterval(refreshUnread, 10000);
    return () => clearInterval(timer);
  }, [refreshUnread]);

  const markAllRead = useCallback(async (conversationId) => {
    try {
      await markChatMessagesAsRead(conversationId);
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }, []);

  return {
    unreadCount,
    refreshUnread,
    markAllRead,
  };
}
