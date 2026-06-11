import { Home, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LogoGraphic } from "./GamePieces";

interface GameHeaderProps {
  onReset: () => void;
  onReturnHome: () => void;
}

export function GameHeader({ onReset, onReturnHome }: GameHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-50 p-1 shadow ring-1 ring-amber-200">
          <LogoGraphic />
        </div>
        <h1 className="truncate text-lg font-bold text-slate-900">
          {t("ui.appTitle")}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow"
        >
          <RotateCcw size={14} /> {t("ui.reset")}
        </button>
        <button
          type="button"
          onClick={onReturnHome}
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow"
        >
          <Home size={14} /> {t("ui.returnHome")}
        </button>
      </div>
    </div>
  );
}
