import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { hasPoint, OSM_ATTRIBUTION, OSM_TILES, VALLEDUPAR } from "./location";

export default function LocationMap({ point, onSelect }) {
  const container = useRef(null);
  const mapRef = useRef(null);
  const marker = useRef(null);
  const onSelectRef = useRef(onSelect);
  const latitud = point?.latitud;
  const longitud = point?.longitud;

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const map = L.map(container.current, { scrollWheelZoom: false }).setView(VALLEDUPAR, 13);
    mapRef.current = map;
    L.tileLayer(OSM_TILES, { attribution: OSM_ATTRIBUTION, maxZoom: 19 }).addTo(map);
    map.on("click", ({ latlng }) => {
      const normalized = latlng.wrap();
      onSelectRef.current({ latitud: normalized.lat, longitud: normalized.lng });
    });
    return () => {
      map.remove();
      mapRef.current = null;
      marker.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!hasPoint({ latitud, longitud })) {
      marker.current?.remove();
      marker.current = null;
      return;
    }
    const latlng = [latitud, longitud];
    if (marker.current) marker.current.setLatLng(latlng);
    else marker.current = L.circleMarker(latlng, { radius: 9, fillOpacity: 0.85 }).addTo(map);
    map.setView(latlng, Math.max(map.getZoom(), 16));
  }, [latitud, longitud]);

  return (
    <div
      ref={container}
      aria-label="Mapa de ubicación"
      style={{ height: 260, width: "100%", borderRadius: 12, isolation: "isolate" }}
    />
  );
}
