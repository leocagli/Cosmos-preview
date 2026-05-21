import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, KeyRound, ShieldAlert } from "lucide-react";
import {
  createCosmosPayApiKey,
  listCosmosPayApiKeys,
  revokeCosmosPayApiKey,
  type CosmosPayApiKeyCreated,
  type CosmosPayApiKeyRow,
} from "../../api/cosmosPayDev";
import { getErrorMessage } from "../../api/client";
import { PanelPageHeader, PANEL_SURFACE_CLASS } from "../../components/panel/panelLayout";

function formatHint(last4: string) {
  return `cosmospay_••••${last4}`;
}

function formatDate(iso: string | null, lng: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(lng.startsWith("en") ? "en-US" : "es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function CosmosPayDevKeysPage() {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState<CosmosPayApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [secretModal, setSecretModal] = useState<CosmosPayApiKeyCreated | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listCosmosPayApiKeys();
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

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const created = await createCosmosPayApiKey(name);
      setModalOpen(false);
      setNewName("");
      setSecretModal(created);
      await load();
    } catch (e) {
      setError(getErrorMessage(e, t("cosmosPayDev.errorGeneric")));
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm(t("cosmosPayDev.keysRevokeConfirm"))) return;
    try {
      await revokeCosmosPayApiKey(id);
      await load();
    } catch (e) {
      setError(getErrorMessage(e, t("cosmosPayDev.errorGeneric")));
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <PanelPageHeader
        title={t("cosmosPayDev.keysTitle")}
        description={t("cosmosPayDev.keysDescription")}
        actions={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-cosmos-accent text-cosmos-on-accent hover:bg-cosmos-accent-hover transition-colors sm:w-auto"
          >
            <KeyRound size={18} />
            {t("cosmosPayDev.keysCreate")}
          </button>
        }
      />

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className={[PANEL_SURFACE_CLASS, "overflow-x-auto"].join(" ")}>
        <div className="relative z-[1] min-w-[640px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cosmos-border text-left text-xs uppercase tracking-wider text-cosmos-muted">
                <th className="px-4 py-3 font-semibold">{t("cosmosPayDev.keysColName")}</th>
                <th className="px-4 py-3 font-semibold font-mono">{t("cosmosPayDev.keysColHint")}</th>
                <th className="px-4 py-3 font-semibold">{t("cosmosPayDev.keysColCreated")}</th>
                <th className="px-4 py-3 font-semibold">{t("cosmosPayDev.keysColLastUsed")}</th>
                <th className="px-4 py-3 font-semibold w-28">{t("cosmosPayDev.keysColActions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-cosmos-muted">
                    …
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-cosmos-muted">
                    {t("cosmosPayDev.keysEmpty")}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-cosmos-border/60 last:border-0">
                    <td className="px-4 py-3 font-medium text-cosmos-text">{row.name}</td>
                    <td className="px-4 py-3 font-mono text-cosmos-muted text-xs">{formatHint(row.keyLast4)}</td>
                    <td className="px-4 py-3 text-cosmos-muted">{formatDate(row.createdAt, i18n.language)}</td>
                    <td className="px-4 py-3 text-cosmos-muted">{formatDate(row.lastUsedAt, i18n.language)}</td>
                    <td className="px-4 py-3">
                      {row.revokedAt ? (
                        <span className="text-xs text-cosmos-muted">{t("cosmosPayDev.keysRevoked")}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleRevoke(row.id)}
                          className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          {t("cosmosPayDev.keysRevoke")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal>
          <div className="w-full max-w-md rounded-2xl border border-cosmos-border bg-cosmos-surface p-6 shadow-xl">
            <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4">{t("cosmosPayDev.keysModalTitle")}</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("cosmosPayDev.keysModalPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-cosmos-border bg-cosmos-bg text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:ring-2 focus:ring-cosmos-accent/30 mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-cosmos-border text-cosmos-text hover:bg-cosmos-surface-elevated"
              >
                {t("cosmosPayDev.keysModalCancel")}
              </button>
              <button
                type="button"
                disabled={creating || !newName.trim()}
                onClick={() => void handleCreate()}
                className="px-4 py-2.5 rounded-xl font-medium bg-cosmos-accent text-cosmos-on-accent hover:bg-cosmos-accent-hover disabled:opacity-50"
              >
                {t("cosmosPayDev.keysModalSubmit")}
              </button>
            </div>
          </div>
        </div>
      )}

      {secretModal && (
        <div className="fixed inset-0 z-[301] flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal>
          <div className="w-full max-w-lg rounded-2xl border border-amber-500/30 bg-cosmos-surface p-6 shadow-xl">
            <div className="flex gap-3 items-start mb-3">
              <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={22} />
              <div>
                <h2 className="font-display font-semibold text-cosmos-text text-lg m-0">{t("cosmosPayDev.keysSecretTitle")}</h2>
                <p className="text-sm text-cosmos-muted m-0 mt-1">{t("cosmosPayDev.keysSecretWarn")}</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-cosmos-bg border border-cosmos-border font-mono text-xs text-cosmos-text break-all">
              {secretModal.secret}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                type="button"
                onClick={() => void copy(secretModal.secret)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cosmos-border text-cosmos-text hover:bg-cosmos-surface-elevated"
              >
                <Copy size={16} />
                {t("cosmosPayDev.keysSecretCopy")}
              </button>
              <button
                type="button"
                onClick={() => setSecretModal(null)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-cosmos-accent text-cosmos-on-accent hover:bg-cosmos-accent-hover"
              >
                {t("cosmosPayDev.keysSecretDone")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
