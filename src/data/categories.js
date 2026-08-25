// src/data/categories.js
// Categorías de servicio disponibles en el marketplace.
// icon: nombre de ícono de @expo/vector-icons (Ionicons)

export const CATEGORIES = [
  { id: '25c52bf4-f66b-4f83-bae9-365075e8546a', label: 'Albañilería', icon: 'hammer-outline' },
  { id: '79ff9223-a11e-448a-b383-88e947de7efe', label: 'Pintura', icon: 'color-palette-outline' },
  { id: 'a1564772-29f3-4a4f-acc7-db4304d35c07', label: 'Plomería', icon: 'water-outline' },
  { id: 'f2ac9791-63bc-4f95-9a72-55dd2223d199', label: 'Electricidad', icon: 'flash-outline' },
];

export const URGENCY_OPTIONS = [
  { id: 'ahora', label: 'ahora', description: 'Necesito atención inmediata' },
  { id: 'hoy', label: 'hoy', description: 'En el transcurso del día' },
  { id: 'semana', label: 'esta semana', description: 'En los próximos días' },
  { id: 'sin_prisa', label: 'no tengo prisa', description: 'Puedo esperar' },
];

export default CATEGORIES;