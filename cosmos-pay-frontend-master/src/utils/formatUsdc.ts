/** Formato de montos en USDC (sin símbolo $; estable en Stellar/EVM). */
export function formatUsdc(amount: string | number, locale: string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return `${amount} USDC`;
  const loc = locale.startsWith("en") ? "en-US" : "es-AR";
  const formatted = new Intl.NumberFormat(loc, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(n);
  return `${formatted} USDC`;
}
