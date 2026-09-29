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

import { registerApi } from "../api/auth.api";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [generalError, setGeneralError] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "Ingresa tu nombre.";
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = "Ingresa tu apellido.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Ingresa tu correo.";
    } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      nextErrors.email = "Ingresa un correo válido.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Ingresa tu teléfono.";
    }

    if (!form.password) {
      nextErrors.password = "Crea una contraseña.";
    } else if (form.password.length < 6) {
      nextErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Confirma tu contraseña.";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    setGeneralError("");

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      /*
        IMPORTANTE:

        Sustituye estas propiedades
        por las mismas que actualmente
        utiliza tu RegisterScreen viejo
        si el backend espera otros nombres.
      */

      const payload = {
        nombre: form.firstName.trim(),
        apellido: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        telefono: form.phone.trim(),
        password: form.password,
      };

      await registerApi(payload);

      navigation.goBack("Login");
    } catch (err) {
      console.error("Error registrando usuario:", err);

      const status = err?.response?.status;

      const backendMessage =
        err?.response?.data?.detail || err?.response?.data?.message;

      if (backendMessage) {
        setGeneralError(String(backendMessage));

        return;
      }

      if (status === 409) {
        setGeneralError("Ya existe una cuenta con ese correo.");

        return;
      }

      setGeneralError("No pudimos crear tu cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <AuthHeader
          title="Crea tu cuenta"
          description="Empieza a usar Serv-IA para encontrar profesionales o comenzar a ofrecer tus servicios."
        />

        {generalError ? (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={colors.error}
            />

            <Text style={styles.errorText}>{generalError}</Text>
          </View>
        ) : null}

        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <Input
              label="Nombre"
              placeholder="Carlos"
              value={form.firstName}
              onChangeText={(value) => updateField("firstName", value)}
              error={errors.firstName}
              editable={!loading}
            />
          </View>

          <View style={styles.nameSpacer} />

          <View style={styles.nameField}>
            <Input
              label="Apellido"
              placeholder="Martínez"
              value={form.lastName}
              onChangeText={(value) => updateField("lastName", value)}
              error={errors.lastName}
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.spacing} />

        <Input
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChangeText={(value) => updateField("email", value)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <View style={styles.spacing} />

        <Input
          label="Teléfono"
          placeholder="300 123 4567"
          value={form.phone}
          onChangeText={(value) => updateField("phone", value)}
          error={errors.phone}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <View style={styles.spacing} />

        <Input
          label="Contraseña"
          placeholder="Mínimo 6 caracteres"
          value={form.password}
          onChangeText={(value) => updateField("password", value)}
          error={errors.password}
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

        <View style={styles.spacing} />

        <Input
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={form.confirmPassword}
          onChangeText={(value) => updateField("confirmPassword", value)}
          error={errors.confirmPassword}
          secureTextEntry={!showPassword}
          editable={!loading}
        />

        <View style={styles.terms}>
          <Text style={styles.termsText}>
            Al crear tu cuenta aceptas los{" "}
            <Text style={styles.link}>términos y condiciones</Text> y la{" "}
            <Text style={styles.link}>política de privacidad</Text>.
          </Text>
        </View>

        <Button onPress={handleRegister} loading={loading} disabled={loading}>
          Crear cuenta
        </Button>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>

          <Pressable
            disabled={loading}
            onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  nameRow: {
    flexDirection: "row",
  },

  nameField: {
    flex: 1,
  },

  nameSpacer: {
    width: spacing.md,
  },

  spacing: {
    height: spacing.lg,
  },

  terms: {
    marginVertical: spacing.xxl,
  },

  termsText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  link: {
    color: colors.primary,
    fontWeight: "600",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
  },

  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  loginLink: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
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
