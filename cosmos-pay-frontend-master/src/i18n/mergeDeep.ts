export function mergeDeep<T extends Record<string, unknown>>(base: T, ...sources: Partial<T>[]): T {
  const out: Record<string, unknown> = { ...base };
  for (const src of sources) {
    for (const key of Object.keys(src)) {
      const v = (src as Record<string, unknown>)[key];
      const cur = out[key];
      if (
        v !== null &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        cur !== null &&
        typeof cur === "object" &&
        !Array.isArray(cur)
      ) {
        out[key] = mergeDeep(cur as Record<string, unknown>, v as Record<string, unknown>);
      } else if (v !== undefined) {
        out[key] = v;
      }
    }
  }
  return out as T;
}

export function mergeAll(objects: Record<string, unknown>[]): Record<string, unknown> {
  return objects.reduce((acc, cur) => mergeDeep(acc, cur), {} as Record<string, unknown>);
}
