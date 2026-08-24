import React, { useState } from "react";

import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ManageServicesScreen } from "./src/screens/ManageServicesScreen";

import { useAuth } from "./src/hook/useAuth";

export default function App() {

    const {
        isAuthenticated,
        isLoading,
        login,
        logout,
    } = useAuth();

    const [showRegister, setShowRegister] = useState(false);

    if (isLoading) {
        return null;
    }

    if (isAuthenticated) {
        return (
            <ManageServicesScreen
                onLogout={logout}
            />
        );
    }

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