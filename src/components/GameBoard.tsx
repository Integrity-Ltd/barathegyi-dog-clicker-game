import { m } from "framer-motion";
import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DOG_SAFE_EDGE_PX,
  FURNITURE,
  HANDLER,
  TREAT,
} from "../game/config";
import { getPoseForMode } from "../game/math";
import type { FlashType, GameMode, JoyEffect, LieType, Point } from "../game/types";
import { DogSprite, FurnitureSprite, HandlerSprite } from "./GamePieces";
import { LogoCarpet } from "./LogoCarpet";

interface GameBoardProps {
  position: Point;
  heading: number;
  mode: GameMode;
  hasTreat: boolean;
  frozenLeft: number;
  lieType: LieType;
  won: boolean;
  showCertificate: boolean;
  hintsOn: boolean;
  flash: FlashType;
  joys: JoyEffect[];
  onOpenCertificate: () => void;
}

export function GameBoard({
  position,
  heading,
  mode,
  hasTreat,
  frozenLeft,
  lieType,
  won,
  showCertificate,
  hintsOn,
  flash,
  joys,
  onOpenCertificate,
}: GameBoardProps) {
  const { t } = useTranslation();
  const flashBorder =
    flash === "good"
      ? "border-emerald-400"
      : flash === "bad"
        ? "border-rose-300"
        : flash === "neutral"
          ? "border-slate-400"
          : "border-white";

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden shadow-inner border-4 transition-colors duration-200 ${flashBorder}`}
      style={{
        aspectRatio: "1 / 1",
        background:
          "repeating-linear-gradient(90deg, #ead8b6 0px, #ead8b6 38px, #e1ccA3 38px, #e1cca3 40px)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          boxShadow: "inset 0 0 0 6px #c9b083, inset 0 0 0 8px #b69a6a",
        }}
      />

      {FURNITURE.map((furniture, index) => (
        <div
          key={`${furniture.type}-${index}`}
          className="absolute"
          style={{
            left: `${furniture.x}%`,
            top: `${furniture.y}%`,
            transform: `translate(-50%, -50%) rotate(${furniture.rotation}deg)`,
            zIndex: 6,
          }}
        >
          <div className="drop-shadow">
            <FurnitureSprite type={furniture.type} />
          </div>
        </div>
      ))}

      <LogoCarpet />

      <div
        className="absolute"
        style={{
          left: `clamp(${DOG_SAFE_EDGE_PX}px, ${position.x}%, calc(100% - ${DOG_SAFE_EDGE_PX}px))`,
          top: `clamp(${DOG_SAFE_EDGE_PX}px, ${position.y}%, calc(100% - ${DOG_SAFE_EDGE_PX}px))`,
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        <div style={{ transform: `rotate(${heading}deg)` }}>
          <DogSprite pose={getPoseForMode(mode)} />
        </div>
      </div>

      <div
        className="absolute"
        style={{
          left: `${HANDLER.x}%`,
          top: `${HANDLER.y}%`,
          transform: "translate(-50%, -78%)",
          zIndex: 20,
        }}
      >
        <HandlerSprite
          offering={hasTreat && (mode === "toTreat" || mode === "eating")}
        />
      </div>

      {joys.map((joy) => (
        <div
          key={joy.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${joy.x}%`, top: `${joy.y}%`, zIndex: 30 }}
        >
          <m.div
            initial={{ opacity: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 1, 0], y: -34, scale: 1.15 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-lg"
          >
            {joy.emoji}
          </m.div>
        </div>
      ))}

      {hintsOn && mode === "frozen" && (
        <div
          className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900 shadow"
          style={{ zIndex: 40 }}
        >
          {t("hints.frozenCountdown", {
            seconds: frozenLeft.toFixed(1),
          })}
        </div>
      )}
      {hintsOn && mode === "stay" && lieType === "rear" && (
        <div
          className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900 shadow"
          style={{ zIndex: 40 }}
        >
          {t("hints.rearLie")}
        </div>
      )}

      {hasTreat && mode === "toTreat" && (
        <div
          className="absolute h-3 w-3 rounded-full bg-amber-500 shadow"
          style={{
            left: `${TREAT.x}%`,
            top: `${TREAT.y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 18,
          }}
        />
      )}

      {won && !showCertificate && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-emerald-500/20"
          style={{ zIndex: 40 }}
        >
          <button
            type="button"
            onClick={onOpenCertificate}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 font-bold text-emerald-800 shadow"
          >
            <Award size={20} /> {t("ui.openCertificate")}
          </button>
        </div>
      )}
    </div>
  );
}
