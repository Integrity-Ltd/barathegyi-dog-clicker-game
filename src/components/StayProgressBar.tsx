import { useTranslation } from "react-i18next";

import { formatNumber } from "../i18n/format";
import { resolveLanguageCode } from "../i18n/translations";

interface StayProgressBarProps {
  elapsedSeconds: number;
}

const stayDurationSeconds = 10;

export function StayProgressBar({ elapsedSeconds }: StayProgressBarProps) {
  const { t, i18n } = useTranslation();
  const language = resolveLanguageCode(i18n.resolvedLanguage);
  const progress = Math.min(1, Math.max(0, elapsedSeconds / stayDurationSeconds));
  const remainingSeconds = Math.max(
    0,
    Math.ceil(stayDurationSeconds - elapsedSeconds),
  );

  return (
    <div className="theme-card rounded-xl border p-3 shadow">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold">
        <span className="theme-text">
          {t("ui.stayProgress")}
        </span>
        <span className="theme-success-text">
          {t("ui.stayRemaining", {
            seconds: formatNumber(language, remainingSeconds),
          })}
        </span>
      </div>
      <div className="theme-progress-track h-4 overflow-hidden rounded-full shadow-inner">
        <div
          className="h-full rounded-full transition-[width] duration-100"
          style={{
            width: `${progress * 100}%`,
            background: "var(--success-fill)",
          }}
        />
      </div>
    </div>
  );
}
