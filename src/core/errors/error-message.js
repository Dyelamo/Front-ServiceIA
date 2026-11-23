const STATUS_MESSAGES = {
  400: "La información enviada no es válida.",
  403: "No tienes permiso para realizar esta acción.",
  404: "No encontramos la información solicitada.",
  408: "La solicitud tardó demasiado. Intenta nuevamente.",
  409: "La operación entra en conflicto con el estado actual.",
  422: "Revisa los datos ingresados e intenta nuevamente.",
  429: "Has realizado demasiados intentos. Espera un momento.",
  500: "El servicio presenta un problema temporal.",
  502: "No pudimos comunicarnos con el servicio.",
  503: "El servicio no está disponible temporalmente.",
  504: "El servicio tardó demasiado en responder.",
};

export function getApiErrorMessage(error, fallback = "Ocurrió un error inesperado.") {
  if (!error?.response) {
    return "No pudimos conectarnos. Revisa tu conexión e intenta nuevamente.";
  }

  const detail = error.response.data?.detail ?? error.response.data?.message;

  if (typeof detail === "string" && detail.trim()) {
    return detail.trim();
  }

  if (Array.isArray(detail)) {
    const firstDetail = detail[0];

    if (typeof firstDetail === "string" && firstDetail.trim()) {
      return firstDetail.trim();
    }

    if (typeof firstDetail?.msg === "string" && firstDetail.msg.trim()) {
      return firstDetail.msg.trim();
    }
  }

  if (typeof detail?.msg === "string" && detail.msg.trim()) {
    return detail.msg.trim();
  }

  return STATUS_MESSAGES[error.response.status] || fallback;
}

export function shouldRetryRequest(failureCount, error) {
  const status = error?.response?.status;

  if (status && status < 500) {
    return false;
  }

  return failureCount < 2;
}

export function shouldShowGlobalError(error) {
  const status = error?.response?.status;
  return status !== 401 && status !== 404;
}
