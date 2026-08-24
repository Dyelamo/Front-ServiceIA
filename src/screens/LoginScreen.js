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

import { loginApi } from "../features/services/auth.api";
import { saveAuthData } from "../features/services/auth.storage";

export const LoginScreen = ({ onLogin, onGoToRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(
                "Campos requeridos",
                "Ingresa tu correo y contraseña."
            );
            return;
        }

        try {
            setIsLoading(true);

            await onLogin(email, password);

        } catch (error) {
            console.error("Error iniciando sesión:", error);

            const message =
                error.response?.data?.detail ||
                "No se pudo iniciar sesión.";

            Alert.alert("Error", message);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>ServIA</Text>

            <Text style={styles.subtitle}>
                Inicia sesión
            </Text>

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

            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button
                    title="Iniciar sesión"
                    onPress={handleLogin}
                />
            )}

            <View style={styles.registerContainer}>
                <Text>¿No tienes una cuenta?</Text>

                <Button
                    title="Crear cuenta"
                    onPress={onGoToRegister}
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
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 30,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },

    registerContainer: {
        marginTop: 30,
        alignItems: "center",
    },
});