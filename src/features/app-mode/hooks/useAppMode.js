import { useContext } from "react";

import { AppModeContext } from "../context/AppModeContext";

export function useAppMode() {
  const context = useContext(AppModeContext);

  if (!context) {
    throw new Error("useAppMode debe utilizarse dentro de AppModeProvider");
  }

  return context;
}

export default useAppMode;
