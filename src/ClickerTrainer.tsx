import { useEffect, useMemo, useState } from "react";

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
  defaultLanguage,
  translations,
  type LanguageCode,
} from "./i18n/translations";

export function ClickerTrainer() {
  const [language, setLanguage] = useState<LanguageCode>(defaultLanguage);
  const messages = useMemo(() => translations[language], [language]);
  const game = useClickerGame();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = messages.meta.direction;
    document.title = messages.meta.documentTitle;
  }, [language, messages]);

  const handleDownloadCertificate = () => {
    if (!game.completion) {
      return;
    }

    downloadCertificate({
      language,
      messages,
      volunteerName: game.volunteerName,
      completion: game.completion,
    });
  };

  if (!game.started) {
    return (
      <div dir={messages.meta.direction}>
        <StartScreen
          language={language}
          messages={messages}
          hintsOn={game.hintsOn}
          onLanguageChange={setLanguage}
          onToggleHints={game.actions.toggleHints}
          onStart={() => game.actions.setStarted(true)}
        />
      </div>
    );
  }

  return (
    <div
      dir={messages.meta.direction}
      className="min-h-screen w-full app-shell flex flex-col items-center p-4 select-none"
    >
      <div className="w-full max-w-md flex flex-col gap-3">
        <GameHeader
          messages={messages}
          onReset={game.actions.reset}
          onReturnHome={game.actions.returnHome}
        />

        <GameStats
          language={language}
          messages={messages}
          progress={game.progress}
          clicks={game.clicks}
          won={game.won}
        />

        <GameBoard
          messages={messages}
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
            language={language}
            messages={messages}
            elapsedSeconds={game.stayElapsed}
          />
        )}

        {game.hintsOn && (
          <div className="min-h-12 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 shadow flex items-center">
            {messages.game[game.helpMessageKey]}
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
          {messages.ui.click}
        </button>
      </div>

      {game.showCertificate && game.completion && (
        <CertificateModal
          language={language}
          messages={messages}
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
