import { Platform } from "react-native";
import * as Location from "expo-location";

import { api } from "../../core/api/client";

export const VALLEDUPAR = [10.4742, -73.2436];
export const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

export function hasPoint(point) {
  return (
    Number.isFinite(point?.latitud) &&
    Math.abs(point.latitud) <= 90 &&
    Number.isFinite(point?.longitud) &&
    Math.abs(point.longitud) <= 180
  );
}

export async function currentPoint() {
  if (Platform.OS === "web") {
    return new Promise((resolve, reject) => {
      if (!globalThis.navigator?.geolocation) {
        reject(new Error("Ubicación no disponible en este navegador."));
        return;
      }
      globalThis.navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve({ latitud: coords.latitude, longitud: coords.longitude }),
        reject,
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
      );
    });
  }
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) throw new Error("Permiso de ubicación no concedido.");
  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return { latitud: coords.latitude, longitud: coords.longitude };
}

export async function lookupAddress(point) {
  if (Platform.OS === "web") {
    const { data } = await api.post("/ubicaciones/direccion", point, { timeout: 32_000 });
    return data;
  }
  const [result] = await Location.reverseGeocodeAsync({
    latitude: point.latitud,
    longitude: point.longitud,
  });
  return {
    direccion: [result?.street, result?.streetNumber].filter(Boolean).join(" "),
    barrio: result?.district,
    ciudad: result?.city || result?.subregion,
  };
}

export function formatDistance(km) {
  if (!Number.isFinite(km)) return "Distancia no disponible";
  if (km < 0.1) return "A menos de 100 m";
  const distance = km < 1 ? `${Math.round(km * 1000)} m` : `${String(km).replace(".", ",")} km`;
  return `Aprox. ${distance}`;
}

export function publicationDistance(request) {
  if (Number.isFinite(request.distanceKm)) return formatDistance(request.distanceKm);
  if (request.providerHasPoint === false) return "Activa tu ubicación para calcularla";
  if (request.requestHasPoint === false) return "La solicitud aún no tiene un punto en el mapa";
  return formatDistance(null);
}
