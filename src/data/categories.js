// src/data/categories.js
// Categorías de servicio disponibles en el marketplace.
// icon: nombre de ícono de @expo/vector-icons (Ionicons)

export const CATEGORIES = [
  { id: 'b42848e1-c8fd-4ab7-9cc0-21d25f360bda', label: 'Limpieza', icon: 'sparkles-outline' },
  { id: '25c52bf4-f66b-4f83-bae9-365075e8546a', label: 'Albañilería', icon: 'hammer-outline' },
  { id: '79ff9223-a11e-448a-b383-88e947de7efe', label: 'Pintura', icon: 'color-palette-outline' },
  { id: '8866df0e-386c-4130-bec1-a5535573a181', label: 'Climatización', icon: 'thermometer-outline' },
  { id: '309b7658-ec49-4ed9-8e1d-babef448ae87', label: 'Plomería', icon: 'water-outline' },
  { id: '6cdb3be6-7f4b-48d5-8ccb-bcde129a86ed', label: 'Electricidad', icon: 'flash-outline' },
  { id: '092c10e9-3f3e-430b-bffa-a493f00be823', label: 'Carpintería', icon: 'construct-outline' },
  { id: '327708fe-3d6a-40dd-a95b-a3010ac9de0d', label: 'Cerrajería', icon: 'key-outline' },
  { id: '395845b8-332e-4f95-b686-d6e824a62a78', label: 'Jardinería', icon: 'leaf-outline' },
  { id: 'a38e04db-de6c-46d1-9639-6e99110b94df', label: 'Limpieza del hogar', icon: 'home-outline' },
  { id: '43ccdfae-2bbb-4904-9824-b326e9e966b1', label: 'Techos e impermeabilización', icon: 'rainy-outline' },
  { id: '75597730-d042-4b18-979f-9a5205dde131', label: 'Drywall y cielo raso', icon: 'layers-outline' },
  { id: '8ebe6587-f1f5-4fa8-8ad6-43ba21714d7b', label: 'Aire acondicionado', icon: 'snow-outline' },
  { id: 'f1d3e8cb-6c54-481e-aacc-afa5fd1b88db', label: 'Refrigeración', icon: 'snow-outline' },
  { id: '6017401d-bdd3-4a8e-8834-749e9545c856', label: 'Gasfitería', icon: 'build-outline' },
  { id: '6f5ecc04-d60b-481e-9bef-f9f022f75717', label: 'Instalación de pisos', icon: 'grid-outline' },
  { id: 'b94591be-b28d-42c4-9ad2-9fcd22307e94', label: 'Vidriería y aluminio', icon: 'cube-outline' },
  { id: 'c8495666-2db2-4981-a508-fe2671e5b189', label: 'Control de plagas', icon: 'bug-outline' },
  { id: 'bc7ee3e3-5815-4dbf-93ca-ec510ae1767e', label: 'Mudanzas', icon: 'archive-outline' },
  { id: '867ce311-05ed-48fe-bcfe-67bd0b28e6d3', label: 'Remodelación', icon: 'business-outline' },
  { id: '717c493a-ca8b-4f88-b451-0d89232cf5d2', label: 'Decoración de interiores', icon: 'color-wand-outline' },
  { id: 'c3fd927e-28a2-43aa-91b6-3a7beca24245', label: 'Soldadura y estructuras metálicas', icon: 'flame-outline' },
  { id: '9e161b76-b6ea-44a4-99e2-aebdf215d93d', label: 'Impermeabilización de tanques', icon: 'shield-checkmark-outline' },
  { id: '9c2f2df7-72e1-48e2-b0bd-d40b84429ba3', label: 'Automatización del hogar', icon: 'hardware-chip-outline' },
  { id: '8936202d-d9f8-4774-bdae-eca37db04a04', label: 'Piscinas', icon: 'water-outline' },
  { id: '17d871cf-6507-4149-8206-7f6e8e57be40', label: 'Electrodomésticos', icon: 'tv-outline' },
  { id: 'b5e66ffa-abfe-4098-920b-ee9490c26667', label: 'Mecánica automotriz a domicilio', icon: 'car-outline' }
];

export const URGENCY_OPTIONS = [
  { id: 'ahora', label: 'ahora', description: 'Necesito atención inmediata' },
  { id: 'hoy', label: 'hoy', description: 'En el transcurso del día' },
  { id: 'semana', label: 'esta semana', description: 'En los próximos días' },
  { id: 'sin_prisa', label: 'no tengo prisa', description: 'Puedo esperar' },
];

export default CATEGORIES;