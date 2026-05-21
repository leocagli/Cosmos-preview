import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BrandLogo } from "./BrandLogo";
import { useTheme } from "../context/ThemeContext";

const PANEL_COSMOS_PAY = "/panel/developers/cosmos-pay";
const PUBLIC_DOCS = "/docs/cosmos-pay";
const SITE_URL = "https://cosmos.cloudycoding.com/";

type SimpleFooterProps = {
  /** Alineado con el landing Cosmos Pay (violeta / General Sans). */
  variant?: "default" | "gateway";
};

export function SimpleFooter({ variant = "default" }: SimpleFooterProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  /** Misma estética que el pie del landing (violeta / negro) en tema oscuro o ruta gateway */
  const isGateway = variant === "gateway" || theme === "dark";

  if (isGateway) {
    return (
      <footer className="gateway-hero mt-auto border-t border-purple-900/[0.08] bg-black text-white">
        <div
          className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-violet-400/25 to-transparent"
          aria-hidden
        />
        <div className="mx-auto w-full max-w-[1600px] px-6 py-12 md:px-[120px] md:py-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <div className="flex min-w-0 flex-col gap-4 sm:max-w-xl">
              <Link
                to="/"
                className="flex w-fit shrink-0 items-center gap-2.5 no-underline transition-opacity hover:opacity-90 hover:!text-white"
              >
                <BrandLogo variant="full" alt={t("layout.header.brandAlt")} brandOnDark className="h-7 w-auto" />
                <span className="text-[15px] font-semibold tracking-tight text-white/95">{t("layout.footer.cosmosPay")}</span>
              </Link>
              <p className="m-0 text-sm leading-relaxed text-white/55">{t("layout.footer.tagline")}</p>
            </div>

            <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium lg:shrink-0 lg:pt-1">
              <Link
                to={PANEL_COSMOS_PAY}
                className="text-white/70 no-underline transition-colors duration-200 hover:!text-white"
              >
                {t("cosmosPayDev.consoleTitle")}
              </Link>
              <Link
                to={PUBLIC_DOCS}
                className="text-white/70 no-underline transition-colors duration-200 hover:!text-white"
              >
                {t("cosmosPayDev.navDocs")}
              </Link>
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 no-underline transition-colors duration-200 hover:!text-white"
              >
                {t("layout.footer.website")}
              </a>
            </nav>
          </div>

          <p className="m-0 mt-10 border-t border-white/[0.06] pt-8 text-center text-xs text-white/40 lg:text-left">
            {t("layout.footer.rights", { year })}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-cosmos-border/70 bg-cosmos-surface/40 backdrop-blur-sm dark:bg-cosmos-bg/80">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <BrandLogo variant="full" className="h-7 w-auto shrink-0" alt="" />
          <p className="m-0 max-w-md text-sm leading-relaxed text-cosmos-muted">{t("layout.footer.tagline")}</p>
        </div>
        <div className="flex flex-col gap-4 sm:items-end md:flex-row md:items-center md:gap-8">
          <Link
            to={PANEL_COSMOS_PAY}
            className="w-fit text-sm font-medium text-cosmos-muted transition-colors hover:text-cosmos-accent"
          >
            {t("cosmosPayDev.consoleTitle")}
          </Link>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-sm font-medium text-cosmos-muted transition-colors hover:text-cosmos-accent"
          >
            {t("layout.footer.website")}
          </a>
          <p className="m-0 text-xs text-cosmos-muted/90">{t("layout.footer.rights", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
