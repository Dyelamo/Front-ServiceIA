// src/lib/AppModeContext.js
import React, { createContext, useMemo, useState } from 'react';

export const AppModeContext = createContext({
  mode: 'cliente',
  setMode: () => {},
});

export function AppModeProvider({ children }) {
  const [mode, setMode] = useState('cliente'); // 'cliente' | 'profesional'

  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  );
}

export default AppModeContext;
