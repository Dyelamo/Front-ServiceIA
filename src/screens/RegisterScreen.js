import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { registerApi } from "../features/services/auth.api";

export const RegisterScreen = ({ onRegistered, onGoToLogin }) => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombreCompleto || !email || !password) {
      Alert.alert(
        "Campos requeridos",
        "Nombre, correo y contraseña son obligatorios."
      );
      return;
    }

    try {
      setIsLoading(true);

      await registerApi({
        email,
        password,
        nombre_completo: nombreCompleto,
        telefono: telefono || null,
        ubicacion: ubicacion || null,
      });

      Alert.alert(
        "Registro exitoso",
        "Tu cuenta fue creada correctamente.",
        [
          {
            text: "Continuar",
            onPress: onRegistered,
          },
        ]
      );
    } catch (error) {
      console.error("Error registrando usuario:", error);
      const message = error.response?.data?.detail || "No se pudo crear la cuenta.";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlowOne} />
      <View style={styles.backgroundGlowTwo} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandCard}>
          <View style={styles.brandBadge}>
            <Ionicons name="person-add-outline" size={26} color="#ffffff" />
          </View>
          <Text style={styles.brand}>ServIA</Text>
          <Text style={styles.tagline}>Crea tu cuenta y empieza hoy</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Regístrate para acceder a profesionales verificados y servicios a tu medida.
          </Text>

          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#94A3B8"
              value={nombreCompleto}
              onChangeText={setNombreCompleto}
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Teléfono (opcional)"
              placeholderTextColor="#94A3B8"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons name="location-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Ubicación (opcional)"
              placeholderTextColor="#94A3B8"
              value={ubicacion}
              onChangeText={setUbicacion}
            />
          </View>

          {isLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#0B4C7A" />
            </View>
          ) : (
            <Pressable style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Crear cuenta</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </Pressable>
          )}

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
            <Pressable style={styles.secondaryButton} onPress={onGoToLogin}>
              <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3F8",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  backgroundGlowOne: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(11, 76, 122, 0.12)",
  },
  backgroundGlowTwo: {
    position: "absolute",
    bottom: -40,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(11, 76, 122, 0.08)",
  },
  brandCard: {
    alignItems: "center",
    marginBottom: 18,
  },
  brandBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "#0B4C7A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0B4C7A",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    marginBottom: 12,
  },
  brand: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0F1B2B",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F1B2B",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 22,
    lineHeight: 22,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    height: 52,
    paddingLeft: 12,
    color: "#0F1B2B",
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#0B4C7A",
    borderRadius: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0B4C7A",
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
    marginRight: 8,
  },
  loadingBox: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
  },
  loginContainer: {
    alignItems: "center",
  },
  loginText: {
    color: "#64748B",
    fontSize: 14,
    marginBottom: 10,
  },
  secondaryButton: {
    width: "100%",
    height: 46,
    borderRadius: 14,
    backgroundColor: "#E4EEF6",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#0B4C7A",
    fontWeight: "800",
    fontSize: 15,
  },
});