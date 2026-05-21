import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { AUTH_CARD_CLASS } from "./AuthLayout";

/** Clases compartidas para campos de email/contraseña en auth. */
export const AUTH_FIELD_INPUT_CLASS = [
  "w-full rounded-xl border border-cosmos-border/95 bg-cosmos-surface-elevated/55 py-3.5 pl-11 pr-4",
  "font-sans text-[15px] text-cosmos-text placeholder:text-cosmos-muted/80",
  "shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] transition-all duration-200",
  "focus:border-cosmos-accent focus:bg-cosmos-surface-elevated focus:outline-none focus:ring-2 focus:ring-cosmos-accent/25",
  "dark:border-cosmos-border dark:bg-cosmos-surface/70 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]",
  "dark:focus:bg-cosmos-surface-elevated/85",
].join(" ");

export const AUTH_FIELD_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-cosmos-muted";

export const AUTH_PRIMARY_BUTTON_CLASS = [
  "relative w-full overflow-hidden rounded-xl border-0 py-4 font-semibold",
  "bg-cosmos-accent text-cosmos-on-accent shadow-[0_4px_20px_-6px_rgb(var(--cosmos-palette-accent-ch)/0.55)]",
  "transition-[transform,box-shadow,opacity] duration-200 hover:bg-cosmos-accent-hover hover:shadow-[0_8px_28px_-8px_rgb(var(--cosmos-palette-accent-ch)/0.5)]",
  "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:shadow-none disabled:hover:bg-cosmos-accent",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cosmos-bg",
].join(" ");

type AuthFormCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  error?: string;
  googleError?: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthFormCard({ eyebrow, title, subtitle, error, googleError, children, footer }: AuthFormCardProps) {
  const showError = Boolean(error || googleError);

  return (
    <div className={["relative p-8 sm:p-10 lg:p-12", AUTH_CARD_CLASS].join(" ")}>
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cosmos-accent/40 to-transparent sm:inset-x-10"
        aria-hidden
      />
      <header className="mb-8 text-center sm:mb-10 sm:text-left">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cosmos-accent">{eyebrow}</p>
        <h1 className="m-0 font-display text-[1.65rem] font-semibold leading-tight tracking-tight text-cosmos-text sm:text-[1.85rem]">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-cosmos-muted sm:mx-0">{subtitle}</p>
      </header>

      {showError ? (
        <div
          className="mb-6 flex gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.08] px-4 py-3.5 text-left text-sm leading-snug text-red-600 dark:text-red-400"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-[18px] shrink-0 opacity-90" aria-hidden />
          <span>{error || googleError}</span>
        </div>
      ) : null}

      {children}

      <div className="mt-8 border-t border-cosmos-border/70 pt-8 dark:border-cosmos-border/50">{footer}</div>
    </div>
  );
}
