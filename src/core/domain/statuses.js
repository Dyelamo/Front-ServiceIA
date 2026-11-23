export const PUBLICATION_STATUS = {
  active: "activo",
  agreed: "acuerdo",
  inProgress: "en_progreso",
  awaitingConfirmation: "pendiente_confirmacion",
  completed: "terminado",
  cancelled: "cancelado",
  expired: "expirado",
  disputed: "en_disputa",
};

export const PUBLICATION_STATUS_LABELS = {
  activo: "Activa",
  acuerdo: "Acuerdo alcanzado",
  en_progreso: "En progreso",
  pendiente_confirmacion: "Pendiente de confirmación",
  terminado: "Completada",
  cancelado: "Cancelada",
  expirado: "Expirada",
  en_disputa: "En disputa",
};

export const OFFER_STATUS = {
  pending: "pendiente",
  accepted: "aceptada",
  rejected: "rechazada",
  waiting: "en_espera",
  withdrawn: "retirada",
};

export const OFFER_STATUS_LABELS = {
  pendiente: "Pendiente",
  aceptada: "Aceptada",
  aceptado: "Aceptada",
  rechazada: "Rechazada",
  rechazado: "Rechazada",
  en_espera: "Profesional ocupado",
  retirada: "Retirada",
};

export const ACTIVE_JOB_STATUSES = new Set([
  PUBLICATION_STATUS.agreed,
  PUBLICATION_STATUS.inProgress,
  PUBLICATION_STATUS.awaitingConfirmation,
]);

export const canWithdrawOffer = (status) =>
  status === OFFER_STATUS.pending || status === OFFER_STATUS.waiting;

export const canCancelPublication = (status) =>
  status === PUBLICATION_STATUS.active || ACTIVE_JOB_STATUSES.has(status);
