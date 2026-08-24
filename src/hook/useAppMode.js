// src/hook/useAppMode.js
import { useContext } from 'react';
import { AppModeContext } from '../lib/AppModeContext';

export function useAppMode() {
  return useContext(AppModeContext);
}

export default useAppMode;
