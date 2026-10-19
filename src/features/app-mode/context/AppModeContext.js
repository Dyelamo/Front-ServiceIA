// src/lib/AppModeContext.js
import React, { createContext, useMemo, useState } from "react";

export const AppModeContext = createContext({
  mode: "cliente",
  setMode: () => {},
  professionalProfile: null,
  setProfessionalProfile: () => {},
});

export function AppModeProvider({ children }) {
  const [mode, setMode] = useState("cliente"); // 'cliente' | 'profesional'
  const [professionalProfile, setProfessionalProfile] = useState(null);

  const value = useMemo(
    () => ({ mode, setMode, professionalProfile, setProfessionalProfile }),
    [mode, professionalProfile],
  );

  return (
    <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
  );
}

export default AppModeContext;
