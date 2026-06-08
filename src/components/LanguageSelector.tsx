import type { ChangeEvent } from "react";

import { languageOptions, type LanguageCode } from "../i18n/translations";
import { Languages } from "lucide-react";

interface LanguageSelectorProps {
  language: LanguageCode;
  onChange: (language: LanguageCode) => void;
}

export function LanguageSelector({
  language,
  onChange,
}: LanguageSelectorProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as LanguageCode);
  };

  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
      <Languages size={14} />
      <select
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
