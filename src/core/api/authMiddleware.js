import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveAuthData,
  clearAuthData,
} from "../storage/auth.storage";

let onSessionExpiredCallback = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Registra el callback global que se ejecutará cuando la sesión expire
 * para redirigir al usuario automáticamente a la pantalla de Login.
 */
export const setOnSessionExpired = (callback) => {
  onSessionExpiredCallback = callback;
};

/**
 * Dispara el cierre de sesión y la redirección forzada al Login.
 */
export const triggerSessionExpired = async () => {
  try {
    await clearAuthData();
  } catch (e) {
    console.error("Error limpiando datos de autenticación:", e);
  }

  if (typeof onSessionExpiredCallback === "function") {
    onSessionExpiredCallback();
  }
};

/**
 * Configura los interceptores (middleware) de autenticación y manejo de sesión expirada en la instancia de axios.
 */
export const setupAuthMiddleware = (api) => {
  // Middleware de peticiones (Request): adjunta token
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Error recuperando access token en middleware:", err);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Middleware de respuestas (Response): detecta 401 y expira sesión / redirige al login
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // No interceptar endpoints de login/registro para no ciclar
      const isAuthEndpoint =
        originalRequest?.url?.includes("/auth/login") ||
        originalRequest?.url?.includes("/auth/register");

      if (error.response?.status === 401 && !isAuthEndpoint) {
        if (originalRequest._retry) {
          // Ya se había reintentado y volvió a fallar: sesión expirada definitivamente
          await triggerSessionExpired();
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await getRefreshToken();
          if (!refreshToken) {
            throw new Error("No hay refresh token disponible");
          }

          const baseURL = api.defaults.baseURL || "";
          const refreshUrl = `${baseURL.replace(/\/+$/, "")}/auth/refresh`;

          const { data } = await axios.post(refreshUrl, {
            refresh_token: refreshToken,
          });

          if (data?.access_token) {
            await saveAuthData({
              access_token: data.access_token,
              refresh_token: data.refresh_token || refreshToken,
            });

            processQueue(null, data.access_token);
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            return api(originalRequest);
          } else {
            throw new Error("Respuesta de refresh inválida");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          console.warn("Sesión expirada. Redirigiendo al login...");
          await triggerSessionExpired();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
