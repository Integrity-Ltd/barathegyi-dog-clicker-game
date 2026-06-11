import {
  getLanguageMeta,
  resolveLanguageCode,
  supportedLanguages,
  type LanguageCode,
} from "./translations";

const numberFormatters = Object.fromEntries(
  supportedLanguages.map((language) => [
    language,
    new Intl.NumberFormat(getLanguageMeta(language).locale),
  ]),
) as Record<LanguageCode, Intl.NumberFormat>;

const dateFormatters = Object.fromEntries(
  supportedLanguages.map((language) => [
    language,
    new Intl.DateTimeFormat(getLanguageMeta(language).locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  ]),
) as Record<LanguageCode, Intl.DateTimeFormat>;

export function formatNumber(language: string, value: number): string {
  return numberFormatters[resolveLanguageCode(language)].format(value);
}

export function formatDate(language: string, date: Date): string {
  return dateFormatters[resolveLanguageCode(language)].format(date);
}
