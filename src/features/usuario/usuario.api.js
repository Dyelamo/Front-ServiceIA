import { api } from "../services/api";

export const getMyProfileApi = async () => {
  const response = await api.get("/usuarios/me");

  return response.data;
};

export const updateMyProfileApi = async (data) => {
  const response = await api.put("/usuarios/me", data);

  return response.data;
};

export const registerProfessionalApi = async ({ sobreMi, especialidades }) => {
  return updateMyProfileApi({
    sobre_mi: sobreMi,
    especialidades,
  });
};
