import logoSrc from "../assets/logo.svg";
import {
  DOG_ASSETS,
  DOG_SIZE_PX,
  FURNITURE_ASSETS,
  HANDLER_ASSETS,
} from "../game/config";
import type { DogPose, FurnitureType } from "../game/types";

export function LogoGraphic() {
  return (
    <img
      src={logoSrc}
      alt=""
      className="block h-full w-full object-contain"
      draggable="false"
    />
  );
}

interface FurnitureSpriteProps {
  type: FurnitureType;
}

export function FurnitureSprite({ type }: FurnitureSpriteProps) {
  const asset = FURNITURE_ASSETS[type];

  return (
    <img
      src={asset.src}
      alt=""
      width={asset.width}
      height={asset.height}
      className="block"
      draggable="false"
    />
  );
}

interface HandlerSpriteProps {
  offering: boolean;
}

export function HandlerSprite({ offering }: HandlerSpriteProps) {
  return (
    <img
      src={offering ? HANDLER_ASSETS.offering : HANDLER_ASSETS.default}
      alt=""
      width="80"
      height="96"
      className="block"
      draggable="false"
    />
  );
}

interface DogSpriteProps {
  pose: DogPose;
}

export function DogSprite({ pose }: DogSpriteProps) {
  return (
    <img
      src={DOG_ASSETS[pose]}
      alt=""
      width={DOG_SIZE_PX}
      height={DOG_SIZE_PX}
      className="block"
      draggable="false"
      style={{
        width: DOG_SIZE_PX,
        height: DOG_SIZE_PX,
        maxWidth: "none",
      }}
    />
  );
}
