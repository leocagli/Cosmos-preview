import { useEffect, useState } from "react";

const defaultOffset = 96;

/**
 * Resalta la entrada del TOC que corresponde al `<h2 id="…">` (u otro elemento)
 * más reciente por encima del umbral al hacer scroll.
 *
 * Pasá los mismos `id` que uses en tus `DocsH2` / anclas de sección.
 * Para evitar re-ejecutar el efecto en cada render, usá un array estable
 * (`as const` a nivel de módulo o `useMemo`).
 */
export function useDocsActiveSection(
  sectionIds: readonly string[],
  options?: { headerOffset?: number },
): string {
  const headerOffset = options?.headerOffset ?? defaultOffset;
  const idsKey = JSON.stringify(sectionIds);

  const [active, setActive] = useState(() => sectionIds[0] ?? "");

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActive("");
      return;
    }

    const ids = sectionIds;

    const tick = () => {
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= headerOffset) current = id;
      }
      setActive(current);
    };

    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, [idsKey, headerOffset]);

  return active;
}
