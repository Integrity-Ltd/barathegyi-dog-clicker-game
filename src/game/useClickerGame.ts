import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import type { GameMessageKey } from "../i18n/translations";
import {
  CARPET,
  HANDLER,
  HANDLER_KEEP_OUT_DISTANCE,
  TREAT,
} from "./config";
import {
  clampX,
  clampY,
  distanceBetween,
  getCarpetAttraction,
  getNoiseLevel,
  getRandomRoomPoint,
  getSniffSpot,
  getStayTarget,
  isOnCarpet,
} from "./math";
import type {
  CompletionResult,
  FlashType,
  GameMode,
  GameState,
  JoyEffect,
  LieType,
  Point,
  Vector,
} from "./types";

type LegacyAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

interface ClickerGameActions {
  setStarted: (started: boolean) => void;
  toggleHints: () => void;
  reset: () => void;
  returnHome: () => void;
  handleClick: () => void;
  openCertificate: () => void;
  closeCertificate: () => void;
  setVolunteerName: (name: string) => void;
}

interface ClickerGameApi extends GameState {
  actions: ClickerGameActions;
}

const TICK_MS = 60;
const TICK_SECONDS = TICK_MS / 1000;
const joyEmojis = ["💛", "✨", "🐾"] as const;

type LoopState = Pick<
  GameState,
  "position" | "heading" | "mode" | "frozenLeft" | "lieType" | "stayElapsed"
>;
type LoopStatePatch = Partial<LoopState>;

const initialLoopState: LoopState = {
  position: { x: 50, y: 70 },
  heading: -90,
  mode: "wander",
  frozenLeft: 0,
  lieType: "body",
  stayElapsed: 0,
};

function loopStateReducer(
  currentState: LoopState,
  patch: LoopStatePatch,
): LoopState {
  return { ...currentState, ...patch };
}

function getProgressMessageKey(progress: number): GameMessageKey {
  if (progress >= 1) {
    return "perfectStay";
  }

  if (progress >= 0.75) {
    return "longerStay";
  }

  if (progress >= 0.5) {
    return "understanding";
  }

  return "goodTiming";
}

export function useClickerGame(): ClickerGameApi {
  const [started, setStarted] = useState(false);
  const [loopState, commitLoopState] = useReducer(
    loopStateReducer,
    initialLoopState,
  );
  const { position, heading, mode, frozenLeft, lieType, stayElapsed } =
    loopState;

  const positionRef = useRef<Point>(initialLoopState.position);
  const velocityRef = useRef<Vector>({ dx: 0.6, dy: -0.4 });
  const lastMoveRef = useRef<Vector>({ dx: 0, dy: -1 });
  const exploreTargetRef = useRef<Point | null>(null);
  if (exploreTargetRef.current === null) {
    exploreTargetRef.current = getRandomRoomPoint();
  }
  const headingRef = useRef(initialLoopState.heading);

  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const modeRef = useRef<GameMode>(initialLoopState.mode);
  const [hasTreat, setHasTreat] = useState(false);
  const eatTimerRef = useRef<number | null>(null);
  const wanderUntilRef = useRef(0);
  const frozenUntilRef = useRef(0);
  const sniffTargetRef = useRef<Point | null>(null);
  const sniffUntilRef = useRef(0);
  const randomLieUntilRef = useRef(0);
  const lieTypeRef = useRef<LieType>(initialLoopState.lieType);
  const stayElapsedRef = useRef(0);
  const wonRef = useRef(false);
  const [won, setWon] = useState(false);
  const clicksRef = useRef(0);
  const [clicks, setClicks] = useState(0);
  const [flash, setFlash] = useState<FlashType>(null);
  const [hintsOn, setHintsOn] = useState(true);
  const hintsUsedRef = useRef(false);
  const [helpMessageKey, setHelpMessageKey] =
    useState<GameMessageKey>("initialPrompt");
  const [showCertificate, setShowCertificate] = useState(false);
  const [volunteerName, setVolunteerName] = useState("");
  const [joys, setJoys] = useState<JoyEffect[]>([]);
  const audioRef = useRef<AudioContext | null>(null);
  const [completion, setCompletion] = useState<CompletionResult | null>(null);

  const spawnJoy = useCallback((x: number, y: number) => {
    const baseId = Date.now();
    const freshJoys = joyEmojis.map((emoji, index) => ({
      id: baseId + index + Math.random(),
      x: x + (index - 1) * 6,
      y: y - 4,
      emoji,
    }));
    const freshJoyIds = freshJoys.map((joy) => joy.id);

    setJoys((currentJoys) => [...currentJoys, ...freshJoys]);
    window.setTimeout(() => {
      setJoys((currentJoys) =>
        currentJoys.filter((joy) => !freshJoyIds.includes(joy.id)),
      );
    }, 1000);
  }, []);

  const playClick = useCallback(() => {
    try {
      const AudioContextConstructor =
        window.AudioContext ?? (window as LegacyAudioWindow).webkitAudioContext;

      if (!AudioContextConstructor) {
        return;
      }

      if (!audioRef.current) {
        audioRef.current = new AudioContextConstructor();
      }

      const audioContext = audioRef.current;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.frequency.value = 1600;
      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch {
      return;
    }
  }, []);

  const say = useCallback(
    (messageKey: GameMessageKey) => {
      if (hintsOn) {
        setHelpMessageKey(messageKey);
      }
    },
    [hintsOn],
  );

  const randomDepart = useCallback((timestamp: number) => {
    const angle = Math.random() * Math.PI * 2;

    velocityRef.current = {
      dx: Math.cos(angle) * 1.4,
      dy: Math.sin(angle) * 1.4,
    };
    exploreTargetRef.current = getRandomRoomPoint();
    wanderUntilRef.current = timestamp + 600 + Math.random() * 700;
  }, []);

  const clearEatTimer = useCallback(() => {
    if (eatTimerRef.current) {
      window.clearTimeout(eatTimerRef.current);
      eatTimerRef.current = null;
    }
  }, []);

  const scheduleEatEnd = useCallback(() => {
    clearEatTimer();

    eatTimerRef.current = window.setTimeout(() => {
      setHasTreat(false);
      modeRef.current = "wander";
      commitLoopState({ mode: "wander" });
      exploreTargetRef.current = getRandomRoomPoint();
    }, 650);
  }, [clearEatTimer]);

  const sendForTreat = useCallback(() => {
    setHasTreat(true);
    sniffUntilRef.current = 0;
    modeRef.current = "toTreat";
    commitLoopState({ mode: "toTreat" });
  }, []);

  const getCarpetDirectionDot = useCallback(() => {
    const lastMove = lastMoveRef.current;
    const moveLength = Math.hypot(lastMove.dx, lastMove.dy);

    if (moveLength < 0.01) {
      return 0;
    }

    const targetX = CARPET.cx - positionRef.current.x;
    const targetY = CARPET.cy - positionRef.current.y;
    const targetLength = Math.hypot(targetX, targetY) || 1;

    return (
      (lastMove.dx / moveLength) * (targetX / targetLength) +
      (lastMove.dy / moveLength) * (targetY / targetLength)
    );
  }, []);

  const completeRun = useCallback(
    (completedPosition: Point) => {
      if (wonRef.current) {
        return;
      }

      const result: CompletionResult = {
        assisted: hintsUsedRef.current,
        clicks: clicksRef.current,
        completedAt: new Date(),
      };

      wonRef.current = true;
      progressRef.current = 1;
      setWon(true);
      setProgress(1);
      setCompletion(result);
      setShowCertificate(true);
      setHelpMessageKey("win");
      spawnJoy(completedPosition.x, completedPosition.y - 8);
    },
    [spawnJoy],
  );

  const reward = useCallback(
    (nextProgress: number, messageKey: GameMessageKey) => {
      progressRef.current = nextProgress;
      setProgress(nextProgress);
      setFlash("good");
      say(messageKey);
      spawnJoy(positionRef.current.x, positionRef.current.y - 8);
    },
    [say, spawnJoy],
  );

  const penalize = useCallback(
    (nextProgress: number, messageKey: GameMessageKey) => {
      progressRef.current = nextProgress;
      setProgress(nextProgress);
      setFlash("bad");
      say(messageKey);
    },
    [say],
  );

  const neutral = useCallback(
    (messageKey: GameMessageKey) => {
      setFlash("neutral");
      say(messageKey);
      spawnJoy(positionRef.current.x, positionRef.current.y - 8);
    },
    [say, spawnJoy],
  );

  const toggleHints = useCallback(() => {
    setHintsOn((currentValue) => !currentValue);
  }, []);

  const reset = useCallback(() => {
    clearEatTimer();

    progressRef.current = 0;
    setProgress(0);
    positionRef.current = initialLoopState.position;
    velocityRef.current = { dx: 0.6, dy: -0.4 };
    lastMoveRef.current = { dx: 0, dy: -1 };
    headingRef.current = initialLoopState.heading;
    exploreTargetRef.current = getRandomRoomPoint();
    modeRef.current = initialLoopState.mode;
    setHasTreat(false);
    frozenUntilRef.current = 0;
    sniffTargetRef.current = null;
    sniffUntilRef.current = 0;
    randomLieUntilRef.current = 0;
    lieTypeRef.current = initialLoopState.lieType;
    stayElapsedRef.current = 0;
    wanderUntilRef.current = 0;
    wonRef.current = false;
    setWon(false);
    setCompletion(null);
    setShowCertificate(false);
    clicksRef.current = 0;
    setClicks(0);
    setJoys([]);
    setHelpMessageKey("initialPrompt");
    hintsUsedRef.current = false;
    setFlash(null);
    commitLoopState(initialLoopState);
  }, [clearEatTimer]);

  const returnHome = useCallback(() => {
    reset();
    setStarted(false);
  }, [reset]);

  useEffect(() => {
    if (!started) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const progressValue = progressRef.current;
      const timestamp = Date.now();
      let currentPosition = positionRef.current;
      const currentMode = modeRef.current;

      let targetHeading = headingRef.current;

      if (currentMode === "frozen") {
        targetHeading =
          (Math.atan2(
            HANDLER.y - currentPosition.y,
            HANDLER.x - currentPosition.x,
          ) *
            180) /
          Math.PI;
      } else if (currentMode !== "stay" && currentMode !== "randomLie") {
        const lastMove = lastMoveRef.current;

        if (Math.hypot(lastMove.dx, lastMove.dy) > 0.05) {
          targetHeading = (Math.atan2(lastMove.dy, lastMove.dx) * 180) / Math.PI;
        }
      }

      const headingDifference =
        ((targetHeading - headingRef.current + 540) % 360) - 180;
      headingRef.current += headingDifference * (currentMode === "frozen" ? 0.18 : 0.3);
      const nextLoopState: LoopStatePatch = { heading: headingRef.current };

      if (wonRef.current) {
        currentPosition = {
          x: clampX(currentPosition.x + (Math.random() - 0.5) * 0.3),
          y: clampY(currentPosition.y + (Math.random() - 0.5) * 0.3),
        };
        positionRef.current = currentPosition;
        nextLoopState.position = { ...currentPosition };
        commitLoopState(nextLoopState);
        return;
      }

      if (currentMode === "eating") {
        commitLoopState(nextLoopState);
        return;
      }

      if (currentMode === "frozen") {
        const secondsLeft = Math.max(0, (frozenUntilRef.current - timestamp) / 1000);
        nextLoopState.frozenLeft = secondsLeft;

        if (timestamp >= frozenUntilRef.current) {
          modeRef.current = "wander";
          nextLoopState.mode = "wander";
          randomDepart(timestamp);
          say("walkedAway");
        } else {
          currentPosition = {
            x: currentPosition.x + (Math.random() - 0.5) * 0.04,
            y: currentPosition.y + (Math.random() - 0.5) * 0.04,
          };
          positionRef.current = currentPosition;
          nextLoopState.position = { ...currentPosition };
        }

        lastMoveRef.current = { dx: 0, dy: 0 };
        commitLoopState(nextLoopState);
        return;
      }

      if (currentMode === "randomLie") {
        if (timestamp >= randomLieUntilRef.current) {
          modeRef.current = "wander";
          nextLoopState.mode = "wander";
          randomDepart(timestamp);
          say("stoodUp");
        } else {
          currentPosition = {
            x: currentPosition.x + (Math.random() - 0.5) * 0.05,
            y: currentPosition.y + (Math.random() - 0.5) * 0.05,
          };
          positionRef.current = currentPosition;
          nextLoopState.position = { ...currentPosition };
        }

        lastMoveRef.current = { dx: 0, dy: 0 };
        commitLoopState(nextLoopState);
        return;
      }

      if (currentMode === "sniff") {
        const sniffTarget = sniffTargetRef.current;

        if (!sniffTarget) {
          modeRef.current = "wander";
          nextLoopState.mode = "wander";
          commitLoopState(nextLoopState);
          return;
        }

        if (sniffUntilRef.current === 0) {
          const deltaX = sniffTarget.x - currentPosition.x;
          const deltaY = sniffTarget.y - currentPosition.y;
          const targetDistance = Math.hypot(deltaX, deltaY) || 1;

          if (targetDistance < 3) {
            sniffUntilRef.current = timestamp + 1500 + Math.random() * 3000;
            lastMoveRef.current = { dx: 0, dy: 0 };
          } else {
            const speed = 1.0 + progressValue * 0.5;
            const moveX = (deltaX / targetDistance) * speed;
            const moveY = (deltaY / targetDistance) * speed;

            currentPosition = {
              x: currentPosition.x + moveX,
              y: currentPosition.y + moveY,
            };
            lastMoveRef.current = { dx: moveX, dy: moveY };
            positionRef.current = currentPosition;
            nextLoopState.position = { ...currentPosition };
          }

          commitLoopState(nextLoopState);
          return;
        }

        if (timestamp >= sniffUntilRef.current) {
          sniffUntilRef.current = 0;
          modeRef.current = "wander";
          nextLoopState.mode = "wander";
          randomDepart(timestamp);
          commitLoopState(nextLoopState);
          return;
        }

        const moveX = (Math.random() - 0.5) * 0.9;
        const moveY = (Math.random() - 0.5) * 0.9;

        currentPosition = {
          x: clampX(currentPosition.x + moveX),
          y: clampY(currentPosition.y + moveY),
        };
        lastMoveRef.current = { dx: moveX, dy: moveY };
        positionRef.current = currentPosition;
        nextLoopState.position = { ...currentPosition };
        commitLoopState(nextLoopState);
        return;
      }

      if (currentMode === "stay") {
        stayElapsedRef.current += TICK_SECONDS;
        nextLoopState.stayElapsed = Math.min(10, stayElapsedRef.current);

        if (stayElapsedRef.current >= 10) {
          commitLoopState(nextLoopState);
          completeRun(currentPosition);
          return;
        }

        if (stayElapsedRef.current >= getStayTarget(progressValue)) {
          modeRef.current = "wander";
          nextLoopState.mode = "wander";
          nextLoopState.stayElapsed = 0;
          randomDepart(timestamp);
        } else {
          const noise = getNoiseLevel(progressValue) * 0.2;
          currentPosition = {
            x: currentPosition.x + (Math.random() - 0.5) * noise,
            y: currentPosition.y + (Math.random() - 0.5) * noise,
          };
          lastMoveRef.current = { dx: 0, dy: 0 };
          positionRef.current = currentPosition;
          nextLoopState.position = { ...currentPosition };
          commitLoopState(nextLoopState);
          return;
        }
      }

      if (currentMode === "toTreat") {
        const deltaX = TREAT.x - currentPosition.x;
        const deltaY = TREAT.y - currentPosition.y;
        const targetDistance = Math.hypot(deltaX, deltaY) || 1;

        if (targetDistance < 7) {
          modeRef.current = "eating";
          nextLoopState.mode = "eating";
          commitLoopState(nextLoopState);
          spawnJoy(TREAT.x, TREAT.y - 4);
          scheduleEatEnd();
          return;
        }

        const speed = 2.4 + progressValue * 2.4;
        const moveX = (deltaX / targetDistance) * speed;
        const moveY = (deltaY / targetDistance) * speed;

        currentPosition = {
          x: currentPosition.x + moveX,
          y: currentPosition.y + moveY,
        };
        lastMoveRef.current = { dx: moveX, dy: moveY };
        positionRef.current = currentPosition;
        nextLoopState.position = { ...currentPosition };
        commitLoopState(nextLoopState);
        return;
      }

      if (timestamp >= wanderUntilRef.current) {
        const nearHandler = distanceBetween(currentPosition, HANDLER) < 30;
        const randomValue = Math.random();
        const freezeChance = nearHandler ? 0.014 + 0.024 * (1 - progressValue) : 0;
        const sniffChance = 0.006 + 0.022 * Math.max(0, 1 - progressValue / 0.7);
        const lieChance = isOnCarpet(currentPosition.x, currentPosition.y)
          ? 0
          : 0.006 + 0.02 * (1 - progressValue);

        if (randomValue < freezeChance) {
          modeRef.current = "frozen";
          nextLoopState.mode = "frozen";
          frozenUntilRef.current =
            timestamp + 1500 + Math.random() * (3000 + 4000 * (1 - progressValue));
          say("stareWait");
          commitLoopState(nextLoopState);
          return;
        }

        if (randomValue < freezeChance + sniffChance) {
          sniffTargetRef.current = getSniffSpot();
          sniffUntilRef.current = 0;
          modeRef.current = "sniff";
          nextLoopState.mode = "sniff";
          say("sniffFurniture");
          commitLoopState(nextLoopState);
          return;
        }

        if (randomValue < freezeChance + sniffChance + lieChance) {
          modeRef.current = "randomLie";
          nextLoopState.mode = "randomLie";
          randomLieUntilRef.current =
            timestamp + 1200 + Math.random() * (2500 + 2500 * (1 - progressValue));
          say("randomLie");
          lastMoveRef.current = { dx: 0, dy: 0 };
          commitLoopState(nextLoopState);
          return;
        }

        if (Math.random() < 0.5) {
          exploreTargetRef.current = getRandomRoomPoint();
        }

        wanderUntilRef.current = timestamp + 500 + Math.random() * 700;
      }

      const noise = getNoiseLevel(progressValue);
      const velocity = velocityRef.current;
      let velocityX = velocity.dx;
      let velocityY = velocity.dy;
      const exploreTarget = exploreTargetRef.current;
      if (!exploreTarget) {
        return;
      }

      const exploreDeltaX = exploreTarget.x - currentPosition.x;
      const exploreDeltaY = exploreTarget.y - currentPosition.y;
      const exploreDistance = Math.hypot(exploreDeltaX, exploreDeltaY) || 1;
      const exploreWeight = 0.05 * (1 - getCarpetAttraction(progressValue));

      velocityX += (exploreDeltaX / exploreDistance) * exploreWeight * 1.4;
      velocityY += (exploreDeltaY / exploreDistance) * exploreWeight * 1.4;
      velocityX += (Math.random() - 0.5) * noise;
      velocityY += (Math.random() - 0.5) * noise;

      const attraction = getCarpetAttraction(progressValue);
      velocityX += (CARPET.cx - currentPosition.x) * 0.011 * attraction;
      velocityY += (CARPET.cy - currentPosition.y) * 0.011 * attraction;

      const handlerDeltaX = currentPosition.x - HANDLER.x;
      const handlerDeltaY = currentPosition.y - HANDLER.y;
      const handlerDistance = Math.hypot(handlerDeltaX, handlerDeltaY) || 1;

      if (handlerDistance < HANDLER_KEEP_OUT_DISTANCE) {
        const pushStrength =
          (HANDLER_KEEP_OUT_DISTANCE - handlerDistance) / HANDLER_KEEP_OUT_DISTANCE;
        velocityX += (handlerDeltaX / handlerDistance) * pushStrength * 4;
        velocityY += (handlerDeltaY / handlerDistance) * pushStrength * 4;
      }

      const maxSpeed = 1.5 + progressValue * 0.7;
      const currentSpeed = Math.hypot(velocityX, velocityY);

      if (currentSpeed > maxSpeed) {
        velocityX = (velocityX / currentSpeed) * maxSpeed;
        velocityY = (velocityY / currentSpeed) * maxSpeed;
      }

      velocityRef.current = { dx: velocityX, dy: velocityY };

      let nextX = currentPosition.x + velocityX;
      let nextY = currentPosition.y + velocityY;

      if (nextX < 6) {
        nextX = 6;
        velocityRef.current.dx = Math.abs(velocityX);
      }

      if (nextX > 94) {
        nextX = 94;
        velocityRef.current.dx = -Math.abs(velocityX);
      }

      if (nextY < 8) {
        nextY = 8;
        velocityRef.current.dy = Math.abs(velocityY);
      }

      if (nextY > 92) {
        nextY = 92;
        velocityRef.current.dy = -Math.abs(velocityY);
      }

      const nextHandlerDistance = Math.hypot(nextX - HANDLER.x, nextY - HANDLER.y);

      if (nextHandlerDistance < HANDLER_KEEP_OUT_DISTANCE) {
        const scale = HANDLER_KEEP_OUT_DISTANCE / (nextHandlerDistance || 1);
        nextX = HANDLER.x + (nextX - HANDLER.x) * scale;
        nextY = HANDLER.y + (nextY - HANDLER.y) * scale;
      }

      lastMoveRef.current = {
        dx: nextX - currentPosition.x,
        dy: nextY - currentPosition.y,
      };

      if (isOnCarpet(nextX, nextY) && timestamp >= wanderUntilRef.current - 200) {
        const currentProgress = progressRef.current;
        const rearProbability = 0.5 * (1 - currentProgress);
        const randomLieValue = Math.random();
        let nextLieType: LieType;

        if (randomLieValue < rearProbability) {
          nextLieType = "rear";
        } else {
          nextLieType = Math.random() < 0.5 ? "head" : "body";
        }

        lieTypeRef.current = nextLieType;
        nextLoopState.lieType = nextLieType;

        let carpetAngle = Math.atan2(nextY - CARPET.cy, nextX - CARPET.cx);

        if (!Number.isFinite(carpetAngle)) {
          carpetAngle = Math.random() * Math.PI * 2;
        }

        let carpetRadius: number;
        let dogHeading: number;

        if (nextLieType === "head") {
          carpetRadius = 7;
          dogHeading = (carpetAngle * 180) / Math.PI + 180;
        } else if (nextLieType === "rear") {
          carpetRadius = 11;
          dogHeading = (carpetAngle * 180) / Math.PI;
        } else {
          carpetRadius = 2;
          dogHeading = (carpetAngle * 180) / Math.PI;
        }

        nextX = CARPET.cx + Math.cos(carpetAngle) * carpetRadius;
        nextY = CARPET.cy + Math.sin(carpetAngle) * carpetRadius;
        headingRef.current = dogHeading;
        nextLoopState.heading = dogHeading;

        modeRef.current = "stay";
        nextLoopState.mode = "stay";
        stayElapsedRef.current = 0;
        nextLoopState.stayElapsed = 0;
        lastMoveRef.current = { dx: 0, dy: 0 };
        currentPosition = { x: nextX, y: nextY };
        positionRef.current = currentPosition;
        nextLoopState.position = { ...currentPosition };
        commitLoopState(nextLoopState);
        return;
      }

      currentPosition = { x: nextX, y: nextY };
      positionRef.current = currentPosition;
      nextLoopState.position = { ...currentPosition };
      commitLoopState(nextLoopState);
    }, TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [
    completeRun,
    hintsOn,
    randomDepart,
    say,
    scheduleEatEnd,
    spawnJoy,
    started,
  ]);

  useEffect(() => clearEatTimer, [clearEatTimer]);

  const handleClick = useCallback(() => {
    if (wonRef.current) {
      return;
    }

    if (hintsOn) {
      hintsUsedRef.current = true;
    }

    clicksRef.current += 1;
    setClicks(clicksRef.current);

    if (modeRef.current === "frozen") {
      playClick();
      penalize(Math.max(0, progressRef.current - 0.05), "clickedStare");
      sendForTreat();
      window.setTimeout(() => setFlash(null), 250);
      return;
    }

    if (modeRef.current === "toTreat" || modeRef.current === "eating") {
      say("waitForTreat");
      return;
    }

    if (modeRef.current === "randomLie") {
      playClick();
      penalize(Math.max(0, progressRef.current - 0.025), "outsideLiePenalty");
      sendForTreat();
      window.setTimeout(() => setFlash(null), 250);
      return;
    }

    if (modeRef.current === "sniff") {
      playClick();

      const carpetDirectionDot = getCarpetDirectionDot();
      const currentProgress = progressRef.current;

      if (carpetDirectionDot > 0.2) {
        reward(Math.min(1, currentProgress + 0.02), "turnedToCarpet");
      } else if (carpetDirectionDot < -0.2) {
        penalize(Math.max(0, currentProgress - 0.025), "movingAway");
      } else {
        setFlash("bad");
        say("sideways");
      }

      sendForTreat();
      window.setTimeout(() => setFlash(null), 250);
      return;
    }

    if (modeRef.current === "stay") {
      playClick();

      const currentProgress = progressRef.current;

      if (lieTypeRef.current === "rear") {
        neutral("rearLieNeutral");
        sendForTreat();
        window.setTimeout(() => setFlash(null), 250);
        return;
      }

      reward(
        Math.min(1, currentProgress + (currentProgress < 0.5 ? 0.03 : 0.022)),
        lieTypeRef.current === "head" ? "headLieReward" : "bodyLieReward",
      );
      sendForTreat();
      window.setTimeout(() => setFlash(null), 250);
      return;
    }

    playClick();

    const currentProgress = progressRef.current;
    const dogOnCarpet = isOnCarpet(positionRef.current.x, positionRef.current.y);
    const isGoodTiming =
      currentProgress < 0.5
        ? dogOnCarpet || getCarpetDirectionDot() > 0.3
        : dogOnCarpet;

    if (isGoodTiming) {
      const nextProgress = Math.min(
        1,
        currentProgress + (currentProgress < 0.5 ? 0.03 : 0.022),
      );
      reward(nextProgress, getProgressMessageKey(nextProgress));
    } else {
      penalize(Math.max(0, currentProgress - 0.02), "wrongTiming");
    }

    sendForTreat();
    window.setTimeout(() => setFlash(null), 250);
  }, [
    getCarpetDirectionDot,
    neutral,
    penalize,
    playClick,
    reward,
    say,
    sendForTreat,
    hintsOn,
  ]);

  return {
    started,
    position,
    heading,
    progress,
    mode,
    hasTreat,
    frozenLeft,
    lieType,
    stayElapsed,
    won,
    clicks,
    flash,
    hintsOn,
    helpMessageKey,
    showCertificate,
    volunteerName,
    joys,
    completion,
    actions: {
      setStarted,
      toggleHints,
      reset,
      returnHome,
      handleClick,
      openCertificate: () => setShowCertificate(true),
      closeCertificate: () => setShowCertificate(false),
      setVolunteerName,
    },
  };
}
