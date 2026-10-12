import { api } from "../../../core/api/client";

export const getMyProfessionalProfileApi = async () => {
  const { data } = await api.get("/prestadores/mi-perfil");

  return data;
};

export const registerProfessionalApi = async ({
  descripcion,
  categoria_ids,
}) => {
  const { data } = await api.post("/prestadores", {
    descripcion,
    categoria_ids,
  });

  return data;
};
