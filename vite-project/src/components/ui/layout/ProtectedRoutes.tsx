import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user } = useAuth();
  console.log(user);
  return user ? <Outlet /> : <Navigate to={"/login"} />;
};

export default ProtectedRoutes;
