import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center text-primary font-semibold tracking-widest">
    AUTHENTICATING...
  </div>
);

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <RouteLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
};
