import { api } from "../../../core/api/client";

import {
  adaptServiceToBackend,
  adaptServiceToFrontend,
} from "../../services/services.schema";

export const createServiceApi =
  async (serviceData) => {
    const payload =
      adaptServiceToBackend(serviceData);

    const response = await api.post(
      "/",
      payload
    );

    return adaptServiceToFrontend(
      response.data
    );
  };

export const updateServiceApi =
  async (
    id,
    serviceData
  ) => {
    const payload =
      adaptServiceToBackend(serviceData);

    const response = await api.put(
      `/${id}`,
      payload
    );

    return adaptServiceToFrontend(
      response.data
    );
  };

export const publishServiceApi =
  async (id) => {
    const response = await api.patch(
      `/${id}/publicar`,
      {}
    );

    return adaptServiceToFrontend(
      response.data
    );
  };

export const deleteServiceApi =
  async (id) => {
    const response = await api.delete(
      `/${id}`
    );

    return response.data;
  };