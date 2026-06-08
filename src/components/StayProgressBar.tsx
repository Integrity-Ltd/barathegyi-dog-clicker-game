import { formatNumber, formatTemplate } from "../i18n/format";
import type { LanguageCode, Messages } from "../i18n/translations";

interface StayProgressBarProps {
  language: LanguageCode;
  messages: Messages;
  elapsedSeconds: number;
}

const stayDurationSeconds = 10;

export function StayProgressBar({
  language,
  messages,
  elapsedSeconds,
}: StayProgressBarProps) {
  const progress = Math.min(1, Math.max(0, elapsedSeconds / stayDurationSeconds));
  const remainingSeconds = Math.max(
    0,
    Math.ceil(stayDurationSeconds - elapsedSeconds),
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold">
        <span className="text-slate-900">
          {messages.ui.stayProgress}
        </span>
        <span className="text-emerald-700">
          {formatTemplate(messages.ui.stayRemaining, {
            seconds: formatNumber(language, remainingSeconds),
          })}
        </span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-200 shadow-inner">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-100"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
