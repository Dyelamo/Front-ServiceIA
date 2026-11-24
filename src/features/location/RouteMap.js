import React, { useMemo } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

import { OSM_ATTRIBUTION, OSM_TILES } from "./location";

export default function RouteMap({ origin, destination }) {
  const html = useMemo(() => {
    return `<!doctype html><html lang="es"><head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>html,body,#map{height:100%;margin:0}</style>
      </head><body><div id="map" aria-label="Ruta hasta el cliente"></div><script>
      const origin=${JSON.stringify(origin)};
      const destination=${JSON.stringify(destination)};
      const map=L.map('map');
      L.tileLayer(${JSON.stringify(OSM_TILES)},{maxZoom:19,attribution:${JSON.stringify(OSM_ATTRIBUTION)}}).addTo(map);
      L.circleMarker([origin.latitud,origin.longitud],{radius:9,color:'#15803D',fillColor:'#22C55E',fillOpacity:1,weight:3}).bindTooltip('Tu ubicación actual',{permanent:true,direction:'top'}).addTo(map);
      L.circleMarker([destination.latitud,destination.longitud],{radius:9,color:'#B91C1C',fillColor:'#EF4444',fillOpacity:1,weight:3}).bindTooltip('Ubicación del cliente',{permanent:true,direction:'top'}).addTo(map);
      map.fitBounds([[origin.latitud,origin.longitud],[destination.latitud,destination.longitud]],{padding:[48,48]});
      </script></body></html>`;
  }, [destination, origin]);

  return (
    <View style={{ height: 360, borderRadius: 12, overflow: "hidden" }}>
      <WebView source={{ html }} originWhitelist={["*"]} applicationNameForUserAgent="ServIA/1.0" />
    </View>
  );
}
