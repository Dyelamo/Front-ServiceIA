// src/data/mockData.js
// Datos de ejemplo para simular el backend mientras se conecta la API real.

export const MOCK_PROFESSIONAL = {
  name: "Carlos Martínez",
  role: "Plomero",
  verified: true,
  rating: 4.9,
  services: 127,
  reviews: 3,
  location: "Valledupar, Cesar · Colombia",
  balance: 306000,
  monthEarnings: 306000,
  about:
    "Plomero con más de 10 años de experiencia en Valledupar. Especialista en fugas, instalación de grifería y redes de agua.",
  avatar: null,
  verification: [
    { id: "cedula", label: "Cédula de ciudadanía", status: "verificado" },
    {
      id: "antecedentes",
      label: "Certificado de antecedentes",
      status: "verificado",
    },
    {
      id: "referencias",
      label: "Referencias verificadas",
      status: "verificado",
    },
    { id: "curso", label: "Curso de seguridad", status: "pendiente" },
  ],
};

export const MOCK_NEW_REQUESTS = [
  {
    id: "req-1",
    title: "Servicio general",
    category: "Electricidad",
    client: "Usuario",
    description: "Arreglar aire",
    location: "Valledupar",
    time: "Ahora",
    badge: "Hoy",
    badgeType: "warning",
  },
  {
    id: "req-2",
    title: "Fuga de agua",
    category: "Plomería",
    client: "Laura Mendoza",
    description:
      "Se me está saliendo agua debajo del lavamanos y el gabinete ya está mojado. Necesito que lo revisen hoy...",
    location: "Barrio Los Fundadores",
    time: "Hace 22 min",
    badge: "Hoy",
    badgeType: "warning",
  },
  {
    id: "req-3",
    title: "Corto en tomacorriente",
    category: "Electricidad",
    client: "Óscar Cuadro",
    description:
      "El tomacorriente de la cocina hace chispa cuando conecto la licuadora. Huele a quemado.",
    location: "Barrio La Nevada",
    time: "Hace 40 min",
    badge: "Ahora",
    badgeType: "danger",
  },
];

export const MOCK_CLIENT_PUBLICATIONS = [
  {
    id: "pub-1",
    title: "Fuga de agua debajo del lavamanos",
    category: "Plomería",
    description:
      "Se está saliendo agua debajo del lavamanos y el gabinete ya está mojado.",
    location: "Valledupar, Cesar",
    time: "Hoy, 9:42 AM",
    status: "Buscando profesional",
    statusType: "warning",
    offers: 2,
  },
  {
    id: "pub-2",
    title: "Tomacorriente de la cocina",
    category: "Electricidad",
    description: "El tomacorriente hace chispa cuando conecto la licuadora.",
    location: "Barrio La Nevada",
    time: "12 ago 2026",
    status: "Servicio en curso",
    statusType: "success",
    offers: 1,
  },
];

export const MOCK_CLIENT_OFFERS = [
  {
    id: "offer-1",
    publicationTitle: "Fuga de agua debajo del lavamanos",
    professional: "Carlos Martínez",
    category: "Plomería",
    message: "Puedo revisar la fuga hoy y llevar los repuestos necesarios.",
    price: 130000,
    rating: 4.9,
    time: "Hace 18 min",
    status: "Nueva oferta",
  },
  {
    id: "offer-2",
    publicationTitle: "Fuga de agua debajo del lavamanos",
    professional: "Andrés Pérez",
    category: "Plomería",
    message: "Tengo disponibilidad esta tarde para hacer la revisión.",
    price: 95000,
    rating: 4.7,
    time: "Hace 35 min",
    status: "Nueva oferta",
  },
];

export const MOCK_ACTIVE_JOBS = [
  {
    id: "job-1",
    title: "Revisión de fuga en cocina",
    client: "Laura Mendoza",
    location: "Barrio Los Fundadores, Valledupar",
    schedule: "Hoy, 3:00 PM",
    price: 130000,
    status: "En camino",
  },
];

export const MOCK_COMPLETED_JOBS = [
  {
    id: "job-2",
    title: "Cambio de grifería en baño",
    client: "Ana Beltrán",
    location: "Barrio Alfonso López, Valledupar",
    schedule: "15 ago 2026",
    price: 89500,
    status: "Completado",
  },
];

export const MOCK_TRANSACTIONS = [
  {
    id: "tx-1",
    title: "Reparación de fuga de agua",
    date: "18 ago 2026",
    commission: 7000,
    amount: 113000,
  },
  {
    id: "tx-2",
    title: "Cambio de grifería en baño",
    date: "15 ago 2026",
    commission: 5500,
    amount: 89500,
  },
  {
    id: "tx-3",
    title: "Destape de tubería de cocina",
    date: "10 ago 2026",
    commission: 6500,
    amount: 103500,
  },
];

export const MOCK_BALANCE_SUMMARY = {
  available: 306000,
  totalBilled: 325000,
  commission: 19000,
};

export const MOCK_FOLLOWUP_QUESTIONS = [
  "¿Cuándo notaste el problema por primera vez?",
  "¿Tienes fotos adicionales del área afectada?",
];

export default {
  MOCK_PROFESSIONAL,
  MOCK_NEW_REQUESTS,
  MOCK_CLIENT_PUBLICATIONS,
  MOCK_CLIENT_OFFERS,
  MOCK_ACTIVE_JOBS,
  MOCK_COMPLETED_JOBS,
  MOCK_TRANSACTIONS,
  MOCK_BALANCE_SUMMARY,
  MOCK_FOLLOWUP_QUESTIONS,
};
