import { api } from "../../../core/api/client";

/**
 * Obtiene las notificaciones del usuario autenticado y conteo de no leídas.
 */
export const fetchNotifications = async (role) => {
  const { data } = await api.get("/notificaciones", {
    params: { rol: role, limit: 50, offset: 0 },
  });
  return data;
};

/**
 * Marca una notificación individual como leída.
 */
export const markNotificationAsRead = async ({ notificationId, role }) => {
  const { data } = await api.patch(`/notificaciones/${notificationId}/leer`, null, {
    params: { rol: role },
  });
  return data;
};

/**
 * Marca todas las notificaciones pendientes como leídas.
 */
export const markAllNotificationsAsRead = async (role) => {
  const { data } = await api.patch("/notificaciones/leer-todas", null, {
    params: { rol: role },
  });
  return data;
};

/**
 * Elimina una notificación.
 */
export const deleteNotification = async ({ notificationId, role }) => {
  const { data } = await api.delete(`/notificaciones/${notificationId}`, {
    params: { rol: role },
  });
  return data;
};
