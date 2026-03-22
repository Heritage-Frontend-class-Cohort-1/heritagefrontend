// src/pages/admin/PrivateAdminroute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/Admin/login" replace />;
  return children;
};

export default PrivateAdminRoute;