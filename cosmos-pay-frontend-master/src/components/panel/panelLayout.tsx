import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Contenedor principal de páginas bajo RoleSidebarLayout (mismo criterio que /panel).
 * Sin fondo ni padding extra: el layout ya aplica bg-cosmos-bg y px-6 py-6.
 */
export function PanelPageShell({
  children,
  className = "",
  /** Ancho máximo del contenido (por defecto igual que /panel). */
  maxWidthClass = "max-w-full",
}: {
  children: ReactNode;
  className?: string;
  maxWidthClass?: string;
}) {
  return (
    <div className={["min-h-[60vh] w-full", maxWidthClass, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

/** Cabecera tipo PanelHome: título display + subtítulo muted; acciones opcionales a la derecha. */
export function PanelPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="m-0 mb-2 font-display text-xl font-semibold tracking-tight text-cosmos-text sm:text-2xl md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="m-0 max-w-2xl text-sm leading-relaxed text-cosmos-muted md:text-[15px]">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:shrink-0">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Superficie tipo PanelStatsStrip / ChartCard: borde suave + brillo diagonal.
 * El contenido debe ir en un hijo con `relative z-[1]` si solapa el pseudo-elemento.
 */
export const PANEL_SURFACE_CLASS = [
  "relative overflow-hidden rounded-lg",
  "border border-cosmos-border/70 z-[1]",
  "before:pointer-events-none before:absolute before:inset-0",
  "before:bg-gradient-to-br before:from-white/[0.04] before:to-transparent before:to-40%",
].join(" ");

/**
 * Misma capa visual que la tabla / toolbar de links de pago (`PANEL_SURFACE_CLASS`), con radios más altos para tarjetas.
 */
export const PANEL_SURFACE_CARD_CLASS = [
  "relative overflow-hidden rounded-2xl",
  "border border-cosmos-border/70 z-[1]",
  "before:pointer-events-none before:absolute before:inset-0",
  "before:bg-gradient-to-br before:from-white/[0.04] before:to-transparent before:to-40%",
].join(" ");

/** Misma superficie que links de pago, con radio amplio para agrupar KPIs + gráficos en el overview. */
export const PANEL_SURFACE_SECTION_CLASS = [
  "relative overflow-hidden rounded-3xl",
  "border border-cosmos-border/70 z-[1]",
  "before:pointer-events-none before:absolute before:inset-0",
  "before:bg-gradient-to-br before:from-white/[0.04] before:to-transparent before:to-40%",
].join(" ");

/** Navegación secundaria (migas locales) alineada al estilo del panel. */
export function PanelSubNav({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <nav
      className={[
        "flex items-center gap-1.5 flex-wrap text-xs text-cosmos-muted mb-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Navegación de sección"
    >
      {children}
    </nav>
  );
}

export function PanelSubNavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="hover:text-cosmos-text transition-colors">
      {children}
    </Link>
  );
}
