import { Home, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LogoGraphic } from "./GamePieces";
import { ThemeToggle } from "./ThemeToggle";

interface GameHeaderProps {
  onReset: () => void;
  onReturnHome: () => void;
}

export function GameHeader({ onReset, onReturnHome }: GameHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className="theme-logo-tile h-10 w-10 shrink-0 rounded-xl border p-1 shadow">
          <LogoGraphic />
        </div>
        <h1 className="theme-text truncate text-lg font-bold">
          {t("ui.appTitle")}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          onClick={onReset}
          className="theme-secondary-button gap-1 rounded-full px-3 py-1 text-sm"
        >
          <RotateCcw size={14} /> {t("ui.reset")}
        </button>
        <button
          type="button"
          onClick={onReturnHome}
          className="theme-secondary-button gap-1 rounded-full px-3 py-1 text-sm"
        >
          <Home size={14} /> {t("ui.returnHome")}
        </button>
      </div>
    </div>
  );
}
