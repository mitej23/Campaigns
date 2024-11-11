import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const { user } = useAuth();
  return user ? <Navigate to={"/dashboard"} /> : <Outlet />;
};

export default AuthRoutes;
