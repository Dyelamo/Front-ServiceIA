import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "../../../hook/useAuth";
import { getMyProfessionalProfileApi } from "../../professional/api/professional.api";
import { getStoredAppMode, saveAppMode } from "../storage/app-mode.storage";

export const AppModeContext = createContext(null);

export function AppModeProvider({ children }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [mode, setModeState] = useState("cliente");
  const [professionalProfile, setProfessionalProfile] = useState(null);
  const [isModeResolved, setIsModeResolved] = useState(false);

  const setMode = useCallback((nextMode) => {
    const safeMode = nextMode === "profesional" ? "profesional" : "cliente";

    setModeState(safeMode);
    saveAppMode(safeMode).catch((error) => {
      console.error("Error guardando el modo de la aplicación:", error);
    });
  }, []);

  useEffect(() => {
    if (isAuthLoading) {
      return undefined;
    }

    let active = true;

    const restoreMode = async () => {
      if (!isAuthenticated) {
        if (active) {
          setModeState("cliente");
          setProfessionalProfile(null);
          setIsModeResolved(false);
        }
        return;
      }

      setIsModeResolved(false);

      try {
        const storedMode = await getStoredAppMode();

        if (storedMode !== "profesional") {
          if (active) {
            setModeState("cliente");
          }
          return;
        }

        const profile = await getMyProfessionalProfileApi();

        if (active) {
          setProfessionalProfile(profile);
          setModeState("profesional");
        }
      } catch (error) {
        if (error?.response?.status !== 404) {
          console.error("Error restaurando el modo profesional:", error);
        }

        if (active) {
          setProfessionalProfile(null);
          setModeState("cliente");
          await saveAppMode("cliente");
        }
      } finally {
        if (active) {
          setIsModeResolved(true);
        }
      }
    };

    restoreMode();

    return () => {
      active = false;
    };
  }, [isAuthenticated, isAuthLoading]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      isModeLoading: isAuthLoading || (isAuthenticated && !isModeResolved),
      professionalProfile,
      setProfessionalProfile,
    }),
    [isAuthenticated, isAuthLoading, isModeResolved, mode, professionalProfile, setMode],
  );

  return <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>;
}

export default AppModeContext;
