import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingresa tu correo electrónico.")
    .email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "Ingresa tu nombre."),
    lastName: z.string().trim().min(1, "Ingresa tu apellido."),
    email: z.string().trim().min(1, "Ingresa tu correo.").email("Ingresa un correo válido."),
    phone: z
      .string()
      .trim()
      .min(1, "Ingresa tu teléfono.")
      .refine(
        (value) => value.replace(/\D/g, "").length >= 7,
        "Ingresa un número de teléfono válido.",
      ),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });
