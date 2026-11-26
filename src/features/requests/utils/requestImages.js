const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/+$/, "");

function normalizeUri(raw) {
  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  if (
    /^(https?:\/\/|data:image\/|file:\/\/|blob:|content:\/\/|ph:\/\/)/i.test(
      trimmed
    )
  ) {
    return trimmed;
  }

  if (trimmed.startsWith("/") && API_BASE_URL) {
    return `${API_BASE_URL}${trimmed}`;
  }

  return trimmed;
}

export function extractImageUri(item) {
  if (!item) {
    return null;
  }

  if (typeof item === "string") {
    return normalizeUri(item);
  }

  if (typeof item === "object") {
    const candidate =
      item.uri ||
      item.url ||
      item.imagen_url ||
      item.url_imagen ||
      item.publicUrl ||
      item.public_url ||
      item.image_url ||
      item.imageUrl ||
      item.src ||
      item.link ||
      item.path ||
      item.ruta;

    return normalizeUri(candidate);
  }

  return null;
}

export function isRemoteImageUrl(uri) {
  return typeof uri === "string" && /^https?:\/\//i.test(uri.trim());
}

function parseMaybeArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    const hasExplicitOrder = value.some(
      (item) =>
        item &&
        typeof item === "object" &&
        (typeof item.orden === "number" ||
          typeof item.order === "number" ||
          typeof item.posicion === "number")
    );

    if (!hasExplicitOrder) {
      return value;
    }

    return [...value].sort((a, b) => {
      const orderA = a?.orden ?? a?.order ?? a?.posicion ?? Number.MAX_SAFE_INTEGER;
      const orderB = b?.orden ?? b?.order ?? b?.posicion ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [trimmed];
      } catch {
        return [trimmed];
      }
    }

    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const inner = trimmed.slice(1, -1).trim();
      if (!inner) {
        return [];
      }
      return inner
        .split(",")
        .map((part) => part.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
    }

    return [trimmed];
  }

  if (typeof value === "object") {
    return [value];
  }

  return [];
}

export function getRequestImages(request) {
  if (!request || typeof request !== "object") {
    return [];
  }

  const rawLists = [
    request.imagenes,
    request.images,
    request.fotos,
    request.photos,
    request.publicacion_imagenes,
  ];

  const singles = [
    request.imagen_referencia,
    request.referenceImage,
    request.imagen_url,
    request.url_imagen,
    request.imageUrl,
    request.image_url,
    request.imagen,
  ];

  const normalized = [];
  const seen = new Set();

  const pushUnique = (value) => {
    const uri = extractImageUri(value);
    if (!uri || seen.has(uri)) {
      return;
    }
    seen.add(uri);
    normalized.push(uri);
  };

  for (const list of rawLists) {
    parseMaybeArray(list).forEach(pushUnique);
  }

  singles.forEach((item) => {
    parseMaybeArray(item).forEach(pushUnique);
  });

  return normalized;
}

export function getReferenceImage(request) {
  const images = getRequestImages(request);
  return images.length > 0 ? images[0] : null;
}
