import { create } from "axios";
import { Platform } from "react-native";

import { getAccessToken, getRefreshToken, saveAuthData } from "../storage/auth.storage";

const CONFIGURED_API_URL = process.env.EXPO_PUBLIC_API_URL || "/api";
const API_URL =
  Platform.OS === "web" &&
  __DEV__ &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(?=[:/]|$)/i.test(CONFIGURED_API_URL)
    ? "/api"
    : CONFIGURED_API_URL;

export const api = create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
}

async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new Error("No hay un refresh token disponible.");
  }

  const { data } = await refreshClient.post("/auth/refresh", {
    refresh_token: refreshToken,
  });
  const accessToken = data?.access_token;

  if (!accessToken) {
    throw new Error("La respuesta de renovación no contiene un access token.");
  }

  await saveAuthData({
    access_token: accessToken,
    refresh_token: data?.refresh_token || refreshToken,
    user_id: data?.user_id,
  });

  return accessToken;
}

api.interceptors.request.use(
  async (config) => {
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (typeof config.headers?.delete === "function") {
        config.headers.delete("Content-Type");
      } else if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const authorization =
      originalRequest?.headers?.Authorization ||
      originalRequest?.headers?.authorization ||
      originalRequest?.headers?.get?.("Authorization");

    if (error?.response?.status !== 401 || !authorization || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken()
        .catch(async (refreshError) => {
          await unauthorizedHandler?.();
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      const accessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default api;
