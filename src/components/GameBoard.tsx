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
  const flashBorderColor =
    flash === "good"
      ? "#10b981"
      : flash === "bad"
        ? "#e11d48"
        : flash === "neutral"
          ? "var(--board-neutral-border)"
          : "var(--board-border)";

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-inner border-4 transition-colors duration-200"
      style={{
        aspectRatio: "1 / 1",
        borderColor: flashBorderColor,
        background:
          "repeating-linear-gradient(90deg, #ead8b6 0px, #ead8b6 38px, #e1ccA3 38px, #e1cca3 40px)",
      }}
    >
      <div
        className="theme-board-frame absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
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
          className="theme-hint absolute left-1/2 top-2 -translate-x-1/2 rounded-full border px-3 py-1 text-xs font-semibold shadow"
          style={{ zIndex: 40 }}
        >
          {t("hints.frozenCountdown", {
            seconds: frozenLeft.toFixed(1),
          })}
        </div>
      )}
      {hintsOn && mode === "stay" && lieType === "rear" && (
        <div
          className="theme-hint absolute left-1/2 top-2 -translate-x-1/2 rounded-full border px-3 py-1 text-xs font-semibold shadow"
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
          className="theme-board-overlay absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 40 }}
        >
          <button
            type="button"
            onClick={onOpenCertificate}
            className="theme-hint flex items-center gap-2 rounded-xl border px-4 py-3 font-bold shadow"
          >
            <Award size={20} /> {t("ui.openCertificate")}
          </button>
        </div>
      )}
    </div>
  );
}
