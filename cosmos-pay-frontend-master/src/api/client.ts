import i18n from "../i18n";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

const ACCESS = "cosmospay_access_token";
const REFRESH = "cosmospay_refresh_token";

export type ApiError = { status: number; message: string; detail?: unknown };

export function getErrorMessage(err: unknown, fallback?: string): string {
  const genericFallback = fallback ?? i18n.t("api.genericError");
  if (err == null) return genericFallback;
  if (err instanceof Error) {
    const msg = err.message || genericFallback;
    if (/failed to fetch|network error|load failed/i.test(msg)) {
      return i18n.t("api.networkError");
    }
    return msg;
  }
  const o = err as Record<string, unknown>;
  if (typeof o.message === "string") return o.message;
  if (Array.isArray(o.message)) return (o.message[0] as string) ?? genericFallback;
  if (typeof o.error === "string") return o.error;
  if (typeof o.statusText === "string") return o.statusText;
  return genericFallback;
}

function getStoredToken(): string | null {
  return localStorage.getItem(ACCESS);
}

function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH);
}

function setStoredTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS, access);
  localStorage.setItem(REFRESH, refresh);
}

export function clearStoredTokens() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}

export function clearSessionLocally() {
  clearStoredTokens();
  localStorage.removeItem("cosmospay_logged_in");
}

export function getAccessToken(): string | null {
  return getStoredToken();
}

export function setTokens(access: string, refresh: string) {
  setStoredTokens(access, refresh);
}

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getStoredRefreshToken();
  if (!refresh) return null;
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(
        `${BASE_URL.startsWith("http") ? BASE_URL : `${window.location.origin}${BASE_URL}`}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refresh }),
        }
      );
      if (!res.ok) {
        clearStoredTokens();
        return null;
      }
      const body = await res.json();
      const payload = body?.data ?? body;
      const access = payload.accessToken as string | undefined;
      const newRefresh = payload.refreshToken as string | undefined;
      if (access) {
        setStoredTokens(access, newRefresh ?? refresh);
        return access;
      }
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const base = BASE_URL.startsWith("http") ? BASE_URL : `${origin}${BASE_URL}`;
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const doRequest = async (token: string | null): Promise<Response> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };
    if (token && !skipAuth) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    return fetch(url, { ...fetchOptions, headers });
  };

  let res = await doRequest(skipAuth ? null : getStoredToken());

  if (res.status === 401 && !skipAuth && getStoredRefreshToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) res = await doRequest(newToken);
  }

  if (!res.ok) {
    let message = res.statusText;
    let detail: unknown;
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
      detail = body;
    } catch {
      /* ignore */
    }
    if (res.status === 401 && !skipAuth) {
      clearSessionLocally();
    }
    const err: ApiError = { status: res.status, message, detail };
    throw err;
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const body = await res.json();
    if (body != null && typeof body === "object" && "data" in body && body.data !== undefined) {
      return body.data as T;
    }
    return body as T;
  }
  return res.text() as Promise<T>;
}
