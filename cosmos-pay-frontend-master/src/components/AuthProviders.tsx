import { ArrowRight, Loader2, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStellarWallet } from "../context/StellarWalletContext";

const btnSecondary = [
  "group w-full flex items-center justify-center gap-3 rounded-xl border border-cosmos-border/95 px-4 py-3.5",
  "font-medium text-cosmos-text shadow-sm transition-all duration-200",
  "bg-cosmos-surface-elevated/55 hover:border-cosmos-accent/50 hover:bg-cosmos-surface-hover/95",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-accent/30",
  "disabled:cursor-not-allowed disabled:opacity-55 dark:border-cosmos-border dark:bg-cosmos-surface/65 dark:hover:bg-cosmos-surface-elevated/75",
].join(" ");

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c8.18 0 10-7.273 10-10 0-.835-.086-1.467-.19-2.032H12.545z"
      />
    </svg>
  );
}

export function AuthProviders({
  mode,
  onGoogle,
  googleLoading,
  onStellarLogin,
  stellarLoginLoading,
}: {
  mode: "login" | "register";
  onGoogle?: () => void;
  googleLoading?: boolean;
  onStellarLogin?: () => Promise<void>;
  stellarLoginLoading?: boolean;
}) {
  const { t } = useTranslation();
  const googleLabel = mode === "login" ? t("auth.providers.googleLogin") : t("auth.providers.googleRegister");
  const stellar = useStellarWallet();
  const showWalletContinue = (mode === "login" || mode === "register") && onStellarLogin;

  return (
    <div className="flex flex-col gap-3">
      <button type="button" className={btnSecondary} onClick={onGoogle} disabled={!onGoogle || googleLoading}>
        <span className="flex size-10 shrink-0 items-center justify-center">
          <GoogleIcon className="h-5 w-5 text-[#4285F4]" />
        </span>
        <span className="flex-1 text-left text-[15px]">
          {googleLoading ? t("auth.providers.signingIn") : googleLabel}
        </span>
      </button>

      {stellar.address ? (
        <div className="flex flex-col gap-3 rounded-xl border border-cosmos-border/90 bg-cosmos-surface/50 p-4 dark:bg-cosmos-surface/40">
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-cosmos-muted">{t("auth.providers.walletConnected")}</p>
          <p className="m-0 truncate font-mono text-sm text-cosmos-text" title={stellar.address}>
            {stellar.address.slice(0, 8)}…{stellar.address.slice(-6)}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {showWalletContinue ? (
              <button
                type="button"
                onClick={() => void onStellarLogin?.()}
                disabled={stellarLoginLoading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cosmos-accent px-4 py-2.5 text-sm font-semibold text-cosmos-on-accent transition-colors hover:bg-cosmos-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {stellarLoginLoading ? <Loader2 className="size-4 animate-spin" /> : null}
                {stellarLoginLoading ? t("auth.providers.signingIn") : t("auth.providers.continueWallet")}
                <ArrowRight className="size-4 shrink-0 opacity-90" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={stellar.disconnect}
              className="text-xs font-semibold text-cosmos-muted transition-colors hover:text-cosmos-accent"
            >
              {t("auth.providers.disconnect")}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className={btnSecondary} onClick={stellar.connect} disabled={stellar.isConnecting}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-cosmos-border/60 bg-cosmos-bg/80 dark:bg-black/30">
            <Wallet size={18} className="shrink-0 text-cosmos-accent" />
          </span>
          <span className="flex-1 text-left text-[15px]">
            {stellar.isConnecting ? t("auth.providers.connecting") : t("auth.providers.connectStellar")}
          </span>
        </button>
      )}
      {stellar.error ? <p className="m-0 text-xs text-red-500 dark:text-red-400">{stellar.error}</p> : null}
    </div>
  );
}
