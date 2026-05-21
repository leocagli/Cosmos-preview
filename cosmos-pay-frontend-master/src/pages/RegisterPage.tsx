import { Link, useNavigate } from "react-router-dom";
import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Lock, Mail } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import {
  AuthFormCard,
  AUTH_FIELD_INPUT_CLASS,
  AUTH_FIELD_LABEL_CLASS,
  AUTH_PRIMARY_BUTTON_CLASS,
} from "../components/AuthFormCard";
import { AuthProviders } from "../components/AuthProviders";
import { useAuth } from "../context/AuthContext";
import { useStellarWallet } from "../context/StellarWalletContext";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import * as authApi from "../api/auth";
import { getErrorMessage } from "../api/client";

const PANEL = "/panel/developers/cosmos-pay";

export function RegisterPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [stellarLoginLoading, setStellarLoginLoading] = useState(false);
  const { setUser } = useAuth();
  const stellar = useStellarWallet();
  const navigate = useNavigate();
  const stellarLoginInProgress = useRef(false);

  const handleGoogleCredential = useCallback(
    async (idToken: string) => {
      setError("");
      setGoogleLoading(true);
      try {
        const res = await authApi.googleAuth({ idToken });
        setUser(res.user);
        navigate(PANEL, { replace: true });
      } catch (err) {
        setError(getErrorMessage(err, t("auth.login.errors.google")));
      } finally {
        setGoogleLoading(false);
      }
    },
    [setUser, navigate, t],
  );

  const { triggerSignIn: triggerGoogleSignIn, isReady: googleReady, error: googleError, buttonContainerRef } =
    useGoogleSignIn(handleGoogleCredential);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.register({ email, password });
      setUser(res.user);
      navigate(PANEL, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, t("auth.register.errors.generic")));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setError("");
    if (googleError) {
      setError(googleError);
      return;
    }
    triggerGoogleSignIn();
  };

  const handleStellarLogin = async () => {
    if (!stellar.address) return;
    if (stellarLoginInProgress.current) return;
    stellarLoginInProgress.current = true;
    setError("");
    setStellarLoginLoading(true);
    try {
      const { message } = await authApi.getWalletNonce(stellar.address);
      const signature = await stellar.signMessage(message);
      if (!signature) {
        setError(t("auth.login.errors.walletSign"));
        return;
      }
      const res = await authApi.walletVerify({
        address: stellar.address,
        signature,
      });
      setUser(res.user);
      navigate(PANEL, { replace: true });
    } catch (err) {
      let msg = getErrorMessage(err, t("auth.login.errors.wallet"));
      if (/rejected|rechazad/i.test(msg)) {
        msg = t("auth.login.errors.walletRejected");
      }
      setError(msg);
    } finally {
      setStellarLoginLoading(false);
      stellarLoginInProgress.current = false;
    }
  };

  return (
    <AuthLayout>
      {googleReady ? (
        <div
          ref={buttonContainerRef}
          className="absolute left-[-9999px] h-[48px] w-[240px] overflow-hidden"
          aria-hidden
        />
      ) : null}
      <AuthFormCard
        eyebrow={t("auth.layout.formEyebrow")}
        title={t("auth.register.title")}
        subtitle={t("auth.register.subtitle")}
        error={error}
        googleError={googleError}
        footer={
          <>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-cosmos-border/80" />
              <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-cosmos-muted">
                {t("auth.login.divider")}
              </span>
              <span className="h-px flex-1 bg-cosmos-border/80" />
            </div>
            <AuthProviders
              mode="register"
              onGoogle={googleReady ? handleGoogle : undefined}
              googleLoading={googleLoading}
              onStellarLogin={handleStellarLogin}
              stellarLoginLoading={stellarLoginLoading}
            />
            <p className="m-0 mt-8 text-center text-[0.9375rem] leading-relaxed text-cosmos-muted">
              {t("auth.register.hasAccount")}{" "}
              <Link
                to="/auth/login"
                className="font-semibold text-cosmos-accent underline-offset-4 transition-colors hover:text-cosmos-accent-hover hover:underline"
              >
                {t("auth.register.login")}
              </Link>
            </p>
          </>
        }
      >
        <form className="flex flex-col gap-6" onSubmit={(e) => void handleSubmit(e)}>
          <label className="flex flex-col gap-2">
            <span className={AUTH_FIELD_LABEL_CLASS}>{t("auth.register.email")}</span>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-cosmos-muted/85"
                aria-hidden
              />
              <input
                type="email"
                autoComplete="email"
                required
                className={AUTH_FIELD_INPUT_CLASS}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className={AUTH_FIELD_LABEL_CLASS}>{t("auth.register.password")}</span>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-cosmos-muted/85"
                aria-hidden
              />
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className={AUTH_FIELD_INPUT_CLASS}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </label>
          <button type="submit" disabled={loading} className={AUTH_PRIMARY_BUTTON_CLASS}>
            {loading ? t("auth.register.submitting") : t("auth.register.submit")}
          </button>
        </form>
      </AuthFormCard>
    </AuthLayout>
  );
}
