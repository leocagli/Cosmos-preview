import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import MX from "country-flag-icons/react/3x2/MX";
import US from "country-flag-icons/react/3x2/US";
import { I18N_STORAGE_KEY } from "../i18n/storage";

const flagClass = "h-[15px] w-auto max-w-[22px] shrink-0 rounded-[2px] object-cover shadow-sm";
const flagClassGateway = "h-[15px] w-auto max-w-[22px] shrink-0 rounded-[2px] object-cover";

type LanguageSwitcherProps = {
  className?: string;
  /** Trigger más compacto (panel / móvil); `gateway` = sobre fondo oscuro (hero) */
  variant?: "default" | "compact" | "gateway";
};

const triggerVariantClass: Record<NonNullable<LanguageSwitcherProps["variant"]>, string> = {
  default:
    "border-cosmos-border bg-cosmos-surface hover:bg-cosmos-surface-elevated",
  compact:
    "border-cosmos-border bg-cosmos-surface hover:bg-cosmos-surface-elevated",
  gateway:
    "h-10 w-10 min-w-[2.5rem] border-0 bg-transparent p-0 text-white shadow-none transition-colors duration-200 ease-out hover:bg-white/10 active:bg-white/[0.14]",
};

const menuVariantClass: Record<NonNullable<LanguageSwitcherProps["variant"]>, string> = {
  default: "border-cosmos-border bg-cosmos-surface shadow-lg",
  compact: "border-cosmos-border bg-cosmos-surface shadow-lg",
  gateway: "border-white/20 bg-zinc-950/95 text-white shadow-xl backdrop-blur-md",
};

const menuItemHoverClass: Record<NonNullable<LanguageSwitcherProps["variant"]>, string> = {
  default: "hover:bg-cosmos-surface-elevated",
  compact: "hover:bg-cosmos-surface-elevated",
  gateway: "hover:bg-white/10",
};

const menuItemActiveClass: Record<NonNullable<LanguageSwitcherProps["variant"]>, string> = {
  default: "bg-cosmos-accent/10",
  compact: "bg-cosmos-accent/10",
  gateway: "bg-white/15",
};

export function LanguageSwitcher({ className = "", variant = "default" }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "es";
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const setLang = (lng: "es" | "en") => {
    void i18n.changeLanguage(lng);
    try {
      localStorage.setItem(I18N_STORAGE_KEY, lng);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lng;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerPad = variant === "compact" ? "p-1.5" : variant === "gateway" ? "p-0" : "p-2";
  const flagCls = variant === "gateway" ? flagClassGateway : flagClass;

  return (
    <div ref={rootRef} className={["relative", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className={[
          "inline-flex items-center justify-center border transition-colors",
          variant === "gateway" ? "rounded-full" : "rounded-lg",
          triggerVariantClass[variant],
          variant === "gateway"
            ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
            : "focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-accent/60",
          variant === "gateway" && open ? "bg-white/12" : "",
          triggerPad,
        ].join(" ")}
        aria-label={t("layout.language.label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="inline-flex shrink-0 overflow-hidden rounded-[2px]" aria-hidden>
          {current === "es" ? (
            <MX className={flagCls} title="" />
          ) : (
            <US className={flagCls} title="" />
          )}
        </span>
      </button>

      {open && (
        <ul
          className={[
            "absolute right-0 top-full z-[200] mt-1 min-w-[3rem] rounded-xl border py-1",
            menuVariantClass[variant],
          ].join(" ")}
          role="listbox"
          aria-label={t("layout.language.label")}
        >
          <li role="none">
            <button
              type="button"
              role="option"
              aria-selected={current === "es"}
              className={[
                "flex w-full items-center justify-center px-3 py-2 transition-colors",
                menuItemHoverClass[variant],
                current === "es" ? menuItemActiveClass[variant] : "",
              ].join(" ")}
              aria-label={t("layout.language.es")}
              onClick={() => setLang("es")}
            >
              <MX className={flagCls} title="" />
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="option"
              aria-selected={current === "en"}
              className={[
                "flex w-full items-center justify-center px-3 py-2 transition-colors",
                menuItemHoverClass[variant],
                current === "en" ? menuItemActiveClass[variant] : "",
              ].join(" ")}
              aria-label={t("layout.language.en")}
              onClick={() => setLang("en")}
            >
              <US className={flagCls} title="" />
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
