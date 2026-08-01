import React from "react";
import { Navigate } from "react-router";
import { useChatStore } from "./store";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Read auth token from our global memory store registry
  const isAuthenticated = useChatStore((state) => state.isAuthenticated);

  // If unauthorized, redirect to login page immediately (Replaces canActivate return false)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If verified, cleanly pass execution down to let components render
  return children;
};
