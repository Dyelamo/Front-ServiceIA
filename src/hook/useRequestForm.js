// src/hook/useRequestForm.js
import { useContext } from 'react';
import { RequestFormContext } from '../lib/RequestFormContext';

export function useRequestForm() {
  return useContext(RequestFormContext);
}

export default useRequestForm;
