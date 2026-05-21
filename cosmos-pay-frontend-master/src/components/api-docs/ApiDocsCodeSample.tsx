import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { DocsCodeTone } from "./primitives";

type ApiDocsCodeSampleProps = {
  code: string;
  /** Etiqueta encima del bloque (ej. “cURL”, “Response”). */
  title?: string;
  tone?: DocsCodeTone;
  showCopy?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
};

const preTone: Record<DocsCodeTone, string> = {
  default:
    "mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-cosmos-border bg-[#0d1117] p-4 font-mono text-xs leading-relaxed text-gray-200 dark:border-cosmos-border/80",
  inverse:
    "mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-cosmos-border/50 bg-cosmos-surface/90 p-4 font-mono text-xs leading-relaxed text-cosmos-text",
};

/**
 * Bloque de código con botón copiar; mismo aspecto que `DocsCodeBlock` pero interactivo.
 */
export function ApiDocsCodeSample({
  code,
  title,
  tone = "default",
  showCopy = true,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  className = "",
}: ApiDocsCodeSampleProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className={["relative mt-4", className].filter(Boolean).join(" ")}>
      {(title || showCopy) && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          {title ? <span className="text-sm font-semibold text-cosmos-text dark:text-zinc-200">{title}</span> : <span />}
          {showCopy ? (
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md border border-cosmos-border/80 bg-cosmos-bg/80 px-2 py-1 text-[11px] font-medium text-cosmos-muted transition-colors hover:text-cosmos-text dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:text-white"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              {copied ? copiedLabel : copyLabel}
            </button>
          ) : null}
        </div>
      )}
      <pre className={preTone[tone]}>{code}</pre>
    </div>
  );
}
