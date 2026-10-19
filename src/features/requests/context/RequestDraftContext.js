import React, {
  createContext,
  useContext,
  useState,
} from "react";

const RequestDraftContext =
  createContext(null);

const INITIAL_STATE = {
  description: "",
  categoryId: null,
  categoryName: "",
  urgency: "",
  urgencyLabel: "",
  location: "Valledupar, Cesar",
  address: "",
  reference: "",
  photos: [],
};

export function RequestDraftProvider({
  children,
}) {
  const [draft, setDraft] =
    useState(INITIAL_STATE);

  const updateDraft = (values) => {
    setDraft((current) => ({
      ...current,
      ...values,
    }));
  };

  const resetDraft = () => {
    setDraft(INITIAL_STATE);
  };

  return (
    <RequestDraftContext.Provider
      value={{
        draft,
        updateDraft,
        resetDraft,
      }}
    >
      {children}
    </RequestDraftContext.Provider>
  );
}

export function useRequestDraft() {
  const context =
    useContext(RequestDraftContext);

  if (!context) {
    throw new Error(
      "useRequestDraft debe usarse dentro de RequestDraftProvider"
    );
  }

  return context;
}