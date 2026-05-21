import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Archive,
  Award,
  Ban,
  CalendarDays,
  CircleOff,
  KeyRound,
  Link2,
  RefreshCw,
  Sigma,
  Wallet,
} from "lucide-react";
import {
  listCosmosPayApiKeys,
  listCosmosPayPaymentLinks,
  type CosmosPayApiKeyRow,
  type CosmosPayPaymentLinkRow,
} from "../../api/cosmosPayDev";
import { getErrorMessage } from "../../api/client";
import { CosmosPayDevActivityChart, CosmosPayDevStatusChart } from "./CosmosPayDevOverviewCharts";
import {
  avgActiveLinkAmount,
  countNeverUsedActiveKeys,
  countRevokedKeys,
  dailyLinkCreation,
  linksCreatedInLastDays,
  maxActiveLinkAmount,
} from "./cosmosPayOverviewAnalytics";
import { PANEL_SURFACE_CARD_CLASS, PANEL_SURFACE_SECTION_CLASS } from "../panel/panelLayout";

function sumActiveUsdc(links: CosmosPayPaymentLinkRow[]): number {
  return links
    .filter((l) => l.status === "ACTIVE")
    .reduce((acc, l) => {
      const n = Number.parseFloat(l.amount);
      return acc + (Number.isFinite(n) ? n : 0);
    }, 0);
}

function countActiveKeys(keys: CosmosPayApiKeyRow[]): number {
  return keys.filter((k) => k.revokedAt == null).length;
}

function formatUsdc(n: number, locale: string): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString(locale, { maximumFractionDigits: 2 })}M`;
  if (n >= 10_000) return `${(n / 1_000).toLocaleString(locale, { maximumFractionDigits: 1 })}k`;
  return n.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: typeof KeyRound;
  accent: "teal" | "blue" | "violet" | "amber" | "indigo" | "rose";
};

const accentRing: Record<StatCardProps["accent"], string> = {
  teal: "from-teal-500/25 to-teal-600/5 ring-teal-500/20 dark:from-teal-400/20 dark:ring-teal-400/25",
  blue: "from-cosmos-accent/20 to-cosmos-accent/5 ring-cosmos-accent/25",
  violet: "from-violet-500/20 to-violet-600/5 ring-violet-500/20 dark:from-violet-400/15 dark:ring-violet-400/25",
  amber: "from-amber-500/20 to-amber-600/5 ring-amber-500/20 dark:from-amber-400/15 dark:ring-amber-400/25",
  indigo: "from-indigo-500/20 to-indigo-600/5 ring-indigo-500/25 dark:from-indigo-400/15 dark:ring-indigo-400/25",
  rose: "from-rose-500/20 to-rose-600/5 ring-rose-500/20 dark:from-rose-400/15 dark:ring-rose-400/25",
};

function StatCard({ label, value, hint, icon: Icon, accent }: StatCardProps) {
  return (
    <div className={[PANEL_SURFACE_CARD_CLASS, "p-5 min-h-[118px] flex flex-col justify-between"].join(" ")}>
      <div className="relative z-[1] flex flex-col h-full justify-between">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-cosmos-muted m-0">{label}</p>
          <div
            className={[
              "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ring-1",
              accentRing[accent],
            ].join(" ")}
          >
            <Icon size={20} className="text-cosmos-text opacity-90" aria-hidden />
          </div>
        </div>
        <div className="mt-3">
          <p className="font-display font-semibold text-2xl sm:text-[1.65rem] tabular-nums tracking-tight text-cosmos-text m-0 leading-none">
            {value}
          </p>
          {hint ? <p className="text-xs text-cosmos-muted/90 mt-2 m-0 leading-snug">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={[PANEL_SURFACE_CARD_CLASS, "h-[118px] p-5"].join(" ")}>
            <div className="h-3 w-24 bg-cosmos-surface-elevated rounded mb-4" />
            <div className="h-8 w-20 bg-cosmos-surface-elevated rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={[PANEL_SURFACE_CARD_CLASS, "h-[100px] p-5"].join(" ")}>
            <div className="h-3 w-20 bg-cosmos-surface-elevated rounded mb-3" />
            <div className="h-7 w-16 bg-cosmos-surface-elevated rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={[PANEL_SURFACE_CARD_CLASS, "h-[280px]"].join(" ")} />
        <div className={[PANEL_SURFACE_CARD_CLASS, "h-[280px]"].join(" ")} />
      </div>
    </div>
  );
}

export function CosmosPayDevStatsPanel() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<CosmosPayApiKeyRow[]>([]);
  const [links, setLinks] = useState<CosmosPayPaymentLinkRow[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [k, l] = await Promise.all([listCosmosPayApiKeys(), listCosmosPayPaymentLinks()]);
      setKeys(k);
      setLinks(l);
    } catch (e) {
      setError(getErrorMessage(e, t("cosmosPayDev.errorLoad")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const metrics = useMemo(() => {
    const activeKeys = countActiveKeys(keys);
    const activeLinks = links.filter((l) => l.status === "ACTIVE").length;
    const archivedLinks = links.filter((l) => l.status === "ARCHIVED").length;
    const volume = sumActiveUsdc(links);
    const locale = i18n.language?.startsWith("es") ? "es-AR" : "en-US";

    const revokedKeys = countRevokedKeys(keys);
    const neverUsed = countNeverUsedActiveKeys(keys);
    const avgAmt = avgActiveLinkAmount(links);
    const maxAmt = maxActiveLinkAmount(links);
    const last30 = linksCreatedInLastDays(links, 30);
    const daily = dailyLinkCreation(links, 14, locale);

    return {
      activeKeys,
      activeLinks,
      archivedLinks,
      volumeFormatted: formatUsdc(volume, locale),
      totalKeys: keys.length,
      revokedKeys,
      neverUsed,
      avgAmountFormatted: formatUsdc(avgAmt, locale),
      maxAmountFormatted: formatUsdc(maxAmt, locale),
      last30,
      daily,
    };
  }, [keys, links, i18n.language]);

  return (
    <section className="mb-10" aria-labelledby="cosmos-pay-stats-heading">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <p
            id="cosmos-pay-stats-heading"
            className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-teal-700/80 dark:text-teal-300/70 m-0 mb-1"
          >
            {t("cosmosPayDev.statsEyebrow")}
          </p>
          <h2 className="font-display font-semibold text-xl text-cosmos-text m-0">{t("cosmosPayDev.statsTitle")}</h2>
          <p className="text-sm text-cosmos-muted m-0 mt-1 max-w-2xl">{t("cosmosPayDev.statsSubtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-xl text-sm font-medium border border-cosmos-border/80 bg-cosmos-surface text-cosmos-text hover:bg-cosmos-surface-elevated/90 transition-colors disabled:opacity-60 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} aria-hidden />
          {t("cosmosPayDev.statsRefresh")}
        </button>
      </div>

      <div className={[PANEL_SURFACE_SECTION_CLASS, "p-4 sm:p-6 md:p-8"].join(" ")}>
        {error ? (
          <div className="relative z-[1] rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-cosmos-text flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void load()}
              className="text-sm font-medium text-cosmos-accent hover:underline shrink-0"
            >
              {t("cosmosPayDev.statsRetry")}
            </button>
          </div>
        ) : loading ? (
          <div className="relative z-[1]">
            <StatsSkeleton />
          </div>
        ) : (
          <div className="relative z-[1] space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                accent="teal"
                icon={KeyRound}
                label={t("cosmosPayDev.statsActiveKeys")}
                value={<span className="tabular-nums">{metrics.activeKeys}</span>}
                hint={t("cosmosPayDev.statsActiveKeysHint")}
              />
              <StatCard
                accent="blue"
                icon={Link2}
                label={t("cosmosPayDev.statsActiveLinks")}
                value={<span className="tabular-nums">{metrics.activeLinks}</span>}
                hint={t("cosmosPayDev.statsActiveLinksHint")}
              />
              <StatCard
                accent="violet"
                icon={Wallet}
                label={t("cosmosPayDev.statsVolumeUsdc")}
                value={
                  <>
                    <span className="tabular-nums">{metrics.volumeFormatted}</span>
                    <span className="ml-1 text-base font-semibold text-teal-700/90 dark:text-teal-300/85">USDC</span>
                  </>
                }
                hint={t("cosmosPayDev.statsVolumeHint")}
              />
              <StatCard
                accent="amber"
                icon={Archive}
                label={t("cosmosPayDev.statsArchivedLinks")}
                value={<span className="tabular-nums">{metrics.archivedLinks}</span>}
                hint={t("cosmosPayDev.statsArchivedHint")}
              />
            </div>

            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-cosmos-muted m-0 mb-3">
                {t("cosmosPayDev.statsSecondaryEyebrow")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  accent="indigo"
                  icon={KeyRound}
                  label={t("cosmosPayDev.statsTotalKeys")}
                  value={<span className="tabular-nums">{metrics.totalKeys}</span>}
                  hint={t("cosmosPayDev.statsTotalKeysHint")}
                />
                <StatCard
                  accent="rose"
                  icon={Ban}
                  label={t("cosmosPayDev.statsRevokedKeys")}
                  value={<span className="tabular-nums">{metrics.revokedKeys}</span>}
                  hint={t("cosmosPayDev.statsRevokedKeysHint")}
                />
                <StatCard
                  accent="teal"
                  icon={CircleOff}
                  label={t("cosmosPayDev.statsNeverUsedKeys")}
                  value={<span className="tabular-nums">{metrics.neverUsed}</span>}
                  hint={t("cosmosPayDev.statsNeverUsedKeysHint")}
                />
                <StatCard
                  accent="violet"
                  icon={Sigma}
                  label={t("cosmosPayDev.statsAvgLinkAmount")}
                  value={
                    <>
                      <span className="tabular-nums">{metrics.avgAmountFormatted}</span>
                      <span className="ml-1 text-base font-semibold text-cosmos-muted">USDC</span>
                    </>
                  }
                  hint={t("cosmosPayDev.statsAvgLinkAmountHint")}
                />
                <StatCard
                  accent="blue"
                  icon={CalendarDays}
                  label={t("cosmosPayDev.statsLinksLast30d")}
                  value={<span className="tabular-nums">{metrics.last30}</span>}
                  hint={t("cosmosPayDev.statsLinksLast30dHint")}
                />
                <StatCard
                  accent="amber"
                  icon={Award}
                  label={t("cosmosPayDev.statsMaxLinkAmount")}
                  value={
                    <>
                      <span className="tabular-nums">{metrics.maxAmountFormatted}</span>
                      <span className="ml-1 text-base font-semibold text-teal-700/90 dark:text-teal-300/85">USDC</span>
                    </>
                  }
                  hint={t("cosmosPayDev.statsMaxLinkAmountHint")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CosmosPayDevActivityChart data={metrics.daily} />
              <CosmosPayDevStatusChart active={metrics.activeLinks} archived={metrics.archivedLinks} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-cosmos-muted border-t border-cosmos-border/50 pt-5">
              <span className="inline-flex items-center gap-1.5">
                <Activity size={14} className="text-teal-600/80 dark:text-teal-400/80" aria-hidden />
                {t("cosmosPayDev.statsFootnote")}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
