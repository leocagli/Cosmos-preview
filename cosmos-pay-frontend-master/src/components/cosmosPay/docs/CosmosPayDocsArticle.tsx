import { useTranslation } from "react-i18next";
import {
  ApiDocsCodeSample,
  ApiDocsEndpoint,
  ApiDocsPageHeader,
  DocsCallout,
  DocsCodeBlock,
  DocsH2,
  DocsH3,
  DocsInlineCode,
  DocsKeyPoint,
  DocsP,
  DocsSteps,
} from "../../api-docs";

const VITE = import.meta.env.VITE_API_URL ?? "";

export const COSMOS_PAY_DOCS_SECTION_IDS = [
  "quick-start",
  "base-url",
  "post-payment-links",
  "public-link-get",
  "dashboard-jwt",
] as const;

export function CosmosPayDocsArticle() {
  const { t } = useTranslation();
  const base = (VITE || "https://api.tu-dominio.com/api/v1").replace(/\/$/, "");

  const curlCreate = `curl -sS -X POST '${base}/cosmos-pay/v1/payment-links' \\
  -H 'Content-Type: application/json' \\
  -H 'X-API-Key: cosmospay__TU_SECRETO' \\
  -d '{"title":"Pedido","amount":49.99}'`;

  const curlPublic = `curl -sS '${base}/public/cosmos-pay/links/{slug}'`;

  const quickSteps = [
    {
      title: t("cosmosPayDev.docsQuickStep1Title"),
      body: t("cosmosPayDev.docsQuickStep1Body"),
    },
    {
      title: t("cosmosPayDev.docsQuickStep2Title"),
      body: t("cosmosPayDev.docsQuickStep2Body"),
    },
    {
      title: t("cosmosPayDev.docsQuickStep3Title"),
      body: t("cosmosPayDev.docsQuickStep3Body"),
    },
  ];

  return (
    <>
      <ApiDocsPageHeader
        eyebrow={t("cosmosPayDev.docsPublicEyebrow")}
        title={t("cosmosPayDev.docsTitle")}
        intro={t("cosmosPayDev.docsIntro")}
        variant="inverse"
        copyPageLabel={t("cosmosPayDev.docsCopyPage")}
        copiedLabel={t("cosmosPayDev.docsCopyDone")}
      />

      <DocsCallout
        title={t("cosmosPayDev.docsCalloutTitle")}
        className="border-cosmos-border/45 bg-cosmos-surface/45"
      >
        {t("cosmosPayDev.docsCalloutBody")}
      </DocsCallout>

      <section>
        <DocsH2 id="quick-start">{t("cosmosPayDev.docsQuickStartHeading")}</DocsH2>
        <DocsP>{t("cosmosPayDev.docsQuickStartLead")}</DocsP>
        <DocsSteps
          title={t("cosmosPayDev.docsStepsLabel")}
          stepLabel={(i) => t("cosmosPayDev.docsStepLabel", { n: i + 1 })}
          steps={quickSteps}
        />
      </section>

      <section>
        <DocsH2 id="base-url">{t("cosmosPayDev.docsBaseTitle")}</DocsH2>
        <DocsP>
          {t("cosmosPayDev.docsBaseLead")} <DocsInlineCode>VITE_API_URL</DocsInlineCode>
        </DocsP>
        <DocsCodeBlock tone="inverse">{base || t("cosmosPayDev.docsBaseMissing")}</DocsCodeBlock>
      </section>

      <section>
        <DocsH2 id="post-payment-links">{t("cosmosPayDev.docsPostTitle")}</DocsH2>
        <div className="mt-3">
          <ApiDocsEndpoint method="POST" path={`${base}/cosmos-pay/v1/payment-links`} />
        </div>
        <DocsP>{t("cosmosPayDev.docsPostLead")}</DocsP>
        <DocsH3>{t("cosmosPayDev.docsPostExampleTitle")}</DocsH3>
        <ApiDocsCodeSample
          code={curlCreate}
          tone="inverse"
          copyLabel={t("cosmosPayDev.docsCodeCopy")}
          copiedLabel={t("cosmosPayDev.docsCopyDone")}
        />
      </section>

      <section>
        <DocsH2 id="public-link-get">{t("cosmosPayDev.docsGetTitle")}</DocsH2>
        <div className="mt-3">
          <ApiDocsEndpoint method="GET" path={`${base}/public/cosmos-pay/links/{slug}`} />
        </div>
        <DocsP>{t("cosmosPayDev.docsGetLead")}</DocsP>
        <DocsH3>{t("cosmosPayDev.docsGetExampleTitle")}</DocsH3>
        <ApiDocsCodeSample
          code={curlPublic}
          tone="inverse"
          copyLabel={t("cosmosPayDev.docsCodeCopy")}
          copiedLabel={t("cosmosPayDev.docsCopyDone")}
        />
      </section>

      <section>
        <DocsH2 id="dashboard-jwt">{t("cosmosPayDev.docsJwtTitle")}</DocsH2>
        <DocsKeyPoint>{t("cosmosPayDev.docsJwtLead")}</DocsKeyPoint>
      </section>
    </>
  );
}
