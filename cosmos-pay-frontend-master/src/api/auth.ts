import { apiRequest, clearStoredTokens, setTokens, getAccessToken } from "./client";

export { getAccessToken, clearStoredTokens };

export type UserRoleBackend = "USER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string | null;
  role: UserRoleBackend;
  country: string;
  providers: string[];
  /** Vacío hasta backend actualizado; siempre presente tras /auth/me reciente */
  walletAddresses?: string[];
  createdAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type AuthResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};

export async function register(data: {
  email: string;
  password: string;
  country?: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setTokens(res.tokens.accessToken, res.tokens.refreshToken);
  return res;
}

export async function login(data: { email: string; password: string }): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setTokens(res.tokens.accessToken, res.tokens.refreshToken);
  return res;
}

export async function googleAuth(data: { idToken: string; country?: string }): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setTokens(res.tokens.accessToken, res.tokens.refreshToken);
  return res;
}

export async function getWalletNonce(address: string): Promise<{ address: string; nonce: string; message: string }> {
  const q = new URLSearchParams({ address });
  return apiRequest(`/auth/wallet/nonce?${q.toString()}`, { skipAuth: true });
}

export async function walletVerify(data: {
  address: string;
  signature: string;
  country?: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/auth/wallet/verify", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
  setTokens(res.tokens.accessToken, res.tokens.refreshToken);
  return res;
}

export async function me(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me");
}

/** Vincular wallet firmada a la sesión actual (usuario ya autenticado). */
export async function linkWallet(data: { address: string; signature: string }): Promise<{
  message: string;
  user: AuthUser;
}> {
  return apiRequest("/auth/wallet/link", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logoutLocal() {
  clearStoredTokens();
}
