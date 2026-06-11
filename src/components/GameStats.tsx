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
      <div className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-center shadow">
        <div className="text-xs font-semibold text-slate-700">
          {t("ui.training")}
        </div>
        <div className="text-2xl font-extrabold text-emerald-700">
          {formatNumber(language, visibleProgressPercent)}%
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-center shadow">
        <div className="text-xs font-semibold text-slate-700">
          {t("ui.clicks")}
        </div>
        <div className="text-2xl font-extrabold text-blue-700">
          {formatNumber(language, clicks)}
        </div>
      </div>
    </div>
  );
}
