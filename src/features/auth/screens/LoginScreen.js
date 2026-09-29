import React, { useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors, spacing } from "../../../theme";

import { Button, Input } from "../../../shared/ui";

import AuthLayout from "../components/AuthLayout";
import AuthHeader from "../components/AuthHeader";

import { useAuth } from "../../../hook/useAuth";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Ingresa tu correo electrónico.";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = "Ingresa un correo válido.";
    }

    if (!password) {
      errors.password = "Ingresa tu contraseña.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    setError("");

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

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

      setError(
        "No pudimos iniciar sesión. Verifica tu conexión e intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <AuthHeader
          title="Bienvenido de nuevo"
          description="Inicia sesión para continuar en Serv-IA."
        />

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={colors.error}
            />

            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={(value) => {
              setEmail(value);

              if (fieldErrors.email) {
                setFieldErrors((prev) => ({
                  ...prev,
                  email: null,
                }));
              }
            }}
            error={fieldErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="next"
          />

          <View style={styles.fieldSpacing} />

          <Input
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChangeText={(value) => {
              setPassword(value);

              if (fieldErrors.password) {
                setFieldErrors((prev) => ({
                  ...prev,
                  password: null,
                }));
              }
            }}
            error={fieldErrors.password}
            secureTextEntry={!showPassword}
            editable={!loading}
            rightIcon={
              <Pressable onPress={() => setShowPassword((current) => !current)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={21}
                  color={colors.textSecondary}
                />
              </Pressable>
            }
          />

          <View style={styles.forgotContainer}>
            <Pressable
              onPress={() => {
                // Lo conectaremos cuando exista
                // recuperación de contraseña real.
              }}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          </View>

          <Button onPress={handleLogin} loading={loading} disabled={loading}>
            Iniciar sesión
          </Button>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tienes una cuenta?</Text>

            <Pressable
              disabled={loading}
              onPress={() => navigation.navigate("Register")}>
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
