import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[40vh] w-full max-w-[1200px] mx-auto px-6 py-10">
        <div className="skeleton-shimmer rounded-lg h-8 w-48 bg-cosmos-surface-elevated mb-6" aria-hidden />
        <div className="space-y-4">
          <div className="skeleton-shimmer rounded-lg h-12 w-full bg-cosmos-surface-elevated" aria-hidden />
          <div className="skeleton-shimmer rounded-lg h-12 w-full bg-cosmos-surface-elevated" aria-hidden />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
