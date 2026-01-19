import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const api = axios.create({
  baseURL: API,
});

export function getAxiosErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data: any = error.response?.data;
    const msg = data?.message ?? data?.error ?? error.message;
    return Array.isArray(msg) ? msg.join(", ") : String(msg);
  }
  return "Something went wrong";
}

// ✅ attach token automatically (localStorage)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
