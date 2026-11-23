const http = require("node:http");

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const apiTarget = new URL(process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000");
const apiHostname = apiTarget.hostname === "localhost" ? "127.0.0.1" : apiTarget.hostname;
const defaultEnhanceMiddleware = config.server?.enhanceMiddleware;

config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware, metroServer) => {
    const defaultMiddleware = defaultEnhanceMiddleware
      ? defaultEnhanceMiddleware(metroMiddleware, metroServer)
      : metroMiddleware;

    return (request, response, next) => {
      if (!request.url?.startsWith("/api/")) {
        return defaultMiddleware(request, response, next);
      }

      const targetPath = request.url.replace(/^\/api/, "");
      const headers = { ...request.headers, host: apiTarget.host };
      delete headers.origin;

      const proxyRequest = http.request(
        {
          protocol: apiTarget.protocol,
          hostname: apiHostname,
          port: apiTarget.port,
          method: request.method,
          path: targetPath,
          headers,
        },
        (proxyResponse) => {
          response.writeHead(proxyResponse.statusCode || 502, proxyResponse.headers);
          proxyResponse.pipe(response);
        },
      );

      proxyRequest.on("error", (error) => {
        if (response.headersSent) {
          response.end();
          return;
        }
        response.writeHead(502, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify({ detail: `No fue posible conectar con el backend: ${error.message}` }),
        );
      });

      request.pipe(proxyRequest);
      return undefined;
    };
  },
};

module.exports = config;
