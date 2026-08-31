import axios from "axios";

const baseURL =
  (typeof import.meta.env.VITE_API_URL === "string" &&
    import.meta.env.VITE_API_URL.trim()) ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fb_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s globally — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fb_token");
      localStorage.removeItem("fb_user");
    }
    return Promise.reject(error);
  }
);

export default api;