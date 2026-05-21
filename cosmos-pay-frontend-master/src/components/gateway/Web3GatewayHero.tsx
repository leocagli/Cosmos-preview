import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { BrandLogo } from "../BrandLogo";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { ThemeToggle } from "../ThemeToggle";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4";

const PANEL_COSMOS_PAY = "/panel/developers/cosmos-pay";
const PUBLIC_DOCS = "/docs/cosmos-pay";

function navLinkClass(isActive: boolean) {
  return [
    "text-[14px] font-medium no-underline transition-colors",
    isActive ? "text-white" : "text-white/90 hover:!text-white",
  ].join(" ");
}

/** Enlaces del hero: versión compacta para la franja scroll en &lt;md */
function navLinkClassCompact(isActive: boolean) {
  return [
    "shrink-0 text-[13px] font-medium no-underline transition-colors sm:text-sm",
    isActive ? "text-white" : "text-white/85 hover:text-white",
  ].join(" ");
}

const ctaPillInner =
  "relative z-[1] rounded-full px-5 py-2.5 text-[13px] font-medium transition-opacity duration-200 group-hover:opacity-95 sm:px-[29px] sm:py-[11px] sm:text-[14px]";

function HeroCtaNav() {
  const { t } = useTranslation();
  return (
    <Link
      to="/auth/registro"
      className="group relative inline-flex rounded-full border-2 border-white/20 bg-transparent p-0 text-left shadow-none outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <span className={`${ctaPillInner} bg-black/50 text-white`}>
        <span
          className="pointer-events-none absolute left-1/2 top-0 z-10 h-5 w-[55%] -translate-x-1/2 rounded-full bg-gradient-to-b from-white/35 to-transparent opacity-90 blur-md"
          aria-hidden
        />
        <span className="relative z-[1]">{t("layout.header.createAccount")}</span>
      </span>
    </Link>
  );
}

function HeroCtaPrimary() {
  const { t } = useTranslation();
  return (
    <Link
      to="/auth/registro"
      className="group relative inline-flex rounded-full border-[0.6px] border-white bg-transparent p-0 text-left shadow-none outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <span className={`${ctaPillInner} bg-white text-black`}>
        <span
          className="pointer-events-none absolute left-1/2 top-0 z-10 h-5 w-[55%] -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-100/95 to-transparent opacity-90 blur-md"
          aria-hidden
        />
        <span className="relative z-[1]">{t("layout.header.createAccount")}</span>
      </span>
    </Link>
  );
}

function GatewayNavbarSession() {
  const { t } = useTranslation();
  const { isLoggedIn, user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="h-10 w-[min(100%,160px)] animate-pulse rounded-full bg-white/10 sm:w-[180px]"
        aria-hidden
      />
    );
  }

  if (isLoggedIn) {
    return (
      <div className="flex min-w-0 max-w-[min(100%,14rem)] items-center gap-1.5 border-l border-white/[0.12] pl-2 sm:max-w-none sm:gap-2 sm:pl-3 md:gap-3 md:pl-4">
        <span className="hidden max-w-[120px] truncate text-xs text-white/65 sm:inline sm:max-w-[140px]" title={user?.email ?? undefined}>
          {user?.email}
        </span>
        <button
          type="button"
          onClick={() => logout()}
          className="shrink-0 rounded-full px-2 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/[0.08] hover:text-white sm:px-3 sm:py-2 sm:text-sm"
        >
          {t("auth.logout")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        to="/auth/login"
        className="inline-flex shrink-0 rounded-full px-2 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white sm:px-2 sm:py-2 sm:text-sm"
      >
        {t("layout.header.login")}
      </Link>
      <HeroCtaNav />
    </div>
  );
}

function GatewayNavbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isCosmosPayCta = pathname.startsWith("/auth/registro");
  const isDocs = pathname.startsWith(PUBLIC_DOCS);
  const isDevConsole = pathname.startsWith(PANEL_COSMOS_PAY) && !isDocs;

  const navInner = (
    <>
      <NavLink to="/" end className={({ isActive }) => navLinkClass(isActive)}>
        {t("layout.header.breadcrumbHome")}
      </NavLink>
      <Link
        to="/auth/registro"
        className={navLinkClass(isCosmosPayCta)}
        aria-current={isCosmosPayCta ? "page" : undefined}
      >
        {t("layout.gatewayNav.getStarted")}
      </Link>
      <Link
        to={PANEL_COSMOS_PAY}
        className={navLinkClass(isDevConsole)}
        aria-current={isDevConsole ? "page" : undefined}
      >
        {t("layout.gatewayNav.developers")}
      </Link>
      <Link to={PUBLIC_DOCS} className={navLinkClass(isDocs)} aria-current={isDocs ? "page" : undefined}>
        {t("cosmosPayDev.navDocs")}
      </Link>
    </>
  );

  const navInnerCompact = (
    <>
      <NavLink to="/" end className={({ isActive }) => navLinkClassCompact(isActive)}>
        {t("layout.header.breadcrumbHome")}
      </NavLink>
      <Link
        to="/auth/registro"
        className={navLinkClassCompact(isCosmosPayCta)}
        aria-current={isCosmosPayCta ? "page" : undefined}
      >
        {t("layout.gatewayNav.getStarted")}
      </Link>
      <Link
        to={PANEL_COSMOS_PAY}
        className={navLinkClassCompact(isDevConsole)}
        aria-current={isDevConsole ? "page" : undefined}
      >
        {t("layout.gatewayNav.developers")}
      </Link>
      <Link to={PUBLIC_DOCS} className={navLinkClassCompact(isDocs)} aria-current={isDocs ? "page" : undefined}>
        {t("cosmosPayDev.navDocs")}
      </Link>
    </>
  );

  return (
    <header className="flex w-full shrink-0 flex-col border-b border-white/[0.07] bg-black/25 backdrop-blur-md md:border-b-0 md:bg-transparent md:backdrop-blur-none">
      {/* Fila 1: logo equilibrado con controles; sin wrap que rompa sm–md */}
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-3 px-4 py-3.5 sm:px-6 sm:py-4 md:gap-6 md:px-8 md:py-5 lg:px-12 xl:px-16 2xl:px-[120px]">
        <div className="flex min-w-0 flex-1 items-center justify-start">
          <Link
            to="/"
            className="flex min-w-0 max-w-[100%] items-center gap-2 text-white no-underline hover:!text-white"
            aria-label={t("layout.header.homeAria")}
          >
            <BrandLogo variant="full" alt={t("layout.header.brandAlt")} brandOnDark className="h-[22px] w-auto shrink-0 sm:h-[25px]" />
            <span className="truncate text-[14px] font-semibold tracking-tight sm:text-[15px]">{t("layout.footer.cosmosPay")}</span>
          </Link>
        </div>

        <nav
          className="hidden shrink-0 items-center gap-5 text-[14px] md:flex lg:gap-7 xl:gap-8 2xl:gap-[30px]"
          aria-label={t("layout.gatewayNav.aria")}
        >
          {navInner}
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3 md:gap-4">
          <div className="flex shrink-0 items-center gap-0.5">
            <ThemeToggle variant="gateway" />
            <LanguageSwitcher variant="gateway" />
          </div>
          <GatewayNavbarSession />
        </div>
      </div>

      {/* Franja scroll: &lt;md — evita “hueco” sin enlaces y alivia el top en tablet */}
      <div className="md:hidden">
        <nav
          className="mx-auto w-full max-w-[1280px] overflow-x-auto overflow-y-hidden border-t border-white/[0.08] px-4 py-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-6"
          aria-label={t("layout.gatewayNav.aria")}
        >
          <div className="flex w-max min-w-full items-center justify-center gap-x-6 gap-y-1 pb-0.5 sm:gap-x-8">
            {navInnerCompact}
          </div>
        </nav>
      </div>
    </header>
  );
}

export function Web3GatewayHero() {
  const { t } = useTranslation();

  return (
    <section
      className="gateway-hero relative min-h-screen w-full overflow-hidden bg-[#1a0b2e] text-white"
      aria-label={t("cosmosPay.gatewayHero.sectionAria")}
    >
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover [filter:brightness(0.92)_contrast(1.05)_saturate(1.12)_hue-rotate(10deg)]"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      {/* Tinte violeta (mezcla sobre el vídeo) */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-violet-600/45 mix-blend-color"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-violet-950/55 via-fuchsia-950/25 to-black/50"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/35" aria-hidden />

      <div className="relative z-[2] flex min-h-screen flex-col">
        <GatewayNavbar />

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 pb-10 sm:px-6 sm:py-8 sm:pb-14 md:justify-center md:py-10 md:pb-16 lg:py-12 lg:pb-20">
          <div className="flex w-full max-w-[960px] flex-col items-center text-center">
            <div
              className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-black/25 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md sm:gap-2.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5"
              role="status"
            >
              <span
                className="h-1 w-1 shrink-0 rounded-full bg-gradient-to-b from-violet-300/90 to-violet-600/80 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                aria-hidden
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 sm:text-[11px] sm:tracking-[0.2em]">
                {t("cosmosPay.badge")}
              </span>
              <span className="h-3 w-px shrink-0 bg-white/[0.12]" aria-hidden />
              <span className="text-[12px] font-medium leading-snug text-white/[0.9] sm:text-[13px]">
                {t("cosmosPay.titleAccent")}
              </span>
            </div>

            <div className="mt-6 flex w-full flex-col items-center gap-4 sm:mt-8 sm:gap-5 md:mt-10 md:gap-6">
              <h1
                className="m-0 w-full max-w-[min(100%,56rem)] whitespace-pre-line text-balance text-center text-[clamp(1.5rem,4.5vw+0.85rem,3.5rem)] font-medium leading-[1.18] sm:leading-[1.24] lg:text-[3.5rem] lg:leading-[1.2]"
                style={{
                  background: "linear-gradient(144.5deg, #ffffff 28%, rgba(0,0,0,0) 115%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {t("cosmosPay.gatewayHero.headline")}
              </h1>

              <p className="m-0 max-w-[680px] px-0.5 text-[13px] font-normal leading-relaxed text-white/70 sm:px-1 sm:text-[15px]">
                {t("cosmosPay.intro")}
              </p>

              <p className="m-0 max-w-[640px] text-[12px] font-normal leading-relaxed text-white/50 sm:text-[13px] md:text-sm">
                {t("cosmosPay.gatewayHero.devHint")}
              </p>
            </div>

            <p className="mt-4 text-center text-[11px] font-normal leading-snug text-white/45 sm:mt-5 sm:text-xs">
              {t("cosmosPay.feeNote")}
            </p>

            <div className="mt-6 sm:mt-8 md:mt-10">
              <HeroCtaPrimary />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
