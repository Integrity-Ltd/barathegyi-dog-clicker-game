import { CARPET } from "../game/config";
import { LogoGraphic } from "./GamePieces";

export function LogoCarpet() {
  return (
    <div
      className="theme-logo-carpet absolute drop-shadow-md"
      style={{
        left: `${CARPET.cx - CARPET.radius}%`,
        top: `${CARPET.cy - CARPET.radius}%`,
        width: `${CARPET.radius * 2}%`,
        height: `${CARPET.radius * 2}%`,
        zIndex: 4,
      }}
    >
      <LogoGraphic />
    </div>
  );
}
