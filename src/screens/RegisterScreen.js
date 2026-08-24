import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";

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

            const message =
                error.response?.data?.detail ||
                "No se pudo crear la cuenta.";

            Alert.alert("Error", message);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Crear cuenta</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={nombreCompleto}
                onChangeText={setNombreCompleto}
            />

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Teléfono (opcional)"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Ubicación (opcional)"
                value={ubicacion}
                onChangeText={setUbicacion}
            />

            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button
                    title="Crear cuenta"
                    onPress={handleRegister}
                />
            )}

            <View style={styles.loginContainer}>
                <Text>¿Ya tienes una cuenta?</Text>

                <Button
                    title="Iniciar sesión"
                    onPress={onGoToLogin}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 30,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },

    loginContainer: {
        marginTop: 25,
        alignItems: "center",
    },
});