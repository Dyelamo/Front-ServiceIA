export function formatCOP(
  value
) {
  const number =
    Math.round(
      Number(value) || 0
    );

  return `$${number.toLocaleString(
    "es-CO"
  )}`;
}