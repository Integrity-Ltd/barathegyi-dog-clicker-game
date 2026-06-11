import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { downloadCertificate } from "./certificate/certificate";
import { CertificateModal } from "./components/CertificateModal";
import { ConfettiOverlay } from "./components/ConfettiOverlay";
import { GameBoard } from "./components/GameBoard";
import { GameHeader } from "./components/GameHeader";
import { GameStats } from "./components/GameStats";
import { StayProgressBar } from "./components/StayProgressBar";
import { StartScreen } from "./components/StartScreen";
import { useClickerGame } from "./game/useClickerGame";
import {
  getLanguageMeta,
  resolveLanguageCode,
} from "./i18n/translations";

export function ClickerTrainer() {
  const { t, i18n } = useTranslation();
  const language = resolveLanguageCode(i18n.resolvedLanguage);
  const meta = getLanguageMeta(language);
  const game = useClickerGame();

  useEffect(() => {
    document.documentElement.lang = meta.locale;
    document.documentElement.dir = meta.direction;
    document.title = t("meta.documentTitle");
  }, [meta.direction, meta.locale, t]);

  const handleDownloadCertificate = () => {
    if (!game.completion) {
      return;
    }

    downloadCertificate({
      language,
      volunteerName: game.volunteerName,
      completion: game.completion,
    });
  };

  if (!game.started) {
    return (
      <div dir={meta.direction}>
        <StartScreen
          hintsOn={game.hintsOn}
          onToggleHints={game.actions.toggleHints}
          onStart={() => game.actions.setStarted(true)}
        />
      </div>
    );
  }

  return (
    <div
      dir={meta.direction}
      className="min-h-screen w-full app-shell flex flex-col items-center p-4 select-none"
    >
      <div className="w-full max-w-md flex flex-col gap-3">
        <GameHeader
          onReset={game.actions.reset}
          onReturnHome={game.actions.returnHome}
        />

        <GameStats
          progress={game.progress}
          clicks={game.clicks}
          won={game.won}
        />

        <GameBoard
          position={game.position}
          heading={game.heading}
          mode={game.mode}
          hasTreat={game.hasTreat}
          frozenLeft={game.frozenLeft}
          lieType={game.lieType}
          won={game.won}
          showCertificate={game.showCertificate}
          hintsOn={game.hintsOn}
          flash={game.flash}
          joys={game.joys}
          onOpenCertificate={game.actions.openCertificate}
        />

        {game.mode === "stay" && game.progress >= 1 && !game.won && (
          <StayProgressBar
            elapsedSeconds={game.stayElapsed}
          />
        )}

        {game.hintsOn && (
          <div className="min-h-12 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow flex items-center">
            {t(`game.${game.helpMessageKey}`)}
          </div>
        )}

        <button
          type="button"
          onClick={game.actions.handleClick}
          disabled={game.won}
          className={`w-full py-6 rounded-2xl text-white text-2xl font-extrabold shadow-lg active:scale-95 transition-transform ${
            game.won ? "bg-slate-600" : "bg-blue-600 active:bg-blue-700"
          }`}
        >
          {t("ui.click")}
        </button>
      </div>

      {game.showCertificate && game.completion && (
        <CertificateModal
          completion={game.completion}
          volunteerName={game.volunteerName}
          onVolunteerNameChange={game.actions.setVolunteerName}
          onDownload={handleDownloadCertificate}
          onClose={game.actions.closeCertificate}
        />
      )}

      {game.completion && (
        <ConfettiOverlay seed={game.completion.completedAt.getTime()} />
      )}
    </div>
  );
}
