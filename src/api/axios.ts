import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const get = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url);

  return response.data;
};

export const post = async <T, D = unknown>(
  url: string,
  data?: D,
): Promise<T> => {
  const response = await api.post<T>(url, data);

  return response.data;
};

export const put = async <T, D = unknown>(
  url: string,
  data?: D,
): Promise<T> => {
  const response = await api.put<T>(url, data);

  return response.data;
};

export const patch = async <T, D = unknown>(
  url: string,
  data?: D,
): Promise<T> => {
  const response = await api.patch<T>(url, data);

  return response.data;
};

export const remove = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url);

  return response.data;
};

export default api;
