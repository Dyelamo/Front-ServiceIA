export function formatCOP(value) {
  const number = Math.round(Number(value) || 0);

  return `$${number.toLocaleString("es-CO")}`;
}

export function formatDate(value, { month = "short" } = {}) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month,
    year: "numeric",
  });
}