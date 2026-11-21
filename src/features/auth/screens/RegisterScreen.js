import React, { useState } from "react";

import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { colors, spacing } from "../../../theme/index";

import { Button, Input } from "../../../shared/ui/index";

import AuthLayout from "../components/AuthLayout";
import AuthHeader from "../components/AuthHeader";

import { useResponsive } from "../../../shared/hooks/useResponsive";
import { getApiErrorMessage } from "../../../core/errors/error-message";

import { registerApi } from "../api/auth.api";
import { registerSchema } from "../schema/auth.schema";

export default function RegisterScreen({ navigation }) {
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isMobile } = useResponsive();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });
  const password = useWatch({ control, name: "password" }) || "";
  const passwordLength = password.length;

  const handleRegister = async (form) => {
    setGeneralError("");

    const payload = {
      email: form.email.trim().toLowerCase(),

      password: form.password,

      nombre_completo: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),

      telefono: form.phone.trim(),

      ubicacion: "Valledupar, Cesar",
    };

    try {
      await registerApi(payload);

      navigation.goBack();
    } catch (err) {
      console.error("Error registrando usuario:", err);

      if (err?.response?.status === 409) {
        setGeneralError("Ya existe una cuenta con ese correo.");

        return;
      }

      setGeneralError(getApiErrorMessage(err, "No pudimos crear tu cuenta. Intenta nuevamente."));
    }
  };

  return (
    <AuthLayout>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <AuthHeader
          title="Crea tu cuenta"
          description="Empieza a usar Serv-IA para encontrar profesionales o comenzar a ofrecer tus servicios."
        />

        {generalError ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.error} />

            <Text style={styles.errorText}>{generalError}</Text>
          </View>
        ) : null}

        <View style={[styles.nameRow, isMobile && styles.nameRowMobile]}>
          <View style={styles.nameField}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  label="Nombre"
                  placeholder="Carlos"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(nextValue) => {
                    onChange(nextValue);
                    setGeneralError("");
                  }}
                  error={errors.firstName?.message}
                  editable={!isSubmitting}
                />
              )}
            />
          </View>

          <View style={[styles.nameSpacer, isMobile && styles.nameSpacerMobile]} />

          <View style={styles.nameField}>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  label="Apellido"
                  placeholder="Martínez"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(nextValue) => {
                    onChange(nextValue);
                    setGeneralError("");
                  }}
                  error={errors.lastName?.message}
                  editable={!isSubmitting}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.spacing} />

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
                setGeneralError("");
              }}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          )}
        />

        <View style={styles.spacing} />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              label="Teléfono"
              placeholder="300 123 4567"
              value={value}
              onBlur={onBlur}
              onChangeText={(nextValue) => {
                onChange(nextValue);
                setGeneralError("");
              }}
              error={errors.phone?.message}
              keyboardType="phone-pad"
              editable={!isSubmitting}
            />
          )}
        />

        <View style={styles.spacing} />

        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={value}
              onBlur={onBlur}
              onChangeText={(nextValue) => {
                onChange(nextValue);
                setGeneralError("");
              }}
              error={errors.password?.message}
              helperText={
                passwordLength > 0
                  ? passwordLength >= 10
                    ? "Fortaleza: buena"
                    : "Usa 10 o más caracteres para mayor seguridad."
                  : undefined
              }
              secureTextEntry={!showPassword}
              editable={!isSubmitting}
              rightIcon={
                <Pressable
                  accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  accessibilityRole="button"
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

        <View style={styles.spacing} />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={value}
              onBlur={onBlur}
              onChangeText={(nextValue) => {
                onChange(nextValue);
                setGeneralError("");
              }}
              error={errors.confirmPassword?.message}
              secureTextEntry={!showPassword}
              editable={!isSubmitting}
            />
          )}
        />

        <View style={styles.terms}>
          <Text style={styles.termsText}>
            Al crear tu cuenta aceptas los <Text style={styles.link}>términos y condiciones</Text> y
            la <Text style={styles.link}>política de privacidad</Text>.
          </Text>
        </View>

        <Button
          onPress={handleSubmit(handleRegister)}
          loading={isSubmitting}
          disabled={isSubmitting}
          loadingLabel="Creando cuenta...">
          Crear cuenta
        </Button>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>

          <Pressable disabled={isSubmitting} onPress={() => navigation.navigate("Login")}>
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
  nameRowMobile: {
    flexDirection: "column",
  },

  nameSpacerMobile: {
    width: 0,
    height: spacing.lg,
  },
});
