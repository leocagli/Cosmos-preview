import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEFAULT_LOGGED_IN_REDIRECT = "/panel/developers/cosmos-pay";

/**
 * Solo renderiza rutas hijas si no hay sesión. Si ya está autenticado, redirige al panel (mismo criterio que tras login/registro).
 */
export function GuestRoute({ redirectTo = DEFAULT_LOGGED_IN_REDIRECT }: { redirectTo?: string }) {
  const { isLoggedIn, loading } = useAuth();

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

  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
