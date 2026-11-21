import { api } from "../../../core/api/client";

/**
 * Obtiene las notificaciones del usuario autenticado y conteo de no leídas.
 */
export const fetchNotifications = async () => {
  const { data } = await api.get("/notificaciones", {
    params: { limit: 50, offset: 0 },
  });
  return data;
};

/**
 * Marca una notificación individual como leída.
 */
export const markNotificationAsRead = async (notificationId) => {
  const { data } = await api.patch(`/notificaciones/${notificationId}/leer`);
  return data;
};

/**
 * Marca todas las notificaciones pendientes como leídas.
 */
export const markAllNotificationsAsRead = async () => {
  const { data } = await api.patch("/notificaciones/leer-todas");
  return data;
};

/**
 * Elimina una notificación.
 */
export const deleteNotification = async (notificationId) => {
  const { data } = await api.delete(`/notificaciones/${notificationId}`);
  return data;
};
