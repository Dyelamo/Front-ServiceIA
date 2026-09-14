import axios from 'axios';
import { adaptServiceToBackend, adaptServiceToFrontend } from './services.schema';

const API_URL=process.env.EXPO_PUBLIC_API_URL || "/api";

export const createServiceApi = async (serviceData, token) => {
  const payload = adaptServiceToBackend(serviceData);
  const response = await axios.post(`${API_URL}/`, payload, getAuthHeaders(token));
  return adaptServiceToFrontend(response.data);
};

export const updateServiceApi = async (id, serviceData, token) => {
  const payload = adaptServiceToBackend(serviceData);
  const response = await axios.put(`${API_URL}/${id}`, payload, getAuthHeaders(token));
  return adaptServiceToFrontend(response.data);
};

export const publishServiceApi = async (id, token) => {
  const response = await axios.patch(`${API_URL}/${id}/publicar`, {}, getAuthHeaders(token));
  return adaptServiceToFrontend(response.data);
};

export const deleteServiceApi = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders(token));
  return response.data;
};