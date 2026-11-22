import { api } from "../../../core/api/client";
import { fetchProviderJobs } from "../../jobs/api/jobs.api";

/**
 * Obtiene el balance financiero del prestador:
 * - saldo_disponible (recargado para comisiones)
 * - total_facturado_estimado (suma de precios acordados en trabajos completados)
 * - tarifa_porcentaje (7%)
 * - total_comision (7% de lo facturado estimado)
 * - trabajos (movimientos recientes)
 */
export const fetchProviderBalance = async () => {
  try {
    const { data } = await api.get("/prestadores/mi-saldo");
    return data;
  } catch (error) {
    console.warn("Fallo al obtener mi-saldo del endpoint, calculando desde trabajos completados:", error);
    // Fallback: calcular balance a partir del historial real de trabajos completados
    const completados = await fetchProviderJobs("completados");
    const totalEstimado = completados.reduce(
      (sum, job) => sum + (Number(job.price || job.precio_ofertado) || 0),
      0
    );
    const tarifaPorcentaje = 7.0;
    const totalComision = Math.round(totalEstimado * 0.07);

    const trabajos = completados.map((job) => {
      const price = Number(job.price || job.precio_ofertado) || 0;
      return {
        id: job.id,
        title: job.title || job.description || "Servicio completado",
        client: job.client || job.cliente?.nombre_completo || "Cliente",
        date: job.updated_at || job.created_at,
        amount: price,
        commission: Math.round(price * 0.07),
      };
    });

    return {
      saldo_disponible: 0,
      total_facturado_estimado: totalEstimado,
      tarifa_porcentaje: tarifaPorcentaje,
      total_comision: totalComision,
      trabajos,
      mensaje:
        "Estimado según los acuerdos pactados en la plataforma. Los pagos se realizan directamente entre cliente y profesional.",
    };
  }
};

/**
 * Recarga el saldo de la cuenta del prestador para comisiones
 */
export const rechargeBalance = async (monto) => {
  const { data } = await api.post("/prestadores/recargar-saldo", { monto });
  return data;
};
