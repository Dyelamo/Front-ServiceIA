// src/utils/format.js

/**
 * Formatea un número como pesos colombianos: 306000 -> "$306.000"
 */
export function formatCOP(value) {
  const number = Math.round(Number(value) || 0);
  return `$${number.toLocaleString('es-CO')}`;
}

/**
 * Trunca un texto a cierta longitud agregando "..."
 */
export function truncate(text = '', max = 90) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export default { formatCOP, truncate };
