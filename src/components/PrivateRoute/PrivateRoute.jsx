import React from "react";
import useAuth from "../../contexts/useAuth";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // ⏳ prevent premature redirect

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
