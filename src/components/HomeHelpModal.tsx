import { m } from "framer-motion";
import { Award, MousePointerClick, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DogSprite, FurnitureSprite, HandlerSprite, LogoGraphic } from "./GamePieces";

interface HomeHelpModalProps {
  onClose: () => void;
}

type HelpVisualType = "watch" | "reward" | "avoid" | "progress" | "certificate";

interface HelpCardProps {
  title: string;
  body: string;
  visual: HelpVisualType;
}

const boardBackground =
  "repeating-linear-gradient(90deg, #ead8b6 0px, #ead8b6 28px, #e1ccA3 28px, #e1cca3 30px)";

function SceneLabel({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={`theme-scene-label rounded-full border px-2 py-1 text-[11px] font-black shadow ${className}`}
    >
      {children}
    </span>
  );
}

function WatchVisual() {
  const { t } = useTranslation();

  return (
    <div
      className="relative h-32 overflow-hidden rounded-2xl border border-amber-200"
      style={{ background: boardBackground }}
    >
      <div className="absolute inset-0 shadow-[inset_0_0_0_5px_#c9b083,inset_0_0_0_7px_#b69a6a]" />
      <div className="absolute left-5 top-4 h-16 w-16 drop-shadow">
        <LogoGraphic />
      </div>
      <div className="absolute left-6 top-20">
        <SceneLabel>{t("helpScreen.visualLabels.mat")}</SceneLabel>
      </div>
      <m.div
        className="absolute right-8 top-10"
        animate={{ x: [0, -76, -76, 0], rotate: [180, 180, 180, 180] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <DogSprite pose="walk" />
      </m.div>
      <m.div
        className="theme-success-text absolute left-[46%] top-12 text-3xl font-black drop-shadow"
        animate={{ x: [12, -8, 12], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        ←
      </m.div>
      <div className="absolute bottom-2 right-3">
        <SceneLabel>{t("helpScreen.visualLabels.dog")}</SceneLabel>
      </div>
    </div>
  );
}

function RewardVisual() {
  const { t } = useTranslation();

  return (
    <div
      className="relative h-32 overflow-hidden rounded-2xl border border-blue-200"
      style={{ background: boardBackground }}
    >
      <m.div
        className="theme-primary-button absolute left-3 top-3 flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-black shadow"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      >
        <MousePointerClick size={13} /> {t("helpScreen.visualLabels.click")}
      </m.div>
      <div className="absolute right-6 top-2">
        <HandlerSprite offering />
      </div>
      <div className="absolute right-9 top-24">
        <SceneLabel>{t("helpScreen.visualLabels.handler")}</SceneLabel>
      </div>
      <m.div
        className="absolute left-8 top-16"
        animate={{ x: [0, 92, 92, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <DogSprite pose="walk" />
      </m.div>
      <m.div
        className="absolute right-24 top-[68px] h-4 w-4 rounded-full bg-amber-500 shadow"
        animate={{ scale: [0.85, 1.25, 0.85], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute right-24 top-[84px]">
        <SceneLabel>{t("helpScreen.visualLabels.treat")}</SceneLabel>
      </div>
      <div className="absolute bottom-2 left-3">
        <SceneLabel>{t("helpScreen.visualLabels.wait")}</SceneLabel>
      </div>
    </div>
  );
}

function AvoidVisual() {
  const { t } = useTranslation();

  return (
    <div
      className="relative h-32 overflow-hidden rounded-2xl border border-rose-200"
      style={{ background: boardBackground }}
    >
      <div className="absolute left-3 top-5">
        <HandlerSprite offering={false} />
      </div>
      <m.div
        className="absolute left-[44%] top-11"
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <DogSprite pose="stare" />
      </m.div>
      <div className="absolute right-4 top-7 rotate-90">
        <FurnitureSprite type="cabinet" />
      </div>
      <div className="absolute right-5 top-24">
        <SceneLabel>{t("helpScreen.visualLabels.furniture")}</SceneLabel>
      </div>
      <m.div
        className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-black text-white shadow"
        style={{ background: "var(--danger-fill)" }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      >
        {t("helpScreen.visualLabels.doNotClick")}
      </m.div>
    </div>
  );
}

function ProgressVisual() {
  const { t } = useTranslation();

  return (
    <div
      className="relative h-32 overflow-hidden rounded-2xl border border-emerald-200"
      style={{ background: boardBackground }}
    >
      <div className="absolute left-5 top-5 h-16 w-16 drop-shadow">
        <LogoGraphic />
      </div>
      <m.div
        className="absolute left-8 top-8"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <DogSprite pose="lie" />
      </m.div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="theme-success-text mb-2 flex items-center justify-between text-xs font-black">
          <span>{t("helpScreen.visualLabels.progressStart")}</span>
          <span>{t("helpScreen.visualLabels.progressEnd")}</span>
        </div>
        <div className="theme-progress-track h-4 overflow-hidden rounded-full shadow-inner">
          <m.div
            className="h-full origin-left rounded-full"
            style={{ background: "var(--success-fill)" }}
            animate={{ scaleX: [0.15, 0.99, 0.99] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="mt-2 text-center">
          <SceneLabel>{t("helpScreen.visualLabels.stayTenSeconds")}</SceneLabel>
        </div>
      </div>
    </div>
  );
}

function CertificateVisual() {
  const { t } = useTranslation();

  return (
    <div className="relative h-32 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
      <m.div
        className="absolute left-5 top-4 h-20 w-16 rounded-lg border-4 border-amber-600 bg-white shadow"
        animate={{ y: [8, 0, 0, 8], opacity: [0.65, 1, 1, 0.65] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="mx-auto mt-2 h-8 w-8">
          <LogoGraphic />
        </div>
        <div className="mx-auto mt-2 h-1 w-10 rounded bg-slate-300" />
        <div className="mx-auto mt-1 h-1 w-8 rounded bg-slate-300" />
      </m.div>
      <div className="absolute left-24 top-12">
        <Award className="text-amber-800" size={42} />
      </div>
      <div className="absolute right-9 top-9">
        <DogSprite pose="lie" />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <SceneLabel>{t("helpScreen.visualLabels.certificate")}</SceneLabel>
      </div>
    </div>
  );
}

function HelpVisual({ visual }: { visual: HelpVisualType }) {
  if (visual === "watch") {
    return <WatchVisual />;
  }

  if (visual === "reward") {
    return <RewardVisual />;
  }

  if (visual === "avoid") {
    return <AvoidVisual />;
  }

  if (visual === "progress") {
    return <ProgressVisual />;
  }

  return <CertificateVisual />;
}

function HelpCard({ title, body, visual }: HelpCardProps) {
  return (
    <article className="theme-muted-card rounded-2xl border p-3">
      <HelpVisual visual={visual} />
      <h3 className="theme-text mt-3 text-sm font-extrabold">
        {title}
      </h3>
      <p className="theme-subtle mt-1 text-sm leading-relaxed">
        {body}
      </p>
    </article>
  );
}

export function HomeHelpModal({ onClose }: HomeHelpModalProps) {
  const { t } = useTranslation();

  return (
    <div className="theme-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="theme-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="theme-text text-xl font-extrabold">
              {t("helpScreen.title")}
            </h2>
            <p className="theme-subtle mt-2 text-sm leading-relaxed">
              {t("helpScreen.intro")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="theme-icon-button"
            aria-label={t("helpScreen.close")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <HelpCard
            visual="watch"
            title={t("helpScreen.watchTitle")}
            body={t("helpScreen.watchBody")}
          />
          <HelpCard
            visual="reward"
            title={t("helpScreen.rewardTitle")}
            body={t("helpScreen.rewardBody")}
          />
          <HelpCard
            visual="avoid"
            title={t("helpScreen.avoidTitle")}
            body={t("helpScreen.avoidBody")}
          />
          <HelpCard
            visual="progress"
            title={t("helpScreen.progressTitle")}
            body={t("helpScreen.progressBody")}
          />
          <div className="sm:col-span-2">
            <HelpCard
              visual="certificate"
              title={t("helpScreen.certificateTitle")}
              body={t("helpScreen.certificateBody")}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="theme-primary-button mt-5 w-full rounded-2xl py-3 font-extrabold shadow"
        >
          {t("helpScreen.close")}
        </button>
      </div>
    </div>
  );
}
