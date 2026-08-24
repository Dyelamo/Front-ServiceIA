// src/api/client.js
// Instancia base de axios. Reemplaza baseURL por la de tu backend real.
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.tu-backend-manitas.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ejemplo de interceptor para inyectar token de auth cuando exista login:
// api.interceptors.request.use((config) => {
//   const token = getTokenFromStorage();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;
