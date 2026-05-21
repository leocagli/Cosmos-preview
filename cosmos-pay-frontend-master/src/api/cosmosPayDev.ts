import { apiRequest } from "./client";

const BASE = "/cosmos-pay/dev";

export type CosmosPayApiKeyRow = {
  id: string;
  name: string;
  keyLast4: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export type CosmosPayApiKeyCreated = {
  id: string;
  name: string;
  secret: string;
  hint: string;
  createdAt: string;
};

export type CosmosPayPaymentLinkRow = {
  id: string;
  userId: string;
  apiKeyId: string | null;
  slug: string;
  title: string;
  description: string | null;
  amount: string;
  currency: string;
  status: "ACTIVE" | "ARCHIVED";
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  apiKey: { id: string; name: string } | null;
};

export type CreatePaymentLinkInput = {
  title: string;
  description?: string;
  amount: number;
  slug?: string;
  metadata?: Record<string, unknown>;
};

export type PatchPaymentLinkInput = {
  status?: "ACTIVE" | "ARCHIVED";
  title?: string;
  description?: string;
  amount?: number;
};

export function createCosmosPayApiKey(name: string) {
  return apiRequest<CosmosPayApiKeyCreated>(`${BASE}/api-keys`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function listCosmosPayApiKeys() {
  return apiRequest<CosmosPayApiKeyRow[]>(`${BASE}/api-keys`);
}

export function revokeCosmosPayApiKey(id: string) {
  return apiRequest<{ id: string; revokedAt: string | null }>(`${BASE}/api-keys/${id}/revoke`, {
    method: "POST",
  });
}

export function createCosmosPayPaymentLink(body: CreatePaymentLinkInput) {
  return apiRequest<CosmosPayPaymentLinkRow>(`${BASE}/payment-links`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function listCosmosPayPaymentLinks() {
  return apiRequest<CosmosPayPaymentLinkRow[]>(`${BASE}/payment-links`);
}

export function archiveCosmosPayPaymentLink(id: string) {
  return apiRequest<CosmosPayPaymentLinkRow>(`${BASE}/payment-links/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "ARCHIVED" }),
  });
}

export function patchCosmosPayPaymentLink(id: string, body: PatchPaymentLinkInput) {
  return apiRequest<CosmosPayPaymentLinkRow>(`${BASE}/payment-links/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export type PublicPaymentLinkMeta = {
  slug: string;
  title: string;
  description: string | null;
  amount: string;
  currency: string;
  createdAt: string;
};

export function getPublicPaymentLink(slug: string) {
  return apiRequest<PublicPaymentLinkMeta>(`/public/cosmos-pay/links/${slug}`, { skipAuth: true });
}
