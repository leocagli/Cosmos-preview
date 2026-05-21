import { useCallback, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

type ApiDocsPageHeaderProps = {
  /** Texto pequeño encima del título (marca o “API reference”). */
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** Estilo del bloque superior (docs públicas oscuras vs tema cosmos). */
  variant?: "inverse" | "cosmos";
  /** Muestra botón copiar URL de la página. */
  showCopyUrl?: boolean;
  copyPageLabel?: string;
  copiedLabel?: string;
};

const shell = {
  inverse: {
    eyebrow: "text-xs font-medium uppercase tracking-widest text-cosmos-muted",
    title: "m-0 font-display text-3xl font-semibold tracking-tight text-cosmos-text md:text-4xl",
    intro: "mt-2 max-w-2xl text-base leading-relaxed text-cosmos-muted md:text-[17px]",
    border: "border-cosmos-border/45",
    button:
      "inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-cosmos-border/50 bg-white/[0.05] px-3 py-2 text-xs font-medium text-cosmos-text transition-colors hover:bg-white/[0.1]",
  },
  cosmos: {
    eyebrow: "m-0 text-xs font-medium uppercase tracking-widest text-cosmos-muted",
    title: "m-0 font-display text-3xl font-semibold tracking-tight text-cosmos-text md:text-4xl",
    intro: "mt-2 max-w-2xl text-base leading-relaxed text-cosmos-muted md:text-[17px]",
    border: "border-cosmos-border/70",
    button:
      "inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-cosmos-border bg-cosmos-surface/60 px-3 py-2 text-xs font-medium text-cosmos-text transition-colors hover:bg-cosmos-surface-elevated/80",
  },
} as const;

/**
 * Cabecera típica de una página de documentación de API (título + intro + copiar enlace).
 */
export function ApiDocsPageHeader({
  eyebrow,
  title,
  intro,
  variant = "inverse",
  showCopyUrl = true,
  copyPageLabel = "Copy page",
  copiedLabel = "Copied",
}: ApiDocsPageHeaderProps) {
  const [copied, setCopied] = useState(false);
  const s = shell[variant];

  const copyPage = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <header className={["mb-10 border-b pb-8", s.border].join(" ")}>
      {eyebrow ? <p className={s.eyebrow}>{eyebrow}</p> : null}
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className={s.title}>{title}</h1>
          {intro ? <p className={s.intro}>{intro}</p> : null}
        </div>
        {showCopyUrl ? (
          <button type="button" onClick={copyPage} className={s.button}>
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? copiedLabel : copyPageLabel}
          </button>
        ) : null}
      </div>
    </header>
  );
}
