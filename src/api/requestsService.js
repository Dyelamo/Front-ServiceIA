// src/api/requestsService.js
// Capa de servicio para solicitudes de servicio. Hoy simula la llamada;
// cuando tengas backend, reemplaza el cuerpo de cada función por `api.post/get(...)`.
import api from './client';

export async function createServiceRequest(payload) {
  // return api.post('/requests', payload).then((res) => res.data);

  // --- Simulación mientras no hay backend ---
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    id: `req-${Date.now()}`,
    category: payload.categoryLabel,
    serviceType: 'Servicio general',
    urgency: payload.urgencyLabel,
    presentialVisit: true,
    location: payload.location,
    followUpQuestions: [
      '¿Cuándo notaste el problema por primera vez?',
      '¿Tienes fotos adicionales del área afectada?',
    ],
  };
}

export async function fetchNewRequests() {
  // return api.get('/professional/requests').then((res) => res.data);
  return [];
}

export default { createServiceRequest, fetchNewRequests };
