import { api } from "../../../../src/core/api/client";
import { Platform } from "react-native";

export const getMyProfileApi = async () => {
  const response = await api.get("/usuarios/me");

  return response.data;
};

export const updateMyProfileApi = async (data) => {
  const response = await api.put("/usuarios/me", data);

  return response.data;
};

export const uploadMyProfilePhotoApi = async (asset) => {
  const form = new FormData();
  const type = asset.mimeType || "image/jpeg";
  const extension = type.split("/")[1] || "jpg";
  const name = asset.fileName || `foto-perfil.${extension}`;

  if (Platform.OS === "web") {
    const blob = await fetch(asset.uri).then((response) => response.blob());
    form.append("file", blob, name);
  } else {
    form.append("file", {
      uri: asset.uri,
      name,
      type,
    });
  }

  const response = await api.post("/usuarios/me/foto-perfil", form, {
    timeout: 60000,
  });

  return response.data;
};

export const deactivateMyAccountApi = async () => {
  const response = await api.delete("/usuarios/me");

  return response.data;
};
