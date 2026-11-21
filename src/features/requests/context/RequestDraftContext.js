import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  clearStoredRequestDraft,
  getStoredRequestDraft,
  saveRequestDraft,
} from "../storage/request-draft.storage";

const RequestDraftContext = createContext(null);

const INITIAL_STATE = {
  description: "",
  categoryId: null,
  categoryName: "",
  urgency: "",
  urgencyLabel: "",
  location: "Valledupar, Cesar",
  city: "Valledupar",
  barrio: "Centro",
  address: "",
  reference: "",
  latitud: null,
  longitud: null,
  photos: [],
};

function createInitialState() {
  return { ...INITIAL_STATE, photos: [] };
}

function hasMeaningfulDraft(draft) {
  return Boolean(
    draft.description?.trim() ||
    draft.categoryId ||
    draft.urgency ||
    draft.address?.trim() ||
    draft.photos?.length,
  );
}

export function RequestDraftProvider({ children }) {
  const [draft, setDraft] = useState(createInitialState);
  const [isDraftLoading, setIsDraftLoading] = useState(true);
  const hydrated = useRef(false);

  useEffect(() => {
    let active = true;

    getStoredRequestDraft()
      .then((storedDraft) => {
        if (active && storedDraft) {
          setDraft({ ...createInitialState(), ...storedDraft });
        }
      })
      .catch((error) => {
        console.error("Error restaurando el borrador de la solicitud:", error);
      })
      .finally(() => {
        if (active) {
          hydrated.current = true;
          setIsDraftLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      const operation = hasMeaningfulDraft(draft)
        ? saveRequestDraft(draft)
        : clearStoredRequestDraft();

      operation.catch((error) => {
        console.error("Error guardando el borrador de la solicitud:", error);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [draft]);

  const updateDraft = useCallback((values) => {
    setDraft((current) => ({
      ...current,
      ...values,
    }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(createInitialState());
    clearStoredRequestDraft().catch((error) => {
      console.error("Error eliminando el borrador de la solicitud:", error);
    });
  }, []);

  const value = useMemo(
    () => ({
      draft,
      hasDraft: hasMeaningfulDraft(draft),
      isDraftLoading,
      updateDraft,
      resetDraft,
    }),
    [draft, isDraftLoading, resetDraft, updateDraft],
  );

  return <RequestDraftContext.Provider value={value}>{children}</RequestDraftContext.Provider>;
}

export function useRequestDraft() {
  const context = useContext(RequestDraftContext);

  if (!context) {
    throw new Error("useRequestDraft debe usarse dentro de RequestDraftProvider");
  }

  return context;
}
