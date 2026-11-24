import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { OSM_ATTRIBUTION, OSM_TILES } from "./location";

export default function RouteMap({ origin, destination }) {
  const container = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    const map = L.map(container.current, { scrollWheelZoom: false });
    mapRef.current = map;
    L.tileLayer(OSM_TILES, { attribution: OSM_ATTRIBUTION, maxZoom: 19 }).addTo(map);
    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    layersRef.current.forEach((layer) => layer.remove());
    const start = L.circleMarker([origin.latitud, origin.longitud], {
      radius: 9,
      color: "#15803D",
      fillColor: "#22C55E",
      fillOpacity: 1,
      weight: 3,
    })
      .bindTooltip("Tu ubicación actual", { permanent: true, direction: "top" })
      .addTo(map);
    const end = L.circleMarker([destination.latitud, destination.longitud], {
      radius: 9,
      color: "#B91C1C",
      fillColor: "#EF4444",
      fillOpacity: 1,
      weight: 3,
    })
      .bindTooltip("Ubicación del cliente", { permanent: true, direction: "top" })
      .addTo(map);
    layersRef.current = [start, end];
    map.fitBounds(
      [
        [origin.latitud, origin.longitud],
        [destination.latitud, destination.longitud],
      ],
      { padding: [48, 48] },
    );
  }, [destination, origin]);

  return (
    <div
      ref={container}
      aria-label="Ruta desde tu ubicación hasta el cliente"
      style={{ height: 360, width: "100%", borderRadius: 12, isolation: "isolate" }}
    />
  );
}
