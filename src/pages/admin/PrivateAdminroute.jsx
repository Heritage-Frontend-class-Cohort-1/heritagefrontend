// const PrivateAdminRoute = ({ children }) => {
//   // TEMPORARY: allow access without backend/auth
//   return children;
// };

// export default PrivateAdminRoute;


// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
