import type { ChangeEvent } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  languageOptions,
  resolveLanguageCode,
  type LanguageCode,
} from "../i18n/translations";

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const language = resolveLanguageCode(i18n.resolvedLanguage);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value as LanguageCode);
  };

  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
      <Languages size={14} />
      <select
        aria-label={t("ui.language")}
        value={language}
        onChange={handleChange}
        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
