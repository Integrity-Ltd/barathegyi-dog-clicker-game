import { m } from "framer-motion";
import { HelpCircle, Play } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { HomeHelpModal } from "./HomeHelpModal";
import { LanguageSelector } from "./LanguageSelector";
import { LogoGraphic } from "./GamePieces";
import { ThemeToggle } from "./ThemeToggle";

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
        className="theme-panel flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border p-6 text-center"
      >
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          <button
            type="button"
            onClick={onToggleHints}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm shadow transition-colors ${
              hintsOn
                ? "theme-help-active"
                : "theme-secondary-button"
            }`}
          >
            <HelpCircle size={14} /> {t("ui.help")}{" "}
            {hintsOn ? t("ui.on") : t("ui.off")}
          </button>
        </div>
        <div className="theme-logo-tile h-24 w-24 rounded-2xl border p-1 shadow">
          <LogoGraphic />
        </div>
        <h1 className="theme-text text-xl font-extrabold leading-snug">
          {t("start.title")}
          <br />
          <span className="theme-accent-text text-base font-bold">
            {t("start.subtitle")}
          </span>
        </h1>
        <p className="theme-subtle text-sm leading-relaxed">
          {t("start.goalLead")}{" "}
          <span className="theme-text font-semibold">
            {t("start.goalStrong")}
          </span>
          {t("start.goalTail")} 🐕
          <br />
          {t("start.helpLead")}{" "}
          <span className="theme-primary-text font-semibold">
            {t("start.helpLabel")}
          </span>{" "}
          {t("start.helpTail")}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="theme-primary-button mt-2 w-full flex items-center justify-center gap-2 text-lg font-extrabold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          <Play size={20} /> {t("start.startButton")}
        </button>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="theme-secondary-button flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold"
        >
          <HelpCircle size={18} /> {t("start.helpButton")}
        </button>
      </m.div>

      {showHelp && <HomeHelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
