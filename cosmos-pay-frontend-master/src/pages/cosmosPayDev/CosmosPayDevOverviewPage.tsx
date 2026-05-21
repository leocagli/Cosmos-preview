import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen, KeyRound, Link2 } from "lucide-react";
import { PanelPageHeader, PANEL_SURFACE_CARD_CLASS } from "../../components/panel/panelLayout";
import { CosmosPayDevStatsPanel } from "../../components/cosmosPay/CosmosPayDevStatsPanel";

export function CosmosPayDevOverviewPage() {
  const { t } = useTranslation();
  const base = "/panel/developers/cosmos-pay";

  const cards = [
    {
      to: `${base}/llaves`,
      title: t("cosmosPayDev.cardKeysTitle"),
      body: t("cosmosPayDev.cardKeysBody"),
      Icon: KeyRound,
    },
    {
      to: `${base}/links`,
      title: t("cosmosPayDev.cardLinksTitle"),
      body: t("cosmosPayDev.cardLinksBody"),
      Icon: Link2,
    },
    {
      to: "/docs/cosmos-pay",
      title: t("cosmosPayDev.cardDocsTitle"),
      body: t("cosmosPayDev.cardDocsBody"),
      Icon: BookOpen,
      openInNewTab: true,
    },
  ];

  return (
    <div className="pb-4">
      <PanelPageHeader title={t("cosmosPayDev.overviewTitle")} description={t("cosmosPayDev.overviewLead")} />
      <CosmosPayDevStatsPanel />
      <div className="mt-2 mb-4 flex flex-col gap-2 border-b border-cosmos-border/50 pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-cosmos-muted m-0 mb-1">
            {t("cosmosPayDev.pageEyebrow")}
          </p>
          <h2 className="font-display font-semibold text-cosmos-text text-lg m-0">{t("cosmosPayDev.overviewQuickLinks")}</h2>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {cards.map(({ to, title, body, Icon, openInNewTab }) => (
          <Link
            key={to}
            to={to}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            className={[
              "group block no-underline text-inherit",
              PANEL_SURFACE_CARD_CLASS,
              "p-6 sm:p-7 min-h-[140px] transition-colors hover:bg-cosmos-surface-elevated/30",
            ].join(" ")}
          >
            <div className="relative z-[1] flex flex-col h-full min-h-[140px]">
              <div className="w-12 h-12 rounded-2xl bg-cosmos-accent/10 border border-cosmos-accent/20 flex items-center justify-center mb-4">
                <Icon size={22} className="text-cosmos-accent" aria-hidden />
              </div>
              <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">{title}</h2>
              <p className="text-sm text-cosmos-muted m-0 flex-1 leading-relaxed">{body}</p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-cosmos-accent">
                {t("cosmosPayDev.overviewCardCta")}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
