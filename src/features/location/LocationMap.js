import React, { useEffect, useRef } from "react";
import { Linking, View } from "react-native";
import { WebView } from "react-native-webview";

import { hasPoint, OSM_ATTRIBUTION, OSM_TILES, VALLEDUPAR } from "./location";

const COPYRIGHT_URL = "https://www.openstreetmap.org/copyright";
const MAP_SOURCE = {
  html: `<!doctype html><html lang="es"><head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <style>html,body,#map{height:100%;margin:0}</style>
  </head><body><div id="map" aria-label="Mapa de ubicación"></div><script>
  const map = L.map('map').setView(${JSON.stringify(VALLEDUPAR)}, 13);
  L.tileLayer(${JSON.stringify(OSM_TILES)}, {
    maxZoom: 19, attribution: ${JSON.stringify(OSM_ATTRIBUTION)}
  }).addTo(map);
  let marker;
  window.showPoint = (point) => {
    if (!point) {
      if (marker) marker.remove();
      marker = null;
      return;
    }
    const latlng = [point.latitud, point.longitud];
    if (marker) marker.setLatLng(latlng);
    else marker = L.circleMarker(latlng, {radius:9, fillOpacity:0.85}).addTo(map);
    map.setView(latlng, Math.max(map.getZoom(), 16));
  };
  map.on('click', ({latlng}) => {
    const point = latlng.wrap();
    window.ReactNativeWebView.postMessage(JSON.stringify({latitud:point.lat,longitud:point.lng}));
  });
  document.addEventListener('click', (event) => {
    if (event.target.closest('a[href="${COPYRIGHT_URL}"]')) {
      event.preventDefault();
      window.ReactNativeWebView.postMessage('copyright');
    }
  });
  </script></body></html>`,
};

export default function LocationMap({ point, onSelect }) {
  const webView = useRef(null);
  const latitud = point?.latitud;
  const longitud = point?.longitud;
  const coords = { latitud, longitud };
  const pointScript = `window.showPoint?.(${JSON.stringify(hasPoint(coords) ? coords : null)}); true;`;

  useEffect(() => {
    webView.current?.injectJavaScript(pointScript);
  }, [pointScript]);

  function handleMessage({ nativeEvent }) {
    if (nativeEvent.data === "copyright") {
      Linking.openURL(COPYRIGHT_URL).catch(() => {});
      return;
    }
    try {
      const selected = JSON.parse(nativeEvent.data);
      if (hasPoint(selected)) onSelect(selected);
    } catch {
      // Only coordinates and the attribution action are supported.
    }
  }

  return (
    <View style={{ height: 260, borderRadius: 12, overflow: "hidden" }}>
      <WebView
        ref={webView}
        source={MAP_SOURCE}
        originWhitelist={["*"]}
        onShouldStartLoadWithRequest={({ url }) => url === "about:blank"}
        applicationNameForUserAgent="ServIA/1.0"
        onMessage={handleMessage}
        onLoadEnd={() => webView.current?.injectJavaScript(pointScript)}
      />
    </View>
  );
}
