import { m } from "framer-motion";
import { HelpCircle, Play } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { HomeHelpModal } from "./HomeHelpModal";
import { LanguageSelector } from "./LanguageSelector";
import { LogoGraphic } from "./GamePieces";

interface StartScreenProps {
  hintsOn: boolean;
  onToggleHints: () => void;
  onStart: () => void;
}

export function StartScreen({
  hintsOn,
  onToggleHints,
  onStart,
}: StartScreenProps) {
  const { t } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen w-full app-shell flex items-center justify-center p-4">
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center shadow-xl ring-1 ring-slate-200/70"
      >
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <LanguageSelector />
          <button
            type="button"
            onClick={onToggleHints}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm shadow transition-colors ${
              hintsOn
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <HelpCircle size={14} /> {t("ui.help")}{" "}
            {hintsOn ? t("ui.on") : t("ui.off")}
          </button>
        </div>
        <div className="h-24 w-24 rounded-2xl bg-amber-50 p-1 shadow ring-1 ring-amber-200">
          <LogoGraphic />
        </div>
        <h1 className="text-xl font-extrabold leading-snug text-slate-800">
          {t("start.title")}
          <br />
          <span className="text-base font-bold text-amber-600">
            {t("start.subtitle")}
          </span>
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">
          {t("start.goalLead")}{" "}
          <span className="font-semibold text-slate-800">
            {t("start.goalStrong")}
          </span>
          {t("start.goalTail")} 🐕
          <br />
          {t("start.helpLead")}{" "}
          <span className="font-semibold text-blue-700">
            {t("start.helpLabel")}
          </span>{" "}
          {t("start.helpTail")}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-extrabold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          <Play size={20} /> {t("start.startButton")}
        </button>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-extrabold text-blue-800 shadow hover:bg-blue-50"
        >
          <HelpCircle size={18} /> {t("start.helpButton")}
        </button>
      </m.div>

      {showHelp && <HomeHelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
