// src/pages/admin/PrivateSuperAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateSuperAdminRoute = ({ children }) => {
  const token = localStorage.getItem("superAdminToken");

  if (!token) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return children;
};

export default PrivateSuperAdminRoute;