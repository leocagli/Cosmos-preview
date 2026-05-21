import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import {
  BookOpen,
  ChevronRight,
  Code2,
  Home,
  KeyRound,
  Link2,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { COSMOS_LOGO_THEME_CLASS } from "../BrandLogo";
import { ThemeToggle } from "../ThemeToggle";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { useAuth } from "../../context/AuthContext";

const itemBase =
  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors";
const itemActive = "bg-cosmos-surface-elevated text-cosmos-text";
const itemIdle = "text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated/60";

const DEV_BASE = "/panel/developers/cosmos-pay";
const PUBLIC_DOCS = "/docs/cosmos-pay";
const ACCOUNT_PATH = `${DEV_BASE}/cuenta`;

type Crumb = { label: string; to?: string };

function getBreadcrumbs(pathname: string, t: TFunction): Crumb[] {
  const p = pathname.replace(/\/$/, "") || "/";
  const out: Crumb[] = [
    { label: t("sidebar.breadcrumb.panel"), to: "/" },
    { label: t("sidebar.breadcrumb.cosmosPayDev"), to: DEV_BASE },
  ];
  if (p === DEV_BASE) {
    out.push({ label: t("sidebar.breadcrumb.cosmosPayOverview") });
    return out;
  }
  if (p.includes("/llaves")) {
    out.push({ label: t("sidebar.breadcrumb.cosmosPayKeys") });
    return out;
  }
  if (p.includes("/links")) {
    out.push({ label: t("sidebar.breadcrumb.cosmosPayLinks") });
    return out;
  }
  if (p.includes("/docs")) {
    out.push({ label: t("sidebar.breadcrumb.cosmosPayDocs") });
    return out;
  }
  if (p.includes("/cuenta")) {
    out.push({ label: t("sidebar.breadcrumb.cosmosPayAccount") });
    return out;
  }
  out.push({ label: t("sidebar.breadcrumb.cosmosPayOverview") });
  return out;
}

function initialsFromUser(email: string | null | undefined) {
  if (!email) return "?";
  const local = email.split("@")[0] ?? "";
  if (local.length >= 2) return local.slice(0, 2).toUpperCase();
  return (local[0] ?? "?").toUpperCase();
}

export function CosmosPayDevLayout() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setMobileOpen(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  const breadcrumbs = useMemo(() => getBreadcrumbs(location.pathname, t), [location.pathname, t]);
  const displayName = user?.email ?? t("common.userFallback");

  const NavItem = ({
    to,
    end,
    icon: Icon,
    label,
    narrow,
  }: {
    to: string;
    end?: boolean;
    icon: typeof Code2;
    label: string;
    narrow: boolean;
  }) => (
    <NavLink
      to={to}
      end={end}
      title={narrow ? label : undefined}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        [
          itemBase,
          narrow ? "justify-center" : "",
          isActive ? itemActive : itemIdle,
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      <Icon size={18} className={["shrink-0", "text-cosmos-muted"].join(" ")} aria-hidden />
      <span className={narrow ? "sr-only" : "truncate"}>{label}</span>
    </NavLink>
  );

  const DocsNavItem = ({ narrow, label }: { narrow: boolean; label: string }) => (
    <a
      href={PUBLIC_DOCS}
      target="_blank"
      rel="noopener noreferrer"
      title={narrow ? label : undefined}
      onClick={() => setMobileOpen(false)}
      className={[itemBase, narrow ? "justify-center" : "", itemIdle].join(" ")}
    >
      <BookOpen size={18} className={["shrink-0", "text-cosmos-muted"].join(" ")} aria-hidden />
      <span className={narrow ? "sr-only" : "truncate"}>{label}</span>
    </a>
  );

  const renderSidebar = (narrow: boolean) => (
    <div className="h-full min-h-0 flex flex-col">
      <Link
        to="/"
        onClick={() => setMobileOpen(false)}
        className={[
          "shrink-0 px-4 py-4 flex items-center gap-3 w-full no-underline rounded-xl hover:bg-cosmos-surface-elevated/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmos-accent/30 text-inherit",
          narrow ? "justify-center" : "",
        ].join(" ")}
        aria-label={t("layout.header.homeAria")}
      >
        <img src="/logo.svg" alt="" className={`w-8 h-8 shrink-0 ${COSMOS_LOGO_THEME_CLASS}`} />
        {!narrow && (
          <div className="min-w-0">
            <p className="text-cosmos-text font-semibold m-0 leading-5 truncate">{t("layout.header.brandName")}</p>
            <p className="text-xs text-cosmos-muted m-0 leading-4 truncate">{t("sidebar.brandPanel")}</p>
          </div>
        )}
      </Link>

      {!narrow && (
        <div className="shrink-0 px-4 pb-2">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-cosmos-muted m-0">
            {t("sidebar.navigation")}
          </p>
        </div>
      )}

      <div
        className={[
          "flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-2 pt-1",
          "[scrollbar-width:none] [-ms-overflow-style:none]",
          "[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        <div className="flex flex-col gap-0.5">
          <NavItem narrow={narrow} to={DEV_BASE} end icon={Code2} label={t("cosmosPayDev.navOverview")} />
          <NavItem narrow={narrow} to={`${DEV_BASE}/llaves`} icon={KeyRound} label={t("cosmosPayDev.navKeys")} />
          <NavItem narrow={narrow} to={`${DEV_BASE}/links`} icon={Link2} label={t("cosmosPayDev.navLinks")} />
          <NavItem narrow={narrow} to={ACCOUNT_PATH} icon={Settings} label={t("cosmosPayDev.navAccount")} />
          <DocsNavItem narrow={narrow} label={t("cosmosPayDev.navDocs")} />
        </div>
      </div>

      <div className="shrink-0 px-4 py-4 border-t border-cosmos-border/50 bg-cosmos-bg/80">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className={[
            itemBase,
            "border border-cosmos-border bg-cosmos-surface hover:bg-cosmos-surface-elevated/60",
            narrow ? "justify-center" : "",
          ].join(" ")}
        >
          <Home size={18} className="text-cosmos-muted shrink-0" aria-hidden />
          {!narrow && <span className="truncate">{t("layout.header.breadcrumbHome")}</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen cosmos-app-chrome cosmos-panel-typography">
      <div className="flex">
        <aside
          className={[
            "hidden md:flex flex-col h-screen min-h-0 sticky top-0 overflow-x-hidden border-r border-cosmos-border bg-cosmos-surface",
            collapsed ? "w-[88px]" : "w-[280px]",
          ].join(" ")}
        >
          {renderSidebar(collapsed)}
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-[200] md:hidden" aria-hidden={false}>
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-cosmos-surface border-r border-cosmos-border/60 shadow-2xl">
              <div className="px-4 py-3 flex items-center justify-between border-b border-cosmos-border/60">
                <span className="text-sm font-semibold text-cosmos-text">{t("sidebar.brandPanel")}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-cosmos-border bg-cosmos-surface text-cosmos-text hover:bg-cosmos-surface-elevated transition-colors"
                  aria-label={t("sidebar.closeMenu")}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="h-[calc(100vh-64px)] min-h-0 flex flex-col overflow-hidden">
                {renderSidebar(false)}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="sticky top-0 z-[80] border-b border-cosmos-border/50 bg-cosmos-bg/90 shadow-[0_8px_32px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl">
            <div className="w-full px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-cosmos-border bg-cosmos-surface text-cosmos-text hover:bg-cosmos-surface-elevated transition-colors"
                aria-label={t("sidebar.openSidebar")}
              >
                <Menu size={18} />
              </button>
              <button
                type="button"
                onClick={() => setCollapsed((v) => !v)}
                className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-xl border border-cosmos-border bg-cosmos-surface text-cosmos-text hover:bg-cosmos-surface-elevated transition-colors"
                aria-label={collapsed ? t("sidebar.expandSidebar") : t("sidebar.collapseSidebar")}
              >
                <Menu size={18} />
              </button>

              <div className="flex-1 min-w-0 flex flex-col gap-2 justify-center py-0.5 hidden md:block">
                <nav
                  className="flex items-center gap-1.5 flex-wrap text-sm min-w-0"
                  aria-label={t("sidebar.breadcrumbAria")}
                >
                  {breadcrumbs.map((crumb, idx) => {
                    const last = idx === breadcrumbs.length - 1;
                    return (
                      <span key={`${crumb.label}-${idx}`} className="flex items-center gap-1.5 min-w-0">
                        {idx > 0 && <ChevronRight size={14} className="text-cosmos-muted shrink-0 opacity-80" />}
                        {crumb.to && !last ? (
                          <Link
                            to={crumb.to}
                            className="text-cosmos-muted hover:text-cosmos-text transition-colors truncate max-w-[min(200px,28vw)]"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span
                            className={
                              last
                                ? "text-cosmos-text font-medium truncate max-w-[min(280px,40vw)] px-2 py-0.5 rounded-lg bg-cosmos-surface-elevated/80 border border-cosmos-border/80"
                                : "text-cosmos-muted truncate max-w-[min(200px,28vw)]"
                            }
                          >
                            {crumb.label}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <LanguageSwitcher variant="compact" className="hidden sm:flex" />
                <ThemeToggle variant="panel" />
                <Link
                  to={ACCOUNT_PATH}
                  className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-xl text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface-elevated transition-colors"
                  aria-label={t("cosmosPayDev.navAccountAria")}
                >
                  <Settings size={18} />
                </Link>

                <Link
                  to="/"
                  className="ml-1 inline-flex items-center gap-3 px-3 py-2 rounded-xl border border-cosmos-border bg-cosmos-surface hover:bg-cosmos-surface-elevated transition-colors"
                  aria-label={t("common.myAccount")}
                >
                  <div className="w-8 h-8 rounded-xl bg-cosmos-accent/15 flex items-center justify-center text-cosmos-text text-xs font-semibold shrink-0">
                    {initialsFromUser(user?.email)}
                  </div>
                  <div className="hidden lg:block min-w-0">
                    <p className="text-sm font-semibold text-cosmos-text m-0 leading-4 truncate max-w-[160px]">
                      {displayName}
                    </p>
                    <p className="text-xs text-cosmos-muted m-0 leading-4">{t("common.account")}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[1400px] px-3 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
