import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import {
  defaultLanguage,
  supportedLanguages,
  translationResources,
} from "./translations";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: translationResources,
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    defaultNS: "translation",
    returnNull: false,
    interpolation: {
      escapeValue: false,
      prefix: "{",
      suffix: "}",
    },
    detection: {
      order: ["navigator", "htmlTag"],
      caches: [],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
