import { useAuth } from "@/features/auth/hook/useAuth";
import React from "react";
import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // User is authenticated and has required role (if any)
  return children;
};

export default ProtectedRoute;
