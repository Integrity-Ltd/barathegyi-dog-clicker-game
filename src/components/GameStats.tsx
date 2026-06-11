import { useTranslation } from "react-i18next";

import { formatNumber } from "../i18n/format";
import { resolveLanguageCode } from "../i18n/translations";

interface GameStatsProps {
  progress: number;
  clicks: number;
  won: boolean;
}

export function GameStats({ progress, clicks, won }: GameStatsProps) {
  const { t, i18n } = useTranslation();
  const language = resolveLanguageCode(i18n.resolvedLanguage);
  const visibleProgressPercent = won ? 100 : Math.min(99, Math.round(progress * 100));

  return (
    <div className="flex gap-2">
      <div className="theme-card flex-1 rounded-xl border p-3 text-center shadow">
        <div className="theme-subtle text-xs font-semibold">
          {t("ui.training")}
        </div>
        <div className="theme-success-text text-2xl font-extrabold">
          {formatNumber(language, visibleProgressPercent)}%
        </div>
      </div>
      <div className="theme-card flex-1 rounded-xl border p-3 text-center shadow">
        <div className="theme-subtle text-xs font-semibold">
          {t("ui.clicks")}
        </div>
        <div className="theme-primary-text text-2xl font-extrabold">
          {formatNumber(language, clicks)}
        </div>
      </div>
    </div>
  );
}
