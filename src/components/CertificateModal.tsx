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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-amber-50 p-2 shadow ring-2 ring-amber-300">
            <LogoGraphic />
          </div>
          <h2 className="mt-2 text-xl font-extrabold text-slate-800">
            {title}
          </h2>
          <p className="text-sm text-slate-700">
            {t("certificate.exerciseName")}
          </p>
        </div>

        <p className="text-center text-slate-900">
          {summary}
        </p>

        {completion.assisted ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            <span className="font-semibold">
              {t("certificate.nextChallengeTitle")}
            </span>{" "}
            {t("certificate.nextChallengeBody")}
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center text-sm font-semibold text-amber-800">
            {t("certificate.independentBadge")}
          </div>
        )}

        <div>
          <label
            htmlFor="volunteer-name"
            className="text-xs font-semibold text-slate-700"
          >
            {t("certificate.volunteerNameLabel")}
          </label>
          <input
            id="volunteer-name"
            value={volunteerName}
            onChange={(event) => onVolunteerNameChange(event.target.value)}
            placeholder={t("certificate.volunteerNamePlaceholder")}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <button
          type="button"
          onClick={onDownload}
          className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl shadow ${
            completion.assisted
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-amber-500 hover:bg-amber-600"
          }`}
        >
          <Download size={18} />
          {t("certificate.downloadPng", { document: title })}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-slate-600 hover:text-slate-800"
        >
          {t("certificate.close")}
        </button>
      </div>
    </div>
  );
}
