import type { GameMessageKey } from "../i18n/translations";

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  dx: number;
  dy: number;
}

export type FurnitureType = "plant" | "bin" | "cabinet" | "bowl";

export interface FurnitureItem extends Point {
  type: FurnitureType;
  rotation: number;
}

export type DogPose = "walk" | "stare" | "lie" | "sniff";

export type GameMode =
  | "wander"
  | "frozen"
  | "stay"
  | "randomLie"
  | "sniff"
  | "toTreat"
  | "eating";

export type LieType = "body" | "head" | "rear";

export type FlashType = "good" | "bad" | "neutral" | null;

export interface JoyEffect extends Point {
  id: number;
  emoji: string;
}

export interface CompletionResult {
  assisted: boolean;
  clicks: number;
  completedAt: Date;
}

export interface GameState {
  started: boolean;
  position: Point;
  heading: number;
  progress: number;
  mode: GameMode;
  hasTreat: boolean;
  frozenLeft: number;
  lieType: LieType;
  stayElapsed: number;
  won: boolean;
  clicks: number;
  flash: FlashType;
  hintsOn: boolean;
  helpMessageKey: GameMessageKey;
  showCertificate: boolean;
  volunteerName: string;
  joys: JoyEffect[];
  completion: CompletionResult | null;
}
