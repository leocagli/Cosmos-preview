import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import type { AuthUser } from "../api/auth";

type AuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  loading: boolean;
  setUser: (u: AuthUser | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? authApi.getAccessToken() : null;
    if (!token) {
      setUserState(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUserState(me);
      localStorage.setItem("cosmospay_logged_in", "true");
    } catch {
      authApi.logoutLocal();
      setUserState(null);
      localStorage.removeItem("cosmospay_logged_in");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authApi.getAccessToken()) {
      void refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
  }, []);

  const logout = useCallback(() => {
    authApi.logoutLocal();
    setUserState(null);
    localStorage.removeItem("cosmospay_logged_in");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        loading,
        setUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
