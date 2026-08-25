// src/api/requestsService.js
// Capa de servicio para solicitudes de servicio. Hoy simula la llamada;
// cuando tengas backend, reemplaza el cuerpo de cada función por `api.post/get(...)`.
// src/api/requestsService.js
import api from './client';

export async function createServiceRequest(payload) {
  const body = {
    descripcion: payload.description,
    categoria_id: payload.categoryId,
    urgencia: payload.urgencyLabel,
  };

  try {
    const { data } = await api.post('/publicaciones', body);
    return {
    description: payload.description,
    category: payload.categoryLabel,
    serviceType: 'Servicio general',
    urgency: payload.urgencyLabel,
    presentialVisit: true,
    location: payload.location,
    followUpQuestions: [
      '¿Cuándo notaste el problema por primera vez?',
      '¿Tienes fotos adicionales del área afectada?',
    ],
  };;
  } catch (error) {
    console.error('Error al crear la solicitud de servicio:', error);
    throw error;
  }
}

export async function fetchNewRequests() {
  // return api.get('/professional/requests').then((res) => res.data);
  return [];
}

export default { createServiceRequest, fetchNewRequests };
