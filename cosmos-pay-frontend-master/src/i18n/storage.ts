export const I18N_STORAGE_KEY = "cosmos_i18n_lang";

export function readStoredLanguage(): "es" | "en" | null {
  try {
    const v = localStorage.getItem(I18N_STORAGE_KEY);
    return v === "es" || v === "en" ? v : null;
  } catch {
    return null;
  }
}
