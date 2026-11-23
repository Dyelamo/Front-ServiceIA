import React, { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { colors, spacing } from "../../../theme";

import { Button, Input } from "../../../shared/ui";

import AuthLayout from "../components/AuthLayout";
import AuthHeader from "../components/AuthHeader";

import { useAuth } from "../../../hook/useAuth";
import { loginSchema } from "../schema/auth.schema";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const handleLogin = async ({ email, password }) => {
    setError("");

    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      console.error("Error iniciando sesión:", err);

      const status = err?.response?.status;

      if (status === 401 || status === 400) {
        setError("El correo o la contraseña no son correctos.");

        return;
      }

      if (err?.code === "ECONNABORTED") {
        setError("El servidor está tardando demasiado. Intenta nuevamente.");

        return;
      }
      setError("No pudimos iniciar sesión. Verifica tu conexión e intenta nuevamente.");
    }
  };

  return (
    <AuthLayout>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <AuthHeader
          title="Bienvenido de nuevo"
          description="Inicia sesión para continuar en Serv-IA."
        />

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.error} />

            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                value={value}
                onBlur={onBlur}
                onChangeText={(nextValue) => {
                  onChange(nextValue);
                  setError("");
                }}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
                returnKeyType="next"
              />
            )}
          />

          <View style={styles.fieldSpacing} />

          <Controller
            control={control}
            name="password"
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={value}
                onBlur={onBlur}
                onChangeText={(nextValue) => {
                  onChange(nextValue);
                  setError("");
                }}
                error={errors.password?.message}
                secureTextEntry={!showPassword}
                editable={!isSubmitting}
                rightIcon={
                  <Pressable
                    accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    accessibilityRole="button"
                    disabled={isSubmitting}
                    onPress={() => setShowPassword((current) => !current)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={21}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                }
              />
            )}
          />

          <View style={styles.forgotContainer}>
            <Pressable
              disabled={isSubmitting}
              onPress={() => {
                Alert.alert(
                  "Recuperación de contraseña",
                  "Esta opción estará disponible cuando el backend habilite el envío de enlaces de recuperación.",
                );
              }}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          </View>

          <Button
            onPress={handleSubmit(handleLogin)}
            loading={isSubmitting}
            disabled={isSubmitting}
            loadingLabel="Iniciando...">
            Iniciar sesión
          </Button>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tienes una cuenta?</Text>

            <Pressable disabled={isSubmitting} onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>Crear cuenta</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
  },

  fieldSpacing: {
    height: spacing.lg,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },

  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: spacing.xxl,
  },

  registerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: spacing.xs,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xxl,
  },

  errorText: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 14,
    lineHeight: 20,
    marginLeft: spacing.sm,
  },
});
