import { createContext, useContext, useEffect, useState } from "react";

import { loginApi } from "../features/services/auth.api";
import {
  getAccessToken,
  saveAuthData,
  clearAuthData,
} from "../features/services/auth.storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const token = await getAccessToken();

      setUserToken(token);
    } catch (error) {
      console.error("Error cargando sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await loginApi(email, password);

    await saveAuthData({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
    });

    setUserToken(data.access_token);

    return data;
  };

  const logout = async () => {
    await clearAuthData();

    setUserToken(null);
  };

  const value = {
    userToken,
    isAuthenticated: !!userToken,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
};
