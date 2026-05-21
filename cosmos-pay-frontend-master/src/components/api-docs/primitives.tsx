import type { ReactNode } from "react";
import { Info, KeyRound, ListOrdered } from "lucide-react";

export function DocsCallout({
  children,
  title,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "my-6 flex gap-3 rounded-xl border border-cosmos-accent/25 bg-cosmos-accent/[0.06] px-4 py-3.5 dark:bg-cosmos-accent/[0.1]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Info className="mt-0.5 size-5 shrink-0 text-cosmos-accent" aria-hidden />
      <div className="min-w-0 text-sm leading-relaxed text-cosmos-text">
        {title ? <p className="m-0 mb-1 font-semibold text-cosmos-text">{title}</p> : null}
        <div className="text-cosmos-muted [&_strong]:font-semibold [&_strong]:text-cosmos-text">{children}</div>
      </div>
    </div>
  );
}

/** Sección de artículo; podés pasar `id` si necesitás anclar toda la sección. */
export function DocsSection({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

export function DocsH1({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h1
      id={id}
      className="scroll-mt-28 font-display text-2xl font-semibold tracking-tight text-cosmos-text md:text-3xl"
    >
      {children}
    </h1>
  );
}

export function DocsH2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-28 font-display text-xl font-semibold tracking-tight text-cosmos-text md:text-2xl mt-8">
      {children}
    </h2>
  );
}

export function DocsH3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className="mt-8 scroll-mt-28 font-display text-base font-semibold text-cosmos-text md:text-lg">
      {children}
    </h3>
  );
}

export function DocsH4({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h4 id={id} className="mt-6 scroll-mt-24 text-sm font-semibold uppercase tracking-wider text-cosmos-muted">
      {children}
    </h4>
  );
}

export function DocsP({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-[15px] leading-relaxed text-cosmos-muted md:text-base">{children}</p>;
}

export function DocsUl({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-3 list-none space-y-2 pl-0 text-[15px] leading-relaxed text-cosmos-muted md:text-base">{children}</ul>
  );
}

export function DocsLi({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-5 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-cosmos-accent/70">
      {children}
    </li>
  );
}

export type DocsCodeTone = "default" | "inverse";

const codeToneClass: Record<DocsCodeTone, string> = {
  default:
    "mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-cosmos-border bg-[#0d1117] p-4 font-mono text-xs leading-relaxed text-gray-200 dark:border-cosmos-border/80",
  inverse:
    "mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-cosmos-border/50 bg-cosmos-surface/90 p-4 font-mono text-xs leading-relaxed text-cosmos-text",
};

export function DocsCodeBlock({ children, tone = "default" }: { children: string; tone?: DocsCodeTone }) {
  return <pre className={codeToneClass[tone]}>{children}</pre>;
}

export function DocsInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-cosmos-bg px-1.5 py-0.5 font-mono text-[0.8125rem] text-cosmos-text ring-1 ring-cosmos-border/80">
      {children}
    </code>
  );
}

export function DocsSteps({
  title,
  steps,
  stepLabel = (index: number) => `Step ${index + 1}`,
}: {
  title: string;
  steps: { title: string; body: ReactNode }[];
  stepLabel?: (index: number) => string;
}) {
  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cosmos-muted">
        <ListOrdered className="size-4" aria-hidden />
        {title}
      </div>
      <ol className="m-0 list-none space-y-3 p-0">
        {steps.map((step, i) => (
          <li
            key={i}
            className="rounded-xl border border-cosmos-border/80 bg-cosmos-surface/50 p-4 shadow-sm dark:bg-cosmos-surface/30"
          >
            <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-cosmos-muted">{stepLabel(i)}</p>
            <p className="mt-1 font-display text-base font-semibold text-cosmos-text">{step.title}</p>
            <div className="mt-2 text-[15px] leading-relaxed text-cosmos-muted">{step.body}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function DocsKeyPoint({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 flex gap-3 rounded-xl border border-cosmos-border/80 bg-cosmos-surface/60 px-4 py-3.5 dark:bg-cosmos-surface/40">
      <KeyRound className="mt-0.5 size-5 shrink-0 text-cosmos-muted" aria-hidden />
      <div className="min-w-0 text-sm leading-relaxed text-cosmos-muted">{children}</div>
    </div>
  );
}

/** Tabla para campos de request/response; usá `DocsTh` / `DocsTd` dentro. */
export function DocsTable({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={["mt-4 overflow-x-auto rounded-xl border border-cosmos-border/80 dark:border-cosmos-border/60", className].join(" ")}>
      <table className="w-full min-w-[480px] border-collapse text-left text-[14px]">{children}</table>
    </div>
  );
}

export function DocsTh({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={[
        "border-b border-cosmos-border/80 bg-cosmos-surface/50 px-3 py-2.5 font-semibold text-cosmos-text dark:bg-cosmos-surface/30",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </th>
  );
}

export function DocsTd({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={["border-b border-cosmos-border/50 px-3 py-2.5 align-top text-cosmos-muted", className].filter(Boolean).join(" ")}>
      {children}
    </td>
  );
}
