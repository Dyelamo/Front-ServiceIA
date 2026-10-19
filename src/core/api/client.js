import axios from "axios";

import {
  getAccessToken,
} from "../storage/auth.storage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token =
      await getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

export default api;