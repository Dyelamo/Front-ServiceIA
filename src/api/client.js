// src/api/client.js
import axios from 'axios';

import { getAccessToken } from '../features/services/auth.storage';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // cámbialo por tu URL real cuando despliegues
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;