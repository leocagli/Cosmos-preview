import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { BrandLogo } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navCls = ({ isActive }: { isActive: boolean }) =>
  [
    "text-sm font-medium px-3 py-2 rounded-lg transition-colors",
    isActive ? "text-cosmos-text bg-cosmos-surface-elevated" : "text-cosmos-muted hover:text-cosmos-text",
  ].join(" ");

const navGateway = ({ isActive }: { isActive: boolean }) =>
  [
    "text-sm font-medium px-3 py-2 rounded-lg transition-colors",
    isActive ? "text-white bg-white/[0.1]" : "text-white/80 hover:text-white hover:bg-white/[0.06]",
  ].join(" ");

type MainHeaderProps = {
  /** Barra oscura tipo gateway (p. ej. login/registro: evita nav blanco en tema claro). */
  variant?: "default" | "auth";
};

export function MainHeader({ variant = "default" }: MainHeaderProps) {
  const { t } = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();
  const { theme } = useTheme();
  const gateway = variant === "auth" || theme === "dark";

  /** Fondo opaco: con tema claro y auth-app-chrome claro, bg-black/45 dejaba ver el gris/blanco de detrás. */
  const headerClass = gateway
    ? "sticky top-0 z-[100] border-b border-white/[0.08] bg-[#080510] shadow-[0_8px_32px_-16px_rgba(0,0,0,0.55)] backdrop-blur-xl"
    : "sticky top-0 z-[100] border-b border-cosmos-border/80 bg-cosmos-bg-nav/90 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_4px_32px_-12px_rgba(0,0,0,0.35)]";

  const navLink = gateway ? navGateway : navCls;

  const navLinkMobile = ({ isActive }: { isActive: boolean }) =>
    [
      "shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
      gateway
        ? isActive
          ? "bg-white/[0.12] text-white"
          : "text-white/75 hover:bg-white/[0.06] hover:text-white"
        : isActive
          ? "bg-cosmos-surface-elevated text-cosmos-text"
          : "text-cosmos-muted hover:bg-cosmos-surface-elevated/80 hover:text-cosmos-text",
    ].join(" ");

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 min-w-0" aria-label={t("layout.header.homeAria")}>
          <BrandLogo variant="full" className="h-8 w-auto shrink-0" alt={t("layout.header.brandAlt")} brandOnDark={gateway} />
          <span
            className={
              gateway
                ? "text-white text-lg font-semibold truncate hidden sm:inline"
                : "text-cosmos-text text-lg font-semibold truncate hidden sm:inline"
            }
          >
            {t("layout.header.brandName")} Pay
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 md:flex" aria-label={t("layout.gatewayNav.aria")}>
          <NavLink to="/" className={navLink} end>
            {t("layout.header.breadcrumbHome")}
          </NavLink>
          <NavLink to="/panel/developers/cosmos-pay" className={navLink}>
            {t("cosmosPayDev.consoleTitle")}
          </NavLink>
        </nav>

        <nav
          className="flex min-w-0 flex-1 items-center justify-center md:hidden"
          aria-label={t("layout.gatewayNav.aria")}
        >
          <div className="flex max-w-full items-center gap-0.5 overflow-x-auto overscroll-x-contain px-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <NavLink to="/" className={navLinkMobile} end>
              {t("layout.header.breadcrumbHome")}
            </NavLink>
            <NavLink to="/panel/developers/cosmos-pay" className={navLinkMobile}>
              {t("cosmosPayDev.consoleTitle")}
            </NavLink>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <ThemeToggle variant={gateway ? "gateway" : "header"} />
          <LanguageSwitcher variant={gateway ? "gateway" : "default"} />
          {isLoggedIn ? (
            <div
              className={
                gateway
                  ? "flex items-center gap-2 border-l border-white/[0.12] pl-3"
                  : "flex items-center gap-2 border-l border-cosmos-border/70 pl-3"
              }
            >
              <span
                className={
                  gateway
                    ? "text-xs text-white/65 max-w-[140px] truncate hidden sm:inline"
                    : "text-xs text-cosmos-muted max-w-[140px] truncate hidden sm:inline"
                }
              >
                {user?.email}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="text-sm font-medium text-cosmos-accent hover:underline px-2"
              >
                {t("auth.logout")}
              </button>
            </div>
          ) : (
            <div
              className={
                gateway
                  ? "flex items-center gap-2 border-l border-white/[0.12] pl-3"
                  : "flex items-center gap-2 border-l border-cosmos-border/70 pl-3"
              }
            >
              <Link
                to="/auth/login"
                className={
                  gateway
                    ? "rounded-full px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.08] hover:text-white"
                    : "rounded-full px-3 py-2 text-sm font-medium text-cosmos-muted transition-colors hover:bg-cosmos-surface-elevated/80 hover:text-cosmos-text"
                }
              >
                {t("layout.header.login")}
              </Link>
              <Link
                to="/auth/registro"
                className={
                  gateway
                    ? "rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-md transition-opacity hover:opacity-95"
                    : "rounded-full bg-cosmos-accent px-4 py-2 text-sm font-medium text-cosmos-on-accent shadow-md transition-colors hover:bg-cosmos-accent-hover"
                }
              >
                {t("layout.header.createAccount")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
