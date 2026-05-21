import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Code2, Home, ListTree, Menu, TerminalSquare, X } from "lucide-react";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { ThemeToggle } from "../components/ThemeToggle";
import { COSMOS_LOGO_THEME_CLASS } from "../components/BrandLogo";
import { ApiDocsTocNav, useDocsActiveSection } from "../components/api-docs";
import { CosmosPayDocsArticle, COSMOS_PAY_DOCS_SECTION_IDS } from "../components/cosmosPay/docs/CosmosPayDocsArticle";

const DEV_CONSOLE = "/panel/developers/cosmos-pay";

export function CosmosPayPublicDocsPage() {
  const { t } = useTranslation();
  const [mobileNav, setMobileNav] = useState(false);

  const tocItems = useMemo(
    () =>
      [
        { id: "quick-start", label: t("cosmosPayDev.docsTocQuickStart") },
        { id: "base-url", label: t("cosmosPayDev.docsTocBase") },
        { id: "post-payment-links", label: t("cosmosPayDev.docsTocPost") },
        { id: "public-link-get", label: t("cosmosPayDev.docsTocGet") },
        { id: "dashboard-jwt", label: t("cosmosPayDev.docsTocJwt") },
      ] as const,
    [t],
  );

  const sectionIds = useMemo(() => [...COSMOS_PAY_DOCS_SECTION_IDS], []);
  const activeId = useDocsActiveSection(sectionIds);

  const sidebarNav = (
    <nav className="flex flex-col gap-0.5" aria-label={t("cosmosPayDev.docsPublicSidebarNavAria")}>
      <p className="mb-2 mt-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-cosmos-muted">
        {t("cosmosPayDev.docsPublicSidebarGroup")}
      </p>
      {tocItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={() => setMobileNav(false)}
          className="rounded-lg px-3 py-2 text-sm text-cosmos-muted transition-colors hover:bg-white/[0.06] hover:text-cosmos-text"
        >
          {item.label}
        </a>
      ))}
      <div className="my-4 border-t border-cosmos-border/50" />
      <Link
        to={DEV_CONSOLE}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-cosmos-muted transition-colors hover:bg-white/[0.06] hover:text-cosmos-text"
        onClick={() => setMobileNav(false)}
      >
        <TerminalSquare size={16} className="shrink-0 opacity-80" aria-hidden />
        {t("cosmosPayDev.docsPublicNavConsole")}
      </Link>
    </nav>
  );

  return (
    <div className="dark min-h-screen cosmos-app-chrome font-sans text-cosmos-text antialiased selection:bg-violet-500/25">
      <header className="sticky top-0 z-[100] border-b border-cosmos-border/45 bg-cosmos-bg/88 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-cosmos-muted transition-colors hover:bg-white/[0.06] hover:text-cosmos-text lg:hidden"
            onClick={() => setMobileNav(true)}
            aria-label={t("cosmosPayDev.docsPublicOpenNav")}
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-2.5 no-underline text-inherit">
            <img src="/logo.svg" alt="" className={`h-8 w-8 shrink-0 ${COSMOS_LOGO_THEME_CLASS}`} />
            <span className="hidden font-display text-sm font-semibold text-cosmos-text sm:inline">{t("layout.header.brandName")}</span>
          </Link>

          <nav
            className="ml-2 hidden min-w-0 items-center gap-1 md:flex"
            aria-label={t("cosmosPayDev.docsPublicTopNavAria")}
          >
            <span className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-cosmos-text">
              <BookOpen size={16} className="opacity-90" aria-hidden />
              {t("cosmosPayDev.docsPublicTopDocs")}
            </span>
            <a
              href="#quick-start"
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-cosmos-muted transition-colors hover:bg-white/[0.06] hover:text-cosmos-text"
            >
              <Code2 size={16} className="opacity-80" aria-hidden />
              {t("cosmosPayDev.docsPublicTopApi")}
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-cosmos-muted transition-colors hover:bg-white/[0.06] hover:text-cosmos-text"
            >
              <Home size={16} className="opacity-80" aria-hidden />
              {t("cosmosPayDev.docsPublicTopHome")}
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher variant="gateway" className="shrink-0" />
            <ThemeToggle variant="gateway" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-[1600px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[260px] shrink-0 flex-col border-r border-cosmos-border/45 lg:flex">
          <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-6">{sidebarNav}</div>
        </aside>

        {mobileNav && (
          <div className="fixed inset-0 z-[200] lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              aria-label={t("cosmosPayDev.docsPublicCloseNav")}
              onClick={() => setMobileNav(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-[min(100%,300px)] flex-col border-r border-cosmos-border/45 bg-cosmos-surface shadow-2xl">
              <div className="flex items-center justify-between border-b border-cosmos-border/45 px-4 py-3">
                <span className="text-sm font-semibold text-cosmos-text">{t("cosmosPayDev.docsPublicMobileNavTitle")}</span>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-cosmos-muted hover:bg-white/[0.06] hover:text-cosmos-text"
                  onClick={() => setMobileNav(false)}
                  aria-label={t("cosmosPayDev.docsPublicCloseNav")}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">{sidebarNav}</div>
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1">
          <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:max-w-[min(100%,720px)] lg:px-10 xl:px-12">
            <details className="mb-6 rounded-xl border border-cosmos-border/45 bg-cosmos-surface/55 px-3 py-2 sm:mb-8 xl:hidden">
              <summary className="cursor-pointer list-none text-sm font-medium text-cosmos-text [&::-webkit-details-marker]:hidden">
                {t("cosmosPayDev.docsOnThisPage")}
              </summary>
              <ApiDocsTocNav items={[...tocItems]} activeId={activeId} className="mt-3 pb-1" variant="inverse" />
            </details>
            <article className="public-docs-article min-w-0 pb-16 sm:pb-24 [&_h2]:text-cosmos-text [&_h3]:text-cosmos-text/95 [&_pre]:max-w-full [&_pre]:overflow-x-auto">
              <CosmosPayDocsArticle />
            </article>
          </div>

          <aside className="hidden w-[200px] shrink-0 xl:block">
            <nav
              aria-label={t("cosmosPayDev.docsOnThisPage")}
              className="sticky top-24 py-10 pr-4"
            >
              <p className="m-0 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-cosmos-muted">
                <ListTree size={14} className="opacity-80" aria-hidden />
                {t("cosmosPayDev.docsOnThisPage")}
              </p>
              <ApiDocsTocNav items={[...tocItems]} activeId={activeId} className="mt-4" variant="inverse" />
            </nav>
          </aside>
        </div>
      </div>

    </div>
  );
}
