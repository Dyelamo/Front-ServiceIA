// src/lib/RequestFormContext.js
import React, { createContext, useMemo, useState } from 'react';

const initialState = {
  description: '',
  categoryId: null,
  location: {
    city: 'Valledupar, Cesar',
    country: 'Colombia',
  },
  urgencyId: null,
  photos: [], // simulado, no se sube ningún archivo real
};

export const RequestFormContext = createContext({
  form: initialState,
  updateForm: () => {},
  resetForm: () => {},
});

export function RequestFormProvider({ children }) {
  const [form, setForm] = useState(initialState);

  const updateForm = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const resetForm = () => setForm(initialState);

  const value = useMemo(() => ({ form, updateForm, resetForm }), [form]);

  return (
    <RequestFormContext.Provider value={value}>
      {children}
    </RequestFormContext.Provider>
  );
}

export default RequestFormContext;
