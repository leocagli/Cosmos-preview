export type ApiDocsTocItem = { id: string; label: string };

type Variant = "inverse" | "cosmos";

const variants: Record<
  Variant,
  { active: string; idle: string }
> = {
  inverse: {
    active: "border-cosmos-accent font-medium text-cosmos-text",
    idle: "border-transparent text-cosmos-muted hover:text-cosmos-text",
  },
  cosmos: {
    active: "border-cosmos-accent font-medium text-cosmos-text",
    idle: "border-transparent text-cosmos-muted hover:text-cosmos-text",
  },
};

/**
 * Lista de enlaces `#ancla` para “On this page” o sidebar.
 * El `id` debe coincidir con `DocsH2 id="…"` (u otro elemento con el mismo `id`).
 */
export function ApiDocsTocNav({
  items,
  activeId,
  className = "",
  variant = "inverse",
}: {
  items: readonly ApiDocsTocItem[];
  activeId: string;
  className?: string;
  variant?: Variant;
}) {
  const v = variants[variant];

  return (
    <ul className={["m-0 list-none space-y-1 p-0", className].filter(Boolean).join(" ")}>
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={[
                "block border-l-2 py-1.5 pl-3 text-[13px] leading-snug transition-colors",
                active ? v.active : v.idle,
              ].join(" ")}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
