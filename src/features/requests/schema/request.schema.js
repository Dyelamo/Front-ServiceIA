import { z } from "zod";

const categoryIdSchema = z.union([z.string().min(1), z.number()]);

export const requestDraftSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, "Describe el problema con al menos 10 caracteres.")
    .max(500, "La descripción no puede superar 500 caracteres."),
  categoryId: categoryIdSchema,
  categoryName: z.string().optional(),
  urgency: z.string().min(1, "Selecciona cuándo necesitas el servicio."),
  urgencyLabel: z.string().optional(),
  location: z.string().optional(),
  city: z.string().trim().min(1, "Indica la ciudad."),
  barrio: z.string().trim().min(1, "Indica el barrio o sector."),
  address: z.string().trim().min(5, "Ingresa una dirección válida."),
  reference: z.string().optional(),
  latitud: z.number().nullable().optional(),
  longitud: z.number().nullable().optional(),
  photos: z.array(z.object({ id: z.string(), uri: z.string().min(1) })).max(5),
});
