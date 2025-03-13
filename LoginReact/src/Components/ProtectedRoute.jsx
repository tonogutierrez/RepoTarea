import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); //Verifico si tiene token

  return token ? <Outlet /> : <Navigate to="/not-allowed" replace />;
};

export default ProtectedRoute;
