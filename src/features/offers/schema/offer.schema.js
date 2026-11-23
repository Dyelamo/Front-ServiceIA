import { z } from "zod";

export const offerSchema = z.object({
  price: z
    .string()
    .trim()
    .min(1, "Indica el precio de tu propuesta.")
    .regex(/^\d+$/, "Escribe el precio solo con números.")
    .refine((value) => Number(value) >= 1000, "El precio mínimo es de $1.000.")
    .refine((value) => Number(value) <= 100000000, "Revisa el valor ingresado."),
  availability: z
    .string()
    .trim()
    .min(5, "Describe cuándo puedes realizar el trabajo.")
    .max(120, "La disponibilidad no puede superar 120 caracteres."),
  message: z
    .string()
    .trim()
    .min(20, "Cuéntale al cliente un poco más sobre tu propuesta.")
    .max(500, "El mensaje no puede superar 500 caracteres."),
});
