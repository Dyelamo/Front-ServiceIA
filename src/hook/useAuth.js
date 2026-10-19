import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, View } from "react-native";

import { loginApi } from "../features/auth/api/auth.api";

import {
  getAccessToken,
  getLastActivityAt,
  saveAuthData,
  saveLastActivityAt,
  clearAuthData,
} from "../core/storage/auth.storage";
import { api } from "../core/api/client";

const AuthContext = createContext(null);
const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;
const ACTIVITY_STORAGE_INTERVAL_MS = 30 * 1000;

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastActivityAt = useRef(0);
  const lastPersistedActivityAt = useRef(0);
  const inactivityTimer = useRef(null);

  const logout = useCallback(async () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }

    await clearAuthData();
    lastActivityAt.current = 0;
    lastPersistedActivityAt.current = 0;
    setUserToken(null);
  }, []);

  const scheduleInactivityLogout = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    const remaining =
      INACTIVITY_TIMEOUT_MS - (Date.now() - lastActivityAt.current);

    inactivityTimer.current = setTimeout(() => {
      const inactiveFor = Date.now() - lastActivityAt.current;

      if (inactiveFor >= INACTIVITY_TIMEOUT_MS) {
        logout().catch((error) => {
          console.error("Error cerrando sesión inactiva:", error);
        });
        return;
      }

      scheduleInactivityLogout();
    }, Math.max(remaining, 0));
  }, [logout]);

  const recordActivity = useCallback(() => {
    if (!userToken) {
      return;
    }

    const timestamp = Date.now();
    lastActivityAt.current = timestamp;
    scheduleInactivityLogout();

    if (
      timestamp - lastPersistedActivityAt.current >=
      ACTIVITY_STORAGE_INTERVAL_MS
    ) {
      lastPersistedActivityAt.current = timestamp;
      saveLastActivityAt(timestamp).catch((error) => {
        console.error("Error guardando actividad de sesión:", error);
      });
    }
  }, [scheduleInactivityLogout, userToken]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await getAccessToken();

        if (!token) {
          return;
        }

        const now = Date.now();
        const storedActivity = Number(await getLastActivityAt());
        const lastActivity =
          Number.isFinite(storedActivity) && storedActivity > 0
            ? Math.min(storedActivity, now)
            : now;

        if (now - lastActivity >= INACTIVITY_TIMEOUT_MS) {
          await clearAuthData();
          return;
        }

        lastActivityAt.current = lastActivity;
        lastPersistedActivityAt.current = lastActivity;

        if (!Number.isFinite(storedActivity) || storedActivity <= 0) {
          await saveLastActivityAt(lastActivity);
        }

        setUserToken(token);
      } catch (error) {
        console.error("Error cargando sesión:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (!userToken) {
      return undefined;
    }

    scheduleInactivityLogout();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = null;
      }
    };
  }, [scheduleInactivityLogout, userToken]);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const headers = error?.config?.headers;
        const hasAuthorization =
          headers?.Authorization ||
          headers?.authorization ||
          headers?.get?.("Authorization");

        if (
          error?.response?.status === 401 &&
          hasAuthorization
        ) {
          try {
            await logout();
          } catch (logoutError) {
            console.error("Error cerrando sesión no autorizada:", logoutError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [logout]);

  useEffect(() => {
    if (!userToken) {
      return undefined;
    }

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        if (Date.now() - lastActivityAt.current >= INACTIVITY_TIMEOUT_MS) {
          logout().catch((error) => {
            console.error("Error cerrando sesión inactiva:", error);
          });
        } else {
          scheduleInactivityLogout();
        }

        return;
      }

      const timestamp = lastActivityAt.current;
      lastPersistedActivityAt.current = timestamp;
      saveLastActivityAt(timestamp).catch((error) => {
        console.error("Error guardando actividad de sesión:", error);
      });
    });

    return () => {
      subscription.remove();
    };
  }, [logout, scheduleInactivityLogout, userToken]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);

    await saveAuthData({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
    });

    const timestamp = Date.now();
    await saveLastActivityAt(timestamp);
    lastActivityAt.current = timestamp;
    lastPersistedActivityAt.current = timestamp;
    setUserToken(data.access_token);

    return data;
  };

  const value = {
    userToken,
    isAuthenticated: !!userToken,
    isLoading,
    login,
    logout,
    recordActivity,
  };

  return (
    <AuthContext.Provider value={value}>
      <View
        style={{ flex: 1 }}
        onStartShouldSetResponderCapture={() => {
          recordActivity();
          return false;
        }}>
        {children}
      </View>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
};
