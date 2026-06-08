import type { LanguageCode, Messages } from "../i18n/translations";
import { formatNumber } from "../i18n/format";

interface GameStatsProps {
  language: LanguageCode;
  messages: Messages;
  progress: number;
  clicks: number;
  won: boolean;
}

export function GameStats({
  language,
  messages,
  progress,
  clicks,
  won,
}: GameStatsProps) {
  const visibleProgressPercent = won ? 100 : Math.min(99, Math.round(progress * 100));

  return (
    <div className="flex gap-2">
      <div className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-center shadow">
        <div className="text-xs font-semibold text-slate-700">
          {messages.ui.training}
        </div>
        <div className="text-2xl font-extrabold text-emerald-700">
          {formatNumber(language, visibleProgressPercent)}%
        </div>
      </div>
      <div className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-center shadow">
        <div className="text-xs font-semibold text-slate-700">
          {messages.ui.clicks}
        </div>
        <div className="text-2xl font-extrabold text-blue-700">
          {formatNumber(language, clicks)}
        </div>
      </div>
    </div>
  );
}
