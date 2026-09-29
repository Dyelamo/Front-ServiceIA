import { api } from "../../../core/api/client";

export const getMyProfessionalProfileApi =
  async () => {
    const response = await api.get(
      "/prestadores/mi-perfil"
    );

    return response.data;
  };

export const registerProfessionalApi =
  async ({
    descripcion,
    categoria_ids,
    sobre_mi,
    especialidades,
  }) => {
    const payload = {
      descripcion:
        descripcion ?? sobre_mi,

      categoria_ids:
        categoria_ids ?? especialidades,
    };

    const response = await api.post(
      "/prestadores",
      payload
    );

    return response.data;
  };