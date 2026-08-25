import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Button,
    Alert,
} from "react-native";

import { getMyProfileApi } from "../features/usuario/usuario.api";
import { useAuth } from "../hook/useAuth";

export const ProfileScreen = ({ navigation, onBack }) => {

    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);

            const data = await getMyProfileApi();

            setProfile(data);

        } catch (error) {
            console.error(
                "Error obteniendo perfil:",
                error
            );

            const message =
                error.response?.data?.detail ||
                "No se pudo cargar el perfil.";

            Alert.alert("Error", message);

        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        console.log("Cerrando sesión...");
        //ANDROID ALERT DIALOG
        // Alert.alert(
        //     console.log("Cerrando sesión..."),
        //     "Cerrar sesión",
        //     "¿Estás seguro de que quieres cerrar sesión?",
        //     [
        //         {
        //             text: "Cancelar",
        //             style: "cancel",
        //         },
        //         {
        //             text: "Cerrar sesión",
        //             style: "destructive",
        //             onPress: async () => {
        //                 await onLogout();
        //             },
        //         },
        //     ]
        // );
        //WEB
        const confirmLogout = window.confirm(
            "¿Estás seguro de que quieres cerrar sesión?"
        );

        if (!confirmLogout) {
            return;
        }

        await logout();
        };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>
                    Cargando perfil...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Mi perfil
            </Text>

            {profile && (
                <View style={styles.profileCard}>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {profile.nombre_completo
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </Text>
                    </View>

                    <Text style={styles.name}>
                        {profile.nombre_completo}
                    </Text>

                    <View style={styles.infoContainer}>

                        <Text style={styles.label}>
                            Correo electrónico
                        </Text>

                        <Text style={styles.value}>
                            {profile.email}
                        </Text>

                        <Text style={styles.label}>
                            Teléfono
                        </Text>

                        <Text style={styles.value}>
                            {profile.telefono || "No registrado"}
                        </Text>

                        <Text style={styles.label}>
                            Ubicación
                        </Text>

                        <Text style={styles.value}>
                            {profile.ubicacion || "No registrada"}
                        </Text>

                    </View>

                </View>
            )}

            <View style={styles.buttons}>

                <Button
                    title="Volver"
                    onPress={() => {
                        if (onBack) {
                            onBack();
                        } else {
                            navigation.goBack();
                        }
                    }}
                />

                <View style={styles.buttonSpace} />

                <Button
                    title="Cerrar sesión"
                    color="red"
                    onPress={handleLogout}
                />

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 25,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
    },

    profileCard: {
        alignItems: "center",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },

    avatarText: {
        fontSize: 36,
        fontWeight: "bold",
    },

    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 25,
    },

    infoContainer: {
        width: "100%",
    },

    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#666",
        marginTop: 12,
    },

    value: {
        fontSize: 17,
        marginTop: 4,
    },

    buttons: {
        marginTop: 30,
    },

    buttonSpace: {
        height: 15,
    },
});