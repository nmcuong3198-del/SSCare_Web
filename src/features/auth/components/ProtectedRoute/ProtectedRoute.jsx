import { Navigate, Outlet, useLocation } from "react-router-dom";

import authService from "@/features/auth/services/authService";

export default function ProtectedRoute({ roles = [] }) {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !authService.hasAnyRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}