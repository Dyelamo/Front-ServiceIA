import { api } from "./api";

export const loginApi = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    return response.data;
};

export const registerApi = async (userData) => {
    const response = await api.post("/auth/register", userData);

    return response.data;
};

export const refreshTokenApi = async (refreshToken) => {
    const response = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
    });

    return response.data;
};