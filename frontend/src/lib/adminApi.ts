import axios from "axios";

const baseURL =
  (typeof import.meta.env.VITE_API_URL === "string" &&
    import.meta.env.VITE_API_URL.trim()) ||
  "http://localhost:5000/api";

const adminApi = axios.create({
  baseURL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("fb_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fb_admin_token");
      localStorage.removeItem("fb_admin_user");
      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
