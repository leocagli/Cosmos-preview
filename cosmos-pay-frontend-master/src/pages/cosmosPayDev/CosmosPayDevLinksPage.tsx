import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Copy,
  ExternalLink,
  Link2,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  archiveCosmosPayPaymentLink,
  createCosmosPayPaymentLink,
  listCosmosPayPaymentLinks,
  patchCosmosPayPaymentLink,
  type CosmosPayPaymentLinkRow,
} from "../../api/cosmosPayDev";
import { getErrorMessage } from "../../api/client";
import { PanelPageHeader, PANEL_SURFACE_CLASS } from "../../components/panel/panelLayout";
import { formatUsdc } from "../../utils/formatUsdc";

function payUrl(slug: string) {
  if (typeof window === "undefined") return `/pago/${slug}`;
  return `${window.location.origin}/pago/${slug}`;
}

type FilterTab = "all" | "ACTIVE" | "ARCHIVED";

export function CosmosPayDevLinksPage() {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState<CosmosPayPaymentLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CosmosPayPaymentLinkRow | null>(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("10");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listCosmosPayPaymentLinks();
      setRows(list);
    } catch (e) {
      setError(getErrorMessage(e, t("cosmosPayDev.errorLoad")));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const parsedAmount = useMemo(() => {
    const n = parseFloat(amount.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setAmount("10");
    setDescription("");
    setSlug("");
    setModalOpen(true);
  };

  const openEdit = (row: CosmosPayPaymentLinkRow) => {
    if (row.status !== "ACTIVE") return;
    setEditing(row);
    setTitle(row.title);
    setAmount(String(row.amount).replace(",", "."));
    setDescription(row.description ?? "");
    setSlug(row.slug);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !Number.isFinite(parsedAmount)) return;
    setSubmitting(true);
    try {
      if (editing) {
        await patchCosmosPayPaymentLink(editing.id, {
          title: title.trim(),
          amount: parsedAmount,
          description: description.trim() || undefined,
        });
      } else {
        await createCosmosPayPaymentLink({
          title: title.trim(),
          amount: parsedAmount,
          description: description.trim() || undefined,
          slug: slug.trim() || undefined,
        });
      }
      closeModal();
      await load();
    } catch (err) {
      setError(getErrorMessage(err, t("cosmosPayDev.errorGeneric")));
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  const handleArchive = async (id: string) => {
    if (!window.confirm(t("cosmosPayDev.linksArchiveConfirm"))) return;
    try {
      await archiveCosmosPayPaymentLink(id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err, t("cosmosPayDev.errorGeneric")));
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, search, filter]);

  return (
    <div>
      <PanelPageHeader
        title={t("cosmosPayDev.linksTitle")}
        description={t("cosmosPayDev.linksDescriptionUsdc")}
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-cosmos-accent text-cosmos-on-accent hover:bg-cosmos-accent-hover shadow-sm text-sm sm:w-auto"
          >
            <Plus size={18} />
            {t("cosmosPayDev.linksNew")}
          </button>
        }
      />

      {error ? (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-200">{error}</div>
      ) : null}

      <div className={[PANEL_SURFACE_CLASS, "p-4 sm:p-5 mb-6"].join(" ")}>
        <div className="relative z-[1] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 min-w-0">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmos-muted pointer-events-none"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("cosmosPayDev.linksSearchPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cosmos-border bg-cosmos-bg text-cosmos-text text-sm focus:outline-none focus:ring-2 focus:ring-cosmos-accent/30"
            />
          </div>
          <div className="flex max-w-full items-center gap-1 overflow-x-auto overscroll-x-contain p-1 rounded-xl bg-cosmos-bg border border-cosmos-border shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <SlidersHorizontal size={16} className="text-cosmos-muted ml-2 hidden sm:block" aria-hidden />
            {(["all", "ACTIVE", "ARCHIVED"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={[
                  "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                  filter === tab
                    ? "bg-cosmos-surface-elevated text-cosmos-text shadow-sm"
                    : "text-cosmos-muted hover:text-cosmos-text",
                ].join(" ")}
              >
                {tab === "all"
                  ? t("cosmosPayDev.linksFilterAll")
                  : tab === "ACTIVE"
                    ? t("cosmosPayDev.linksStatusActive")
                    : t("cosmosPayDev.linksStatusArchived")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={[PANEL_SURFACE_CLASS, "overflow-hidden"].join(" ")}>
        <div className="relative z-[1] overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-cosmos-border bg-cosmos-bg/50 text-left text-[0.65rem] uppercase tracking-wider text-cosmos-muted">
                <th className="px-4 py-3 font-semibold">{t("cosmosPayDev.linksColTitle")}</th>
                <th className="px-4 py-3 font-semibold">{t("cosmosPayDev.linksColAmount")}</th>
                <th className="px-4 py-3 font-semibold font-mono">{t("cosmosPayDev.linksColSlug")}</th>
                <th className="px-4 py-3 font-semibold">{t("cosmosPayDev.linksColCreated")}</th>
                <th className="px-4 py-3 font-semibold">{t("cosmosPayDev.linksColStatus")}</th>
                <th className="px-4 py-3 font-semibold text-right w-[200px]">{t("cosmosPayDev.linksColActions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-cosmos-muted">
                    {t("common.loading")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-cosmos-accent/10 border border-cosmos-accent/20 flex items-center justify-center mx-auto mb-3">
                        <Link2 className="text-cosmos-accent" size={22} />
                      </div>
                      <p className="text-cosmos-text font-medium m-0">{t("cosmosPayDev.linksEmptyTitle")}</p>
                      <p className="text-cosmos-muted text-sm mt-1 m-0">{t("cosmosPayDev.linksEmptyHint")}</p>
                      <button
                        type="button"
                        onClick={openCreate}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-cosmos-accent text-cosmos-on-accent hover:bg-cosmos-accent-hover text-sm"
                      >
                        <Plus size={16} />
                        {t("cosmosPayDev.linksNew")}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="border-b border-cosmos-border/50 last:border-0 hover:bg-cosmos-surface-elevated/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-cosmos-text max-w-[220px] truncate" title={row.title}>
                        {row.title}
                      </div>
                      {row.description ? (
                        <div className="text-xs text-cosmos-muted truncate max-w-[260px] mt-0.5" title={row.description}>
                          {row.description}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-cosmos-text font-medium">
                      {formatUsdc(row.amount, i18n.language)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-cosmos-muted">{row.slug}</td>
                    <td className="px-4 py-3.5 text-cosmos-muted text-xs whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleDateString(i18n.language, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={
                          row.status === "ACTIVE"
                            ? "inline-flex text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium"
                            : "inline-flex text-xs px-2 py-0.5 rounded-full bg-cosmos-muted/20 text-cosmos-muted font-medium"
                        }
                      >
                        {row.status === "ACTIVE" ? t("cosmosPayDev.linksStatusActive") : t("cosmosPayDev.linksStatusArchived")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => void copy(payUrl(row.slug))}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-cosmos-accent hover:bg-cosmos-accent/10"
                        >
                          <Copy size={14} />
                          {t("cosmosPayDev.linksCopyUrl")}
                        </button>
                        <a
                          href={payUrl(row.slug)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated"
                        >
                          <ExternalLink size={14} />
                          {t("cosmosPayDev.linksOpen")}
                        </a>
                        {row.status === "ACTIVE" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => openEdit(row)}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated"
                            >
                              <Pencil size={14} />
                              {t("cosmosPayDev.linksEdit")}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleArchive(row.id)}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-red-400/90 hover:bg-red-500/10"
                            >
                              {t("cosmosPayDev.linksArchive")}
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 border-0 cursor-default"
            aria-label={t("common.cancel")}
            onClick={closeModal}
          />
          <div
            className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-cosmos-border bg-cosmos-surface shadow-2xl"
            role="dialog"
            aria-modal
            aria-labelledby="link-modal-title"
          >
            <div className="px-5 py-4 border-b border-cosmos-border flex items-start justify-between gap-3">
              <div>
                <h2 id="link-modal-title" className="font-display font-semibold text-cosmos-text text-lg m-0">
                  {editing ? t("cosmosPayDev.linksModalEditTitle") : t("cosmosPayDev.linksModalCreateTitle")}
                </h2>
                <p className="text-xs text-cosmos-muted m-0 mt-1">{t("cosmosPayDev.linksUsdcHint")}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="shrink-0 px-2 py-1 text-sm text-cosmos-muted hover:text-cosmos-text"
              >
                {t("common.cancel")}
              </button>
            </div>
            <form onSubmit={(e) => void handleSubmit(e)} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-cosmos-muted mb-1.5">{t("cosmosPayDev.linksFieldTitle")}</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cosmos-border bg-cosmos-bg text-cosmos-text focus:outline-none focus:ring-2 focus:ring-cosmos-accent/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-cosmos-muted mb-1.5">{t("cosmosPayDev.linksFieldAmountUsdc")}</label>
                <input
                  required
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cosmos-border bg-cosmos-bg text-cosmos-text tabular-nums focus:outline-none focus:ring-2 focus:ring-cosmos-accent/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-cosmos-muted mb-1.5">{t("cosmosPayDev.linksFieldDesc")}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-cosmos-border bg-cosmos-bg text-cosmos-text resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-cosmos-accent/30"
                />
              </div>
              {!editing ? (
                <div>
                  <label className="block text-xs font-medium text-cosmos-muted mb-1.5">{t("cosmosPayDev.linksFieldSlug")}</label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="mi-cobro-2024"
                    className="w-full px-4 py-2.5 rounded-xl border border-cosmos-border bg-cosmos-bg text-cosmos-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cosmos-accent/30"
                  />
                </div>
              ) : (
                <p className="text-xs text-cosmos-muted m-0">
                  <span className="font-mono text-cosmos-text">{slug}</span> — {t("cosmosPayDev.linksSlugLocked")}
                </p>
              )}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-cosmos-border text-cosmos-text hover:bg-cosmos-surface-elevated text-sm font-medium"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting || !title.trim() || !Number.isFinite(parsedAmount)}
                  className="px-5 py-2.5 rounded-xl font-medium bg-cosmos-accent text-cosmos-on-accent hover:bg-cosmos-accent-hover disabled:opacity-50 text-sm"
                >
                  {submitting ? t("cosmosPayDev.linksSaving") : editing ? t("common.save") : t("cosmosPayDev.linksSubmit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
