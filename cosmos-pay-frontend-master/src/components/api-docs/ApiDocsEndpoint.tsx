import type { ReactNode } from "react";

const methodStyles: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30",
  POST: "bg-cosmos-accent/15 text-cosmos-accent ring-cosmos-accent/25",
  PUT: "bg-amber-500/15 text-amber-700 dark:text-amber-400 ring-amber-500/30",
  PATCH: "bg-amber-500/15 text-amber-700 dark:text-amber-400 ring-amber-500/30",
  DELETE: "bg-red-500/15 text-red-600 dark:text-red-400 ring-red-500/30",
};

/**
 * Fila con método HTTP y ruta en monospace (para listar endpoints).
 *
 * @example
 * <ApiDocsEndpoint method="POST" path="/cosmos-pay/v1/payment-links" />
 */
export function ApiDocsEndpoint({
  method,
  path,
  children,
  className = "",
}: {
  method: string;
  path: string;
  children?: ReactNode;
  className?: string;
}) {
  const m = method.toUpperCase();
  const badge = methodStyles[m] ?? "bg-cosmos-surface/80 text-cosmos-muted ring-cosmos-border/60";

  return (
    <div
      className={[
        "flex flex-wrap items-baseline gap-2 rounded-lg border border-cosmos-border/70 bg-cosmos-surface/40 px-3 py-2 font-mono text-sm dark:bg-cosmos-surface/25",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "inline-flex shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset",
          badge,
        ].join(" ")}
      >
        {m}
      </span>
      <span className="min-w-0 break-all text-cosmos-text">{path}</span>
      {children}
    </div>
  );
}
