import axios from "axios";
import { setupAuthMiddleware } from "./authMiddleware";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Configura el middleware de autenticación y redirección al login ante expiración
setupAuthMiddleware(api);

export default api;