import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const baseClass =
  "inline-flex items-center justify-center w-10 h-10 transition-colors shrink-0";

const variants = {
  header: "rounded-lg text-cosmos-text hover:text-cosmos-accent",
  /** Hero / vídeo oscuro (Cosmos Pay gateway) — alineado con LanguageSwitcher gateway */
  gateway:
    "rounded-full text-white transition-colors duration-200 ease-out hover:bg-white/10 hover:text-white active:bg-white/[0.14]",
  panel:
    "rounded-xl text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated",
  headerMobile: "rounded-xl text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated",
} as const;

type ThemeToggleProps = {
  className?: string;
  variant?: keyof typeof variants;
};

export function ThemeToggle({ className = "", variant = "header" }: ThemeToggleProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        baseClass,
        variants[variant],
        variant === "gateway" ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={isDark ? t("layout.theme.light") : t("layout.theme.dark")}
      title={isDark ? t("layout.theme.light") : t("layout.theme.dark")}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
