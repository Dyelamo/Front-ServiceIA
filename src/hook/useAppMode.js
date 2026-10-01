// src/hook/useAppMode.js
import { useContext } from "react";
import { AppModeContext } from "../features/app-mode/context/AppModeContext";

export function useAppMode() {
  return useContext(AppModeContext);
}

export default useAppMode;
