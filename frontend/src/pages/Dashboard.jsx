import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!user) return <Navigate to="/" />;

  console.log("👤 Usuario autenticado:", user);

  return (
    <div>
      <h1>Bienvenido, {user.name || "usuario"} 👋</h1>
      <p>Tu email: {user.email || "No disponible"}</p>
      <a href="/auth/logout">Cerrar sesión</a>
    </div>
  );
};

export default Dashboard;
