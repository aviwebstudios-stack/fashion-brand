import { create } from "zustand";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
}

interface AdminAuthState {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  setAdminAuth: (user: AdminUser, token: string) => void;
  adminLogout: () => void;
  loadAdminFromStorage: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  adminUser: null,
  adminToken: null,
  isAdminAuthenticated: false,

  setAdminAuth: (user, token) => {
    localStorage.setItem("fb_admin_token", token);
    localStorage.setItem("fb_admin_user", JSON.stringify(user));
    set({ adminUser: user, adminToken: token, isAdminAuthenticated: true });
  },

  adminLogout: () => {
    localStorage.removeItem("fb_admin_token");
    localStorage.removeItem("fb_admin_user");
    set({ adminUser: null, adminToken: null, isAdminAuthenticated: false });
  },

  loadAdminFromStorage: () => {
    const token = localStorage.getItem("fb_admin_token");
    const userStr = localStorage.getItem("fb_admin_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ adminUser: user, adminToken: token, isAdminAuthenticated: true });
      } catch {
        localStorage.removeItem("fb_admin_token");
        localStorage.removeItem("fb_admin_user");
      }
    }
  },
}));