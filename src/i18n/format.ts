import type { LanguageCode, Messages } from "./translations";
import { translations } from "./translations";

type TemplateValue = string | number;

const numberFormatters: Record<LanguageCode, Intl.NumberFormat> = {
  hu: new Intl.NumberFormat(translations.hu.meta.locale),
  en: new Intl.NumberFormat(translations.en.meta.locale),
  de: new Intl.NumberFormat(translations.de.meta.locale),
  ar: new Intl.NumberFormat(translations.ar.meta.locale),
  zh: new Intl.NumberFormat(translations.zh.meta.locale),
  fi: new Intl.NumberFormat(translations.fi.meta.locale),
};

const dateFormatters: Record<LanguageCode, Intl.DateTimeFormat> = {
  hu: new Intl.DateTimeFormat(translations.hu.meta.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  en: new Intl.DateTimeFormat(translations.en.meta.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  de: new Intl.DateTimeFormat(translations.de.meta.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  ar: new Intl.DateTimeFormat(translations.ar.meta.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  zh: new Intl.DateTimeFormat(translations.zh.meta.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  fi: new Intl.DateTimeFormat(translations.fi.meta.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
};

export function formatTemplate(
  template: string,
  values: Record<string, TemplateValue>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  );
}

export function formatNumber(language: LanguageCode, value: number): string {
  return numberFormatters[language].format(value);
}

export function formatDate(messages: Messages, date: Date): string {
  return dateFormatters[messages.meta.code].format(date);
}
