import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Check, KeyRound, Link2, Shield } from "lucide-react";
import { COSMOS_LOGO_THEME_CLASS } from "./BrandLogo";

type AuthLayoutProps = {
  children: ReactNode;
  wide?: boolean;
  /** Enlace “Volver al inicio” encima del formulario */
  showBackLink?: boolean;
};

/** Tarjeta de formulario login/registro: superficie elevada alineada al panel. */
export const AUTH_CARD_CLASS = [
  "relative z-[1] overflow-hidden rounded-2xl border border-cosmos-border/85 dark:border-cosmos-border/55",
  "bg-cosmos-surface/95 shadow-[0_12px_48px_-16px_rgba(15,23,42,0.2)] dark:bg-cosmos-surface/92",
  "dark:shadow-[0_24px_64px_-28px_rgba(0,0,0,0.88)]",
  "ring-1 ring-cosmos-border/40 dark:ring-cosmos-border/25 backdrop-blur-md",
  "before:pointer-events-none before:absolute before:inset-0",
  "before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:to-45%",
  "dark:before:from-white/[0.015]",
].join(" ");

function FeatureRow({ icon: Icon, text }: { icon: typeof Shield; text: string }) {
  return (
    <div className="flex gap-4 text-left">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cosmos-accent dark:border-white/[0.06] dark:bg-white/[0.03]">
        <Icon className="size-[18px] opacity-90" aria-hidden />
      </div>
      <p className="m-0 flex-1 text-[15px] leading-snug text-cosmos-muted">{text}</p>
    </div>
  );
}

export function AuthLayout({ children, wide, showBackLink = true }: AuthLayoutProps) {
  const { t } = useTranslation();
  const features = [
    { icon: KeyRound, text: t("auth.layout.featureKeys") },
    { icon: Link2, text: t("auth.layout.featureLinks") },
    { icon: Shield, text: t("auth.layout.featureSecure") },
  ] as const;

  return (
    <div className="flex min-h-[calc(100vh-72px)]">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-cosmos-bg px-5 py-10 sm:px-8 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_20%_15%,rgb(var(--cosmos-palette-accent-ch)/0.055),transparent_58%)] dark:bg-[radial-gradient(ellipse_90%_60%_at_20%_15%,rgb(139_92_246/0.09),transparent_58%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_92%_88%,rgb(var(--cosmos-palette-accent-ch)/0.04),transparent_52%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_92%_88%,rgb(192_38_211/0.05),transparent_52%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.28] dark:hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 hidden opacity-[0.065] dark:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.09'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className={`relative w-full ${wide ? "max-w-[580px]" : "max-w-[440px] lg:max-w-[460px]"}`}>
          {showBackLink ? (
            <Link
              to="/"
              className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-cosmos-muted transition-colors hover:text-cosmos-accent"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden
              />
              {t("auth.layout.backHome")}
            </Link>
          ) : null}
          {children}
        </div>
      </div>

      <div className="relative hidden flex-[1.05] overflow-hidden border-l border-cosmos-border/70 bg-gradient-to-br from-cosmos-surface via-cosmos-bg to-cosmos-bg lg:flex dark:from-[#14101e] dark:via-[#0c0614] dark:to-[#080510]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_75%_40%,rgb(var(--cosmos-palette-accent-ch)/0.14)_0%,transparent_55%)] dark:bg-[radial-gradient(ellipse_85%_55%_at_75%_40%,rgb(var(--cosmos-palette-accent-ch)/0.16)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_10%_90%,rgb(var(--cosmos-palette-accent-ch)/0.08)_0%,transparent_48%)] dark:bg-[radial-gradient(ellipse_55%_70%_at_10%_90%,rgb(var(--cosmos-palette-accent-ch)/0.09)_0%,transparent_48%)]" />
        <div className="absolute right-[12%] top-[18%] h-80 w-80 rounded-full bg-cosmos-accent/10 blur-3xl dark:bg-white/[0.04]" />

        <div className="relative m-auto flex max-w-lg flex-col justify-center px-14 py-16 xl:px-20">
          <p className="m-0 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-cosmos-accent/90">
            {t("auth.layout.sideEyebrow")}
          </p>
          <h2 className="mt-4 text-center font-display text-2xl font-semibold leading-tight tracking-tight text-cosmos-text md:text-3xl">
            {t("auth.layout.welcome")}
          </h2>
          <div className="mt-10 flex justify-center">
            <img src="/logo.svg" alt="" width={112} height={112} className={COSMOS_LOGO_THEME_CLASS} />
          </div>
          <p className="mx-auto mt-8 max-w-md text-center font-display text-base font-medium italic leading-relaxed text-cosmos-muted md:text-lg">
            {t("auth.layout.tagline")}
          </p>

          <div className="mt-12 space-y-5 border-t border-white/[0.08] pt-10 dark:border-white/[0.06]">
            {features.map(({ icon, text }) => (
              <FeatureRow key={text} icon={icon} text={text} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-cosmos-muted">
            <Check className="size-3.5 shrink-0 text-emerald-500/90" aria-hidden />
            <span>{t("auth.layout.trustNote")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
