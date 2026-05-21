export const COSMOS_LOGO_THEME_CLASS = "invert dark:invert-0";

type BrandLogoProps = {
  variant?: "full" | "small";
  className?: string;
  alt?: string;
  /** Light mark on dark backgrounds (e.g. gateway hero); skips theme-based invert. */
  brandOnDark?: boolean;
};

const LOGO_FULL = "/logo.svg";
const LOGO_SMALL = "/logo-small.svg";

export function BrandLogo({ variant = "full", className = "", alt = "Cosmos", brandOnDark = false }: BrandLogoProps) {
  const src = variant === "small" ? LOGO_SMALL : LOGO_FULL;
  const themeClass = brandOnDark ? "brightness-0 invert" : COSMOS_LOGO_THEME_CLASS;
  return (
    <img
      src={src}
      alt={alt}
      className={[themeClass, className].filter(Boolean).join(" ")}
      width={variant === "small" ? 120 : undefined}
      height={variant === "small" ? 32 : undefined}
    />
  );
}
