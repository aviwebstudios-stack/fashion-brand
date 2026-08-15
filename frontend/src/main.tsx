import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { useAuthStore } from "./store/authStore";
import { usePanelStore } from "./store/panelStore";
import api from "./lib/api";
import { useAdminAuthStore } from "./store/adminAuthStore";

useAuthStore.getState().loadFromStorage();
useAdminAuthStore.getState().loadAdminFromStorage();

const token = localStorage.getItem("fb_token");
if (token) {
  api.get("/cart").then((res) => {
    usePanelStore.getState().setCartCount(res.data.data?.items?.length || 0);
  }).catch(() => {});
}

createRoot(document.getElementById("root")!).render(<App />);