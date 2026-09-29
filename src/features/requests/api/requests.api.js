import { api } from "../../../core/api/client";

const getList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  return (
    data?.results ||
    data?.items ||
    data?.data ||
    []
  );
};

export const createServiceRequest =
  async (payload) => {
    const body = {
      descripcion:
        payload.description,

      categoria_id:
        payload.categoryId,

      urgencia:
        payload.urgencyLabel,
    };

    const { data } = await api.post(
      "/publicaciones",
      body
    );

    return {
      apiData: data,

      description:
        payload.description,

      category:
        payload.categoryLabel,

      serviceType:
        "Servicio general",

      urgency:
        payload.urgencyLabel,

      presentialVisit: true,

      location:
        payload.location,

      followUpQuestions: [
        "¿Cuándo notaste el problema por primera vez?",
        "¿Tienes fotos adicionales del área afectada?",
      ],
    };
  };

export const fetchClientPublications =
  async () => {
    const { data } = await api.get(
      "/publicaciones/mis-publicaciones"
    );

    return getList(data);
  };

export const fetchProfessionalPublications =
  async () => {
    const { data } = await api.get(
      "/publicaciones/categorias-prestador"
    );

    return getList(data);
  };