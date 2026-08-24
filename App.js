import React, { useState } from "react";

import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ManageServicesScreen } from "./src/screens/ManageServicesScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";

import { useAuth } from "./src/hook/useAuth";

export default function App() {

    const {
        isAuthenticated,
        isLoading,
        login,
        logout,
    } = useAuth();

    const [showRegister, setShowRegister] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {

        if (showRegister) {
            return (
                <RegisterScreen
                    onRegistered={() => setShowRegister(false)}
                    onGoToLogin={() => setShowRegister(false)}
                />
            );
        }

        return (
            <LoginScreen
                onLogin={login}
                onGoToRegister={() => setShowRegister(true)}
            />
        );
    }

    if (showProfile) {
        return (
            <ProfileScreen
                onBack={() => setShowProfile(false)}
                onLogout={logout}
            />
        );
    }

    return (
        <ManageServicesScreen
            onOpenProfile={() => setShowProfile(true)}
        />
    );
}

