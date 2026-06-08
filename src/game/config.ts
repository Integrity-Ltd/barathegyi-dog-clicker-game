import dogLieSrc from "../assets/dog-lie.svg";
import dogSniffSrc from "../assets/dog-sniff.svg";
import dogStareSrc from "../assets/dog-stare.svg";
import dogWalkSrc from "../assets/dog-walk.svg";
import furnitureBinSrc from "../assets/furniture-bin.svg";
import furnitureBowlSrc from "../assets/furniture-bowl.svg";
import furnitureCabinetSrc from "../assets/furniture-cabinet.svg";
import furniturePlantSrc from "../assets/furniture-plant.svg";
import handlerOfferingSrc from "../assets/handler-offering.svg";
import handlerSrc from "../assets/handler.svg";
import type { DogPose, FurnitureItem, FurnitureType, Point } from "./types";

export const CARPET = { cx: 50, cy: 32, radius: 13 } as const;
export const HANDLER: Point = { x: 50, y: 95 };
export const TREAT: Point = { x: 55, y: 90 };
export const HANDLER_KEEP_OUT_DISTANCE = 17;

export const DOG_SIZE_PX = 54;
export const DOG_SAFE_EDGE_PX = 39;

export const FURNITURE_ASSETS: Record<
  FurnitureType,
  { src: string; width: number; height: number }
> = {
  plant: { src: furniturePlantSrc, width: 38, height: 38 },
  bin: { src: furnitureBinSrc, width: 30, height: 30 },
  cabinet: { src: furnitureCabinetSrc, width: 52, height: 34 },
  bowl: { src: furnitureBowlSrc, width: 30, height: 30 },
};

export const DOG_ASSETS: Record<DogPose, string> = {
  walk: dogWalkSrc,
  stare: dogStareSrc,
  lie: dogLieSrc,
  sniff: dogSniffSrc,
};

export const HANDLER_ASSETS = {
  default: handlerSrc,
  offering: handlerOfferingSrc,
} as const;

export const FURNITURE: FurnitureItem[] = [
  { x: 12, y: 12, type: "plant", rotation: 0 },
  { x: 88, y: 12, type: "plant", rotation: 0 },
  { x: 9, y: 46, type: "bin", rotation: 0 },
  { x: 91, y: 55, type: "cabinet", rotation: 90 },
  { x: 13, y: 83, type: "plant", rotation: 0 },
  { x: 87, y: 86, type: "bowl", rotation: 0 },
];
