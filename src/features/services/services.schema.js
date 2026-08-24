import { z } from 'zod';

// Esquema para validar el formulario en el Frontend (camelCase)
export const serviceFormSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción es muy corta"),
  // Usamos z.coerce.number() porque los TextInput de React Native devuelven strings
  precioDesde: z.coerce.number().min(0, "El precio no puede ser negativo"),
  precioHasta: z.coerce.number().min(0, "El precio no puede ser negativo"),
  duracionEstimada: z.coerce.number().min(1, "Debe durar al menos 1 minuto"),
  categoriaId: z.string().uuid("Debe ser un identificador válido"),
}).refine(data => data.precioHasta >= data.precioDesde, {
  message: "El precio máximo debe ser mayor o igual al inicial",
  path: ["precioHasta"], // El error aparecerá en el input de precioHasta
});

// --- PATRÓN ADAPTER ---

// De Frontend (camelCase) a Backend (snake_case)
export const adaptServiceToBackend = (data) => {
  return {
    nombre: data.nombre,
    descripcion: data.descripcion,
    precio_desde: data.precioDesde,
    precio_hasta: data.precioHasta,
    duracion_estimada: data.duracionEstimada,
    categoria_id: data.categoriaId,
  };
};

// De Backend (snake_case) a Frontend (camelCase)
export const adaptServiceToFrontend = (data) => {
  return {
    id: data.id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    precioDesde: data.precio_desde,
    precioHasta: data.precio_hasta,
    duracionEstimada: data.duracion_estimada,
    categoriaId: data.categoria_id,
    activo: data.activo, // Asumimos que el backend lo envía
    fechaPublicacion: data.fecha_publicacion,
  };
};