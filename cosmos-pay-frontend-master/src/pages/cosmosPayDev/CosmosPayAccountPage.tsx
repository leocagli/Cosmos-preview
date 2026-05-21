import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, CheckCircle2, Loader2, Mail, RefreshCw, Shield, Wallet } from "lucide-react";
import { PanelPageHeader, PANEL_SURFACE_CLASS } from "../../components/panel/panelLayout";
import { useAuth } from "../../context/AuthContext";
import { useStellarWallet } from "../../context/StellarWalletContext";
import * as authApi from "../../api/auth";
import { getErrorMessage } from "../../api/client";

const SURFACE = [PANEL_SURFACE_CLASS, "p-6 sm:p-8"].join(" ");

function IdentityRow({
  icon: Icon,
  title,
  description,
  active,
  activeLabel,
}: {
  icon: typeof Mail;
  title: string;
  description: string;
  active: boolean;
  activeLabel: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-cosmos-border/70 bg-cosmos-surface/50 p-4 dark:bg-cosmos-surface/30 sm:flex-row sm:items-start">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-cosmos-border/60 bg-cosmos-bg/80 text-cosmos-accent">
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="m-0 font-display text-base font-semibold text-cosmos-text">{title}</h3>
          {active ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3" aria-hidden />
              {activeLabel}
            </span>
          ) : (
            <span className="text-[11px] font-medium uppercase tracking-wide text-cosmos-muted">{activeLabel}</span>
          )}
        </div>
        <p className="mt-1.5 m-0 text-sm leading-relaxed text-cosmos-muted">{description}</p>
      </div>
    </div>
  );
}

export function CosmosPayAccountPage() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const stellar = useStellarWallet();
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inFlight = useRef(false);

  const providers = user?.providers ?? [];
  const hasEmail = providers.includes("email");
  const hasGoogle = providers.includes("google");
  const hasWallet = providers.includes("wallet");
  const addresses = user?.walletAddresses ?? [];

  const emailBadge = hasEmail
    ? t("cosmosPayDev.accountEmailBadgePassword")
    : hasGoogle
      ? t("cosmosPayDev.accountEmailBadgeGoogle")
      : user?.email
        ? t("cosmosPayDev.accountConnected")
        : t("cosmosPayDev.accountNotLinked");

  const handleLinkWallet = async () => {
    if (!stellar.address || inFlight.current) return;
    inFlight.current = true;
    setError(null);
    setSuccess(null);
    setLinking(true);
    try {
      const { message } = await authApi.getWalletNonce(stellar.address);
      const signature = await stellar.signMessage(message);
      if (!signature) {
        setError(t("cosmosPayDev.accountErrSign"));
        return;
      }
      const res = await authApi.linkWallet({ address: stellar.address, signature });
      if (res.user) {
        await refreshUser();
      }
      setSuccess(res.message === "already_linked" ? t("cosmosPayDev.accountWalletAlready") : t("cosmosPayDev.accountWalletLinked"));
    } catch (err) {
      let msg = getErrorMessage(err, t("cosmosPayDev.accountErrLink"));
      if (/rejected|rechazad|cancel|denied/i.test(msg)) {
        msg = t("cosmosPayDev.accountErrRejected");
      }
      if (/already linked to another/i.test(msg) || /409/.test(String(err))) {
        msg = t("cosmosPayDev.accountErrOtherUser");
      }
      setError(msg);
    } finally {
      setLinking(false);
      inFlight.current = false;
    }
  };

  return (
    <div>
      <PanelPageHeader title={t("cosmosPayDev.accountTitle")} description={t("cosmosPayDev.accountLead")} />

      <div className="space-y-5">
        <section className={SURFACE}>
          <h2 className="m-0 font-display text-sm font-semibold uppercase tracking-wider text-cosmos-muted">
            {t("cosmosPayDev.accountIdentitiesHeading")}
          </h2>
          <p className="mt-2 m-0 text-sm leading-relaxed text-cosmos-muted">{t("cosmosPayDev.accountIdentitiesHint")}</p>

          <div className="mt-6 space-y-4">
            <IdentityRow
              icon={Mail}
              title={t("cosmosPayDev.accountEmailTitle")}
              description={user?.email ?? t("cosmosPayDev.accountNoEmail")}
              active={!!user?.email}
              activeLabel={emailBadge}
            />
            <IdentityRow
              icon={Shield}
              title={t("cosmosPayDev.accountGoogleTitle")}
              description={t("cosmosPayDev.accountGoogleDesc")}
              active={hasGoogle}
              activeLabel={hasGoogle ? t("cosmosPayDev.accountConnected") : t("cosmosPayDev.accountNotLinked")}
            />
            <IdentityRow
              icon={Wallet}
              title={t("cosmosPayDev.accountWalletTitle")}
              description={t("cosmosPayDev.accountWalletDesc")}
              active={hasWallet && addresses.length > 0}
              activeLabel={hasWallet ? t("cosmosPayDev.accountConnected") : t("cosmosPayDev.accountNotLinked")}
            />
          </div>
        </section>

        {addresses.length > 0 ? (
          <section className={SURFACE}>
            <h2 className="m-0 font-display text-sm font-semibold uppercase tracking-wider text-cosmos-muted">
              {t("cosmosPayDev.accountAddressesHeading")}
            </h2>
            <ul className="mt-4 list-none space-y-3 p-0">
              {addresses.map((addr) => (
                <li
                  key={addr}
                  className="break-all rounded-lg border border-cosmos-border/60 bg-cosmos-bg/60 px-4 py-3 font-mono text-xs text-cosmos-text dark:bg-black/20"
                >
                  {addr}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className={SURFACE}>
          <h2 className="m-0 font-display text-sm font-semibold uppercase tracking-wider text-cosmos-muted">
            {t("cosmosPayDev.accountLinkWalletHeading")}
          </h2>
          <p className="mt-2 m-0 text-sm leading-relaxed text-cosmos-muted">{t("cosmosPayDev.accountLinkWalletLead")}</p>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400" role="status">
              {success}
            </div>
          ) : null}

          {stellar.address ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-cosmos-border/70 bg-cosmos-surface/40 p-4 dark:bg-cosmos-surface/25">
                <p className="m-0 text-xs font-medium uppercase tracking-wider text-cosmos-muted">{t("auth.providers.walletConnected")}</p>
                <p className="mt-2 truncate font-mono text-sm text-cosmos-text" title={stellar.address}>
                  {stellar.address.slice(0, 10)}…{stellar.address.slice(-8)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleLinkWallet()}
                disabled={linking}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cosmos-accent px-5 py-3.5 text-sm font-semibold text-cosmos-on-accent transition-colors hover:bg-cosmos-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {linking ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                {linking ? t("cosmosPayDev.accountLinking") : t("cosmosPayDev.accountLinkWalletCta")}
                {!linking ? <ArrowRight className="size-4 opacity-90" /> : null}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void stellar.connect()}
              disabled={stellar.isConnecting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cosmos-border bg-cosmos-surface-elevated px-5 py-3.5 text-sm font-semibold text-cosmos-text transition-colors hover:border-cosmos-accent/50 hover:bg-cosmos-surface-hover disabled:opacity-60 sm:w-auto"
            >
              <Wallet className="size-4 text-cosmos-accent" />
              {stellar.isConnecting ? t("auth.providers.connecting") : t("cosmosPayDev.accountConnectFirst")}
            </button>
          )}
          {stellar.error ? <p className="mt-3 m-0 text-xs text-red-500">{stellar.error}</p> : null}
        </section>
      </div>
    </div>
  );
}
