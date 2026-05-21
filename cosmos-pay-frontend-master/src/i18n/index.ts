import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { mergeAll } from "./mergeDeep";
import { readStoredLanguage } from "./storage";

import esCommon from "./locales/es/common.json";
import esLayout from "./locales/es/layout.json";
import esAuth from "./locales/es/auth.json";
import esCosmosPay from "./locales/es/cosmosPay.json";
import esCosmosPayDev from "./locales/es/cosmosPayDev.json";
import esSidebar from "./locales/es/sidebar.json";

import enCommon from "./locales/en/common.json";
import enLayout from "./locales/en/layout.json";
import enAuth from "./locales/en/auth.json";
import enCosmosPay from "./locales/en/cosmosPay.json";
import enCosmosPayDev from "./locales/en/cosmosPayDev.json";
import enSidebar from "./locales/en/sidebar.json";

const esTranslation = mergeAll([
  esCommon as Record<string, unknown>,
  esLayout as Record<string, unknown>,
  esAuth as Record<string, unknown>,
  esCosmosPay as Record<string, unknown>,
  esCosmosPayDev as Record<string, unknown>,
  esSidebar as Record<string, unknown>,
]);

const enTranslation = mergeAll([
  enCommon as Record<string, unknown>,
  enLayout as Record<string, unknown>,
  enAuth as Record<string, unknown>,
  enCosmosPay as Record<string, unknown>,
  enCosmosPayDev as Record<string, unknown>,
  enSidebar as Record<string, unknown>,
]);

const initialLng = readStoredLanguage() ?? "es";

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: esTranslation },
    en: { translation: enTranslation },
  },
  lng: initialLng,
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = initialLng.startsWith("en") ? "en" : "es";
}

i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng.startsWith("en") ? "en" : "es";
  }
});

export default i18n;
