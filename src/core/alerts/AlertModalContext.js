import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import AlertModal from "../../shared/ui/AlertModal";

const AlertModalContext = createContext(null);

const INITIAL_STATE = {
  visible: false,
  title: "",
  message: "",
  variant: "info",
  confirmLabel: "Entendido",
  cancelLabel: undefined,
  confirmVariant: "primary",
  dismissible: true,
  onConfirm: undefined,
  onCancel: undefined,
};

export function AlertModalProvider({ children }) {
  const [modalState, setModalState] = useState(INITIAL_STATE);

  const hideAlert = useCallback(() => {
    setModalState((current) => ({ ...current, visible: false }));
  }, []);

  const showAlert = useCallback((options) => {
    setModalState({
      visible: true,
      title: options?.title || "",
      message: options?.message || "",
      variant: options?.variant || "info",
      confirmLabel: options?.confirmLabel || "Entendido",
      cancelLabel: options?.cancelLabel,
      confirmVariant: options?.confirmVariant || "primary",
      dismissible: options?.dismissible ?? true,
      onConfirm: options?.onConfirm,
      onCancel: options?.onCancel,
    });
  }, []);

  const showConfirm = useCallback((options) => {
    setModalState({
      visible: true,
      title: options?.title || "",
      message: options?.message || "",
      variant: options?.variant || "warning",
      confirmLabel: options?.confirmLabel || "Confirmar",
      cancelLabel: options?.cancelLabel || "Volver",
      confirmVariant: options?.confirmVariant || "primary",
      dismissible: options?.dismissible ?? true,
      onConfirm: options?.onConfirm,
      onCancel: options?.onCancel,
    });
  }, []);

  const handleClose = useCallback(() => {
    const cancelHandler = modalState.onCancel;
    hideAlert();
    if (cancelHandler) {
      cancelHandler();
    }
  }, [hideAlert, modalState.onCancel]);

  const handleConfirm = useCallback(() => {
    const confirmHandler = modalState.onConfirm;
    hideAlert();
    if (confirmHandler) {
      confirmHandler();
    }
  }, [hideAlert, modalState.onConfirm]);

  const value = useMemo(
    () => ({ showAlert, showConfirm, hideAlert }),
    [showAlert, showConfirm, hideAlert],
  );

  return (
    <AlertModalContext.Provider value={value}>
      {children}
      <AlertModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        variant={modalState.variant}
        confirmLabel={modalState.confirmLabel}
        cancelLabel={modalState.cancelLabel}
        confirmVariant={modalState.confirmVariant}
        dismissible={modalState.dismissible}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    </AlertModalContext.Provider>
  );
}

export function useAlertModal() {
  const context = useContext(AlertModalContext);

  if (!context) {
    throw new Error("useAlertModal debe utilizarse dentro de AlertModalProvider");
  }

  return context;
}
