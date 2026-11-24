import { api } from "../../core/api/client";
import { currentPoint } from "./location";

const MAX_AGE_MS = 60_000;
let lastSyncAt = 0;
let pendingSync = null;

export async function syncProviderCurrentLocation({ force = false } = {}) {
  if (!force && Date.now() - lastSyncAt < MAX_AGE_MS) return null;
  if (pendingSync) return pendingSync;

  pendingSync = (async () => {
    const point = await currentPoint();
    const { data } = await api.put("/prestadores/mi-ubicacion", {
      ...point,
      direccion: "Ubicación actual del dispositivo",
    });
    lastSyncAt = Date.now();
    return data;
  })();

  try {
    return await pendingSync;
  } finally {
    pendingSync = null;
  }
}
