import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CreditCard } from "lucide-react";
import { getPublicPaymentLink, type PublicPaymentLinkMeta } from "../../api/cosmosPayDev";
import { getErrorMessage } from "../../api/client";
import { formatUsdc } from "../../utils/formatUsdc";

export function CosmosPayLinkPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<PublicPaymentLinkMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const meta = await getPublicPaymentLink(slug);
        if (!cancelled) setData(meta);
      } catch (e) {
        if (!cancelled) {
          setError(getErrorMessage(e, t("cosmosPayDev.payInvalid")));
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, t]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cosmos-bg px-6">
        <p className="text-cosmos-muted">{t("cosmosPayDev.payLoading")}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-cosmos-muted max-w-md">{error ?? t("cosmosPayDev.payInvalid")}</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-cosmos-accent font-medium hover:underline">
          {t("cosmosPayDev.payBack")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12 md:py-20">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 text-center sm:mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cosmos-accent bg-cosmos-accent-soft rounded-lg">
            <CreditCard size={14} />
            {t("cosmosPayDev.paySubtitle")}
          </span>
          <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl mt-4 m-0">{data.title}</h1>
          {data.description ? (
            <p className="text-cosmos-muted text-sm mt-2 m-0 leading-relaxed">{data.description}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-cosmos-border/80 bg-cosmos-surface/95 p-5 shadow-xl ring-1 ring-cosmos-border/40 backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-cosmos-muted m-0 mb-2">{t("cosmosPayDev.payAmount")}</p>
          <p className="font-display text-4xl font-bold text-cosmos-text m-0 tabular-nums">
            {formatUsdc(data.amount, i18n.language)}
          </p>
          <p className="text-xs text-cosmos-muted mt-2 m-0">{t("cosmosPayDev.payUsdcNote")}</p>
          <p className="text-sm text-cosmos-muted mt-6 m-0 leading-relaxed border-t border-cosmos-border pt-6">
            {t("cosmosPayDev.payCtaNote")}
          </p>
        </div>

        <div className="text-center mt-10">
          <Link to="/" className="text-sm text-cosmos-accent hover:underline">
            {t("cosmosPayDev.payBack")}
          </Link>
        </div>
      </div>
    </div>
  );
}
