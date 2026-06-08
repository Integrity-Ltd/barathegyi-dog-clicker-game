import { CARPET, FURNITURE } from "./config";
import type { DogPose, GameMode, Point } from "./types";

export function clampX(positionX: number): number {
  return Math.min(94, Math.max(6, positionX));
}

export function clampY(positionY: number): number {
  return Math.min(92, Math.max(8, positionY));
}

export function isOnCarpet(positionX: number, positionY: number): boolean {
  return (
    Math.hypot(positionX - CARPET.cx, positionY - CARPET.cy) <= CARPET.radius
  );
}

export function getStayTarget(progress: number): number {
  const baseSeconds = 1;

  if (progress <= 0.6) {
    return baseSeconds;
  }

  const normalizedProgress = (progress - 0.6) / 0.4;
  return baseSeconds + normalizedProgress * normalizedProgress * 11;
}

export function getCarpetAttraction(progress: number): number {
  return Math.max(0, (progress - 0.3) / 0.7) ** 1.5;
}

export function getNoiseLevel(progress: number): number {
  return 0.55 + 0.85 * (1 - progress);
}

export function distanceBetween(firstPoint: Point, secondPoint: Point): number {
  return Math.hypot(firstPoint.x - secondPoint.x, firstPoint.y - secondPoint.y);
}

export function getRandomRoomPoint(): Point {
  return {
    x: 8 + Math.random() * 84,
    y: 12 + Math.random() * 72,
  };
}

export function getSniffSpot(): Point {
  const furniture = FURNITURE[Math.floor(Math.random() * FURNITURE.length)];
  const offsetX = 50 - furniture.x;
  const offsetY = 50 - furniture.y;
  const distance = Math.hypot(offsetX, offsetY) || 1;

  return {
    x: clampX(furniture.x + (offsetX / distance) * 9),
    y: clampY(furniture.y + (offsetY / distance) * 9),
  };
}

export function getPoseForMode(mode: GameMode): DogPose {
  if (mode === "frozen") {
    return "stare";
  }

  if (mode === "stay" || mode === "randomLie") {
    return "lie";
  }

  if (mode === "sniff" || mode === "eating") {
    return "sniff";
  }

  return "walk";
}
