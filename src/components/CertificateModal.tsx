import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { CompletionResult } from "../game/types";
import { formatNumber } from "../i18n/format";
import { resolveLanguageCode } from "../i18n/translations";
import { LogoGraphic } from "./GamePieces";

interface CertificateModalProps {
  completion: CompletionResult;
  volunteerName: string;
  onVolunteerNameChange: (name: string) => void;
  onDownload: () => void;
  onClose: () => void;
}

export function CertificateModal({
  completion,
  volunteerName,
  onVolunteerNameChange,
  onDownload,
  onClose,
}: CertificateModalProps) {
  const { t, i18n } = useTranslation();
  const language = resolveLanguageCode(i18n.resolvedLanguage);
  const title = completion.assisted
    ? t("certificate.assistedTitle")
    : t("certificate.independentTitle");
  const formattedClicks = formatNumber(language, completion.clicks);
  const summary = completion.assisted
    ? t("certificate.modalAssistedSummary", { clicks: formattedClicks })
    : t("certificate.modalIndependentSummary", { clicks: formattedClicks });

  return (
    <div className="theme-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="theme-panel flex w-full max-w-md flex-col gap-4 rounded-2xl border p-5">
        <div className="text-center">
          <div className="theme-logo-tile mx-auto h-20 w-20 rounded-2xl border p-2 shadow">
            <LogoGraphic />
          </div>
          <h2 className="theme-text mt-2 text-xl font-extrabold">
            {title}
          </h2>
          <p className="theme-subtle text-sm">
            {t("certificate.exerciseName")}
          </p>
        </div>

        <p className="theme-text text-center">
          {summary}
        </p>

        {completion.assisted ? (
          <div className="theme-assist-note rounded-xl border p-3 text-sm">
            <span className="font-semibold">
              {t("certificate.nextChallengeTitle")}
            </span>{" "}
            {t("certificate.nextChallengeBody")}
          </div>
        ) : (
          <div className="theme-achievement-note rounded-xl border p-3 text-center text-sm font-semibold">
            {t("certificate.independentBadge")}
          </div>
        )}

        <div>
          <label
            htmlFor="volunteer-name"
            className="theme-subtle text-xs font-semibold"
          >
            {t("certificate.volunteerNameLabel")}
          </label>
          <input
            id="volunteer-name"
            value={volunteerName}
            onChange={(event) => onVolunteerNameChange(event.target.value)}
            placeholder={t("certificate.volunteerNamePlaceholder")}
            className="theme-input mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <button
          type="button"
          onClick={onDownload}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl shadow ${
            completion.assisted ? "theme-primary-button" : "theme-accent-button"
          }`}
        >
          <Download size={18} />
          {t("certificate.downloadPng", { document: title })}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="theme-subtle text-sm hover:underline"
        >
          {t("certificate.close")}
        </button>
      </div>
    </div>
  );
}
