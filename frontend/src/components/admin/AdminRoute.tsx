import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../../store/adminAuthStore";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const isAdminAuthenticated = useAdminAuthStore((s) => s.isAdminAuthenticated);

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}