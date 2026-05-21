import type { CosmosPayApiKeyRow, CosmosPayPaymentLinkRow } from "../../api/cosmosPayDev";

export function countRevokedKeys(keys: CosmosPayApiKeyRow[]): number {
  return keys.filter((k) => k.revokedAt != null).length;
}

export function countNeverUsedActiveKeys(keys: CosmosPayApiKeyRow[]): number {
  return keys.filter((k) => k.revokedAt == null && k.lastUsedAt == null).length;
}

export function avgActiveLinkAmount(links: CosmosPayPaymentLinkRow[]): number {
  const active = links.filter((l) => l.status === "ACTIVE");
  if (active.length === 0) return 0;
  let sum = 0;
  for (const l of active) {
    const n = Number.parseFloat(l.amount);
    if (Number.isFinite(n)) sum += n;
  }
  return sum / active.length;
}

export function linksCreatedInLastDays(links: CosmosPayPaymentLinkRow[], days: number): number {
  const cutoff = Date.now() - days * 86_400_000;
  return links.filter((l) => new Date(l.createdAt).getTime() >= cutoff).length;
}

export function maxActiveLinkAmount(links: CosmosPayPaymentLinkRow[]): number {
  let m = 0;
  for (const l of links) {
    if (l.status !== "ACTIVE") continue;
    const n = Number.parseFloat(l.amount);
    if (Number.isFinite(n) && n > m) m = n;
  }
  return m;
}

export type DailyCount = { iso: string; count: number; label: string };

/** Últimos `days` días calendario; cuenta links cuyo createdAt cae en cada día (UTC date). */
export function dailyLinkCreation(
  links: CosmosPayPaymentLinkRow[],
  days: number,
  locale: string,
): DailyCount[] {
  const now = new Date();
  const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const out: DailyCount[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const t = utcMidnight - i * 86_400_000;
    const d = new Date(t);
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString(locale, { month: "short", day: "numeric" });
    out.push({ iso, count: 0, label });
  }
  const set = new Map(out.map((x) => [x.iso, x] as const));
  for (const link of links) {
    const iso = new Date(link.createdAt).toISOString().slice(0, 10);
    const row = set.get(iso);
    if (row) row.count += 1;
  }
  return out;
}
