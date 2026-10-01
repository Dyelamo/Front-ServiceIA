import {
  api,
} from "../../../core/api/client";

import {
  mapRequestsFromApi,
} from "../mappers/request.mapper";

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

export const fetchClientPublications =
  async () => {
    const { data } =
      await api.get(
        "/publicaciones/mis-publicaciones"
      );

    const list =
      getList(data);

    const mapped =
      mapRequestsFromApi(list);

    return mapped;
  };