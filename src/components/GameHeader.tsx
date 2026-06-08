import { Home, RotateCcw } from "lucide-react";

import type { Messages } from "../i18n/translations";
import { LogoGraphic } from "./GamePieces";

interface GameHeaderProps {
  messages: Messages;
  onReset: () => void;
  onReturnHome: () => void;
}

export function GameHeader({
  messages,
  onReset,
  onReturnHome,
}: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-50 p-1 shadow ring-1 ring-amber-200">
          <LogoGraphic />
        </div>
        <h1 className="truncate text-lg font-bold text-slate-900">
          {messages.ui.appTitle}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow"
        >
          <RotateCcw size={14} /> {messages.ui.reset}
        </button>
        <button
          type="button"
          onClick={onReturnHome}
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow"
        >
          <Home size={14} /> {messages.ui.returnHome}
        </button>
      </div>
    </div>
  );
}
