// src/data/categories.js
// Categorías de servicio disponibles en el marketplace.
// icon: nombre de ícono de @expo/vector-icons (Ionicons)

export const CATEGORIES = [
  { id: 'plomeria', label: 'Plomería', icon: 'water-outline' },
  { id: 'electricidad', label: 'Electricidad', icon: 'flash-outline' },
  { id: 'mecanica', label: 'Mecánica', icon: 'build-outline' },
  { id: 'albanileria', label: 'Albañilería', icon: 'hammer-outline' },
  { id: 'pintura', label: 'Pintura', icon: 'color-palette-outline' },
  { id: 'reparaciones', label: 'Reparaciones', icon: 'settings-outline' },
  { id: 'otros', label: 'Otros', icon: 'ellipsis-horizontal' },
];

export const URGENCY_OPTIONS = [
  { id: 'ahora', label: 'Ahora', description: 'Necesito atención inmediata' },
  { id: 'hoy', label: 'Hoy', description: 'En el transcurso del día' },
  { id: 'semana', label: 'Esta semana', description: 'En los próximos días' },
  { id: 'sin_prisa', label: 'No tengo prisa', description: 'Puedo esperar' },
];

export default CATEGORIES;
