// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RotateCcw, HelpCircle, Award, Download, Play } from "lucide-react";

import logoSrc from "./assets/logo.svg";
import furnitureBinSrc from "./assets/furniture-bin.svg";
import furnitureBowlSrc from "./assets/furniture-bowl.svg";
import furnitureCabinetSrc from "./assets/furniture-cabinet.svg";
import furniturePlantSrc from "./assets/furniture-plant.svg";
import handlerSrc from "./assets/handler.svg";
import handlerOfferingSrc from "./assets/handler-offering.svg";
import dogLieSrc from "./assets/dog-lie.svg";
import dogSniffSrc from "./assets/dog-sniff.svg";
import dogStareSrc from "./assets/dog-stare.svg";
import dogWalkSrc from "./assets/dog-walk.svg";

const CARPET = { cx: 50, cy: 32, r: 13 };
const HANDLER = { x: 50, y: 95 };
const TREAT = { x: 55, y: 90 };
const HANDLER_KEEPOUT = 17;

const FURNITURE_ASSETS = {
  plant: { src: furniturePlantSrc, width: 38, height: 38 },
  bin: { src: furnitureBinSrc, width: 30, height: 30 },
  cabinet: { src: furnitureCabinetSrc, width: 52, height: 34 },
  bowl: { src: furnitureBowlSrc, width: 30, height: 30 },
};

const DOG_ASSETS = {
  walk: dogWalkSrc,
  stare: dogStareSrc,
  lie: dogLieSrc,
  sniff: dogSniffSrc,
};

const FURNITURE = [
  { x: 12, y: 12, type: "plant", rot: 0 },
  { x: 88, y: 12, type: "plant", rot: 0 },
  { x: 9, y: 46, type: "bin", rot: 0 },
  { x: 91, y: 55, type: "cabinet", rot: 90 },
  { x: 13, y: 83, type: "plant", rot: 0 },
  { x: 87, y: 86, type: "bowl", rot: 0 },
];

const clampX = (x) => Math.min(94, Math.max(6, x));
const clampY = (y) => Math.min(92, Math.max(8, y));
const onCarpet = (x, y) => Math.hypot(x - CARPET.cx, y - CARPET.cy) <= CARPET.r;

const stayTarget = (p) => {
  const base = 1;
  if (p <= 0.6) return base;
  const f = (p - 0.6) / 0.4;
  return base + f * f * 11;
};
const attraction = (p) => Math.max(0, (p - 0.3) / 0.7) ** 1.5;
const noiseLevel = (p) => 0.55 + 0.85 * (1 - p);
const distTo = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const sniffSpot = () => {
  const f = FURNITURE[Math.floor(Math.random() * FURNITURE.length)];
  const dx = 50 - f.x,
    dy = 50 - f.y;
  const l = Math.hypot(dx, dy) || 1;
  return { x: clampX(f.x + (dx / l) * 9), y: clampY(f.y + (dy / l) * 9) };
};
const randomRoomPoint = () => ({
  x: 8 + Math.random() * 84,
  y: 12 + Math.random() * 72,
});

// ——— Logó-grafika (közös a szőnyegen és a kezdőképernyőn) ———
function LogoGraphic() {
  return (
    <img
      src={logoSrc}
      alt=""
      className="block h-full w-full object-contain"
      draggable="false"
    />
  );
}

function LogoCarpet() {
  return (
    <div
      className="absolute drop-shadow-md"
      style={{
        left: `${CARPET.cx - CARPET.r}%`,
        top: `${CARPET.cy - CARPET.r}%`,
        width: `${CARPET.r * 2}%`,
        height: `${CARPET.r * 2}%`,
        zIndex: 4,
      }}
    >
      <LogoGraphic />
    </div>
  );
}

function FurnitureTop({ type }) {
  const asset = FURNITURE_ASSETS[type] || FURNITURE_ASSETS.bowl;

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

function Handler({ offering }) {
  return (
    <img
      src={offering ? handlerOfferingSrc : handlerSrc}
      alt=""
      width="80"
      height="96"
      className="block"
      draggable="false"
    />
  );
}

function DogTop({ pose }) {
  return (
    <img
      src={DOG_ASSETS[pose] || DOG_ASSETS.walk}
      alt=""
      width="54"
      height="54"
      className="block"
      draggable="false"
    />
  );
}

const poseFor = (m) =>
  m === "frozen"
    ? "stare"
    : m === "stay" || m === "randomLie"
    ? "lie"
    : m === "sniff" || m === "eating"
    ? "sniff"
    : "walk";

export default function ClickerTrainer() {
  const [started, setStarted] = useState(false);

  const posRef = useRef({ x: 50, y: 70 });
  const [pos, setPos] = useState({ x: 50, y: 70 });
  const velRef = useRef({ dx: 0.6, dy: -0.4 });
  const lastMoveRef = useRef({ dx: 0, dy: -1 });
  const exploreTargetRef = useRef(randomRoomPoint());
  const headingRef = useRef(-90);
  const [heading, setHeading] = useState(-90);

  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const modeRef = useRef("wander");
  const [mode, setMode] = useState("wander");
  const [hasTreat, setHasTreat] = useState(false);
  const treatRef = useRef(false);
  const eatTimerRef = useRef(null);
  const wanderUntilRef = useRef(0);
  const frozenUntilRef = useRef(0);
  const [frozenLeft, setFrozenLeft] = useState(0);
  const sniffTargetRef = useRef(null);
  const sniffUntilRef = useRef(0);
  const randomLieUntilRef = useRef(0);
  const lieTypeRef = useRef("body");
  const [lieType, setLieType] = useState("body");
  const stayElapsedRef = useRef(0);
  const [stayElapsed, setStayElapsed] = useState(0);
  const wonRef = useRef(false);
  const [won, setWon] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [flash, setFlash] = useState(null);
  const [hintsOn, setHintsOn] = useState(false);
  const hintsUsedRef = useRef(false);
  const [hintsUsed, setHintsUsed] = useState(false);
  const [msg, setMsg] = useState(
    "Figyeld a kutyát, és klikkelj a jó pillanatban!"
  );
  const [showCert, setShowCert] = useState(false);
  const [volName, setVolName] = useState("");
  const [joys, setJoys] = useState([]);
  const audioRef = useRef(null);

  const toggleHints = () => {
    setHintsOn((v) => {
      const next = !v;
      if (next) {
        hintsUsedRef.current = true;
        setHintsUsed(true);
      }
      return next;
    });
  };

  const spawnJoy = (x, y) => {
    const items = ["💛", "✨", "🐾"];
    const base = Date.now();
    const fresh = items.map((e, i) => ({
      id: base + i + Math.random(),
      x: x + (i - 1) * 6,
      y: y - 4,
      emoji: e,
    }));
    setJoys((j) => [...j, ...fresh]);
    const ids = fresh.map((f) => f.id);
    setTimeout(
      () => setJoys((j) => j.filter((p) => !ids.includes(p.id))),
      1000
    );
  };

  const playClick = () => {
    try {
      if (!audioRef.current)
        audioRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 1600;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };
  const say = (m) => {
    if (hintsOn) setMsg(m);
  };

  const scheduleEatEnd = () => {
    if (eatTimerRef.current) clearTimeout(eatTimerRef.current);
    eatTimerRef.current = setTimeout(() => {
      treatRef.current = false;
      setHasTreat(false);
      modeRef.current = "wander";
      setMode("wander");
      exploreTargetRef.current = randomRoomPoint();
    }, 650);
  };
  const sendForTreat = () => {
    treatRef.current = true;
    setHasTreat(true);
    sniffUntilRef.current = 0;
    modeRef.current = "toTreat";
    setMode("toTreat");
  };
  const randomDepart = (now) => {
    const a = Math.random() * Math.PI * 2;
    velRef.current = { dx: Math.cos(a) * 1.4, dy: Math.sin(a) * 1.4 };
    exploreTargetRef.current = randomRoomPoint();
    wanderUntilRef.current = now + 600 + Math.random() * 700;
  };
  const towardCarpetDot = () => {
    const m = lastMoveRef.current;
    const ml = Math.hypot(m.dx, m.dy);
    if (ml < 0.01) return 0;
    const tx = CARPET.cx - posRef.current.x,
      ty = CARPET.cy - posRef.current.y;
    const tl = Math.hypot(tx, ty) || 1;
    return (m.dx / ml) * (tx / tl) + (m.dy / ml) * (ty / tl);
  };

  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      const dt = 0.06;
      const p = progressRef.current;
      const now = Date.now();
      let pos = posRef.current;
      const m = modeRef.current;

      let targetDeg = headingRef.current;
      if (m === "frozen") {
        targetDeg =
          (Math.atan2(HANDLER.y - pos.y, HANDLER.x - pos.x) * 180) / Math.PI;
      } else if (m !== "stay" && m !== "randomLie") {
        const mv = lastMoveRef.current;
        if (Math.hypot(mv.dx, mv.dy) > 0.05)
          targetDeg = (Math.atan2(mv.dy, mv.dx) * 180) / Math.PI;
      }
      let diff = ((targetDeg - headingRef.current + 540) % 360) - 180;
      headingRef.current += diff * (m === "frozen" ? 0.18 : 0.3);
      setHeading(headingRef.current);

      if (wonRef.current) {
        pos = {
          x: clampX(pos.x + (Math.random() - 0.5) * 0.3),
          y: clampY(pos.y + (Math.random() - 0.5) * 0.3),
        };
        posRef.current = pos;
        setPos({ ...pos });
        return;
      }
      if (m === "eating") return;

      if (m === "frozen") {
        const left = Math.max(0, (frozenUntilRef.current - now) / 1000);
        setFrozenLeft(left);
        if (now >= frozenUntilRef.current) {
          modeRef.current = "wander";
          setMode("wander");
          randomDepart(now);
          say("Magától továbbindult. 🐾");
        } else {
          pos = {
            x: pos.x + (Math.random() - 0.5) * 0.04,
            y: pos.y + (Math.random() - 0.5) * 0.04,
          };
          posRef.current = pos;
          setPos({ ...pos });
        }
        lastMoveRef.current = { dx: 0, dy: 0 };
        return;
      }

      if (m === "randomLie") {
        if (now >= randomLieUntilRef.current) {
          modeRef.current = "wander";
          setMode("wander");
          randomDepart(now);
          say("Felállt és továbbment. 🐾");
        } else {
          pos = {
            x: pos.x + (Math.random() - 0.5) * 0.05,
            y: pos.y + (Math.random() - 0.5) * 0.05,
          };
          posRef.current = pos;
          setPos({ ...pos });
        }
        lastMoveRef.current = { dx: 0, dy: 0 };
        return;
      }

      if (m === "sniff") {
        const t = sniffTargetRef.current;
        if (sniffUntilRef.current === 0) {
          const dx = t.x - pos.x,
            dy = t.y - pos.y;
          const len = Math.hypot(dx, dy) || 1;
          if (len < 3) {
            sniffUntilRef.current = now + 1500 + Math.random() * 3000;
            lastMoveRef.current = { dx: 0, dy: 0 };
          } else {
            const sp = 1.0 + p * 0.5;
            const mvx = (dx / len) * sp,
              mvy = (dy / len) * sp;
            pos = { x: pos.x + mvx, y: pos.y + mvy };
            lastMoveRef.current = { dx: mvx, dy: mvy };
            posRef.current = pos;
            setPos({ ...pos });
          }
          return;
        } else {
          if (now >= sniffUntilRef.current) {
            sniffUntilRef.current = 0;
            modeRef.current = "wander";
            setMode("wander");
            randomDepart(now);
            return;
          }
          const mvx = (Math.random() - 0.5) * 0.9,
            mvy = (Math.random() - 0.5) * 0.9;
          pos = { x: clampX(pos.x + mvx), y: clampY(pos.y + mvy) };
          lastMoveRef.current = { dx: mvx, dy: mvy };
          posRef.current = pos;
          setPos({ ...pos });
          return;
        }
      }

      if (m === "stay") {
        stayElapsedRef.current += dt;
        setStayElapsed(stayElapsedRef.current);
        if (stayElapsedRef.current >= 10) {
          wonRef.current = true;
          setWon(true);
          setShowCert(true);
          setMsg("Megvan! 🏆 10 mp a szőnyegen.");
          spawnJoy(pos.x, pos.y - 8);
          return;
        }
        if (stayElapsedRef.current >= stayTarget(p)) {
          modeRef.current = "wander";
          setMode("wander");
          randomDepart(now);
        } else {
          const n = noiseLevel(p) * 0.2;
          pos = {
            x: pos.x + (Math.random() - 0.5) * n,
            y: pos.y + (Math.random() - 0.5) * n,
          };
          lastMoveRef.current = { dx: 0, dy: 0 };
          posRef.current = pos;
          setPos({ ...pos });
          return;
        }
      }

      if (m === "toTreat") {
        const dx = TREAT.x - pos.x,
          dy = TREAT.y - pos.y;
        const len = Math.hypot(dx, dy) || 1;
        if (len < 7) {
          modeRef.current = "eating";
          setMode("eating");
          spawnJoy(TREAT.x, TREAT.y - 4);
          scheduleEatEnd();
          return;
        }
        const sp = 2.4 + p * 2.4;
        const mvx = (dx / len) * sp,
          mvy = (dy / len) * sp;
        pos = { x: pos.x + mvx, y: pos.y + mvy };
        lastMoveRef.current = { dx: mvx, dy: mvy };
        posRef.current = pos;
        setPos({ ...pos });
        return;
      }

      if (now >= wanderUntilRef.current) {
        const nearHandler = distTo(pos, HANDLER) < 30;
        const r = Math.random();
        const freezeChance = nearHandler ? 0.014 + 0.024 * (1 - p) : 0;
        const sniffChance = 0.006 + 0.022 * Math.max(0, 1 - p / 0.7);
        const lieChance = onCarpet(pos.x, pos.y) ? 0 : 0.006 + 0.02 * (1 - p);
        if (r < freezeChance) {
          modeRef.current = "frozen";
          setMode("frozen");
          frozenUntilRef.current =
            now + 1500 + Math.random() * (3000 + 4000 * (1 - p));
          say("A gazdit bámulja 👀 – NE klikkelj, várj!");
          return;
        } else if (r < freezeChance + sniffChance) {
          sniffTargetRef.current = sniffSpot();
          sniffUntilRef.current = 0;
          modeRef.current = "sniff";
          setMode("sniff");
          say(
            "Elment a bútort szaglászni 🐽 – klikkelj, ha a szőnyeg felé fordul!"
          );
          return;
        } else if (r < freezeChance + sniffChance + lieChance) {
          modeRef.current = "randomLie";
          setMode("randomLie");
          randomLieUntilRef.current =
            now + 1200 + Math.random() * (2500 + 2500 * (1 - p));
          say("Csak úgy lefeküdt – de nem a szőnyegen. Ne klikkelj erre! 🚫");
          lastMoveRef.current = { dx: 0, dy: 0 };
          return;
        }
        if (Math.random() < 0.5) exploreTargetRef.current = randomRoomPoint();
        wanderUntilRef.current = now + 500 + Math.random() * 700;
      }

      const noise = noiseLevel(p);
      let { dx, dy } = velRef.current;
      const et = exploreTargetRef.current;
      const edx = et.x - pos.x,
        edy = et.y - pos.y;
      const el = Math.hypot(edx, edy) || 1;
      const exploreW = 0.05 * (1 - attraction(p));
      dx += (edx / el) * exploreW * 1.4;
      dy += (edy / el) * exploreW * 1.4;
      dx += (Math.random() - 0.5) * 1.0 * noise;
      dy += (Math.random() - 0.5) * 1.0 * noise;
      const att = attraction(p);
      dx += (CARPET.cx - pos.x) * 0.011 * att;
      dy += (CARPET.cy - pos.y) * 0.011 * att;
      const hdx = pos.x - HANDLER.x,
        hdy = pos.y - HANDLER.y;
      const hl = Math.hypot(hdx, hdy) || 1;
      if (hl < HANDLER_KEEPOUT) {
        const push = (HANDLER_KEEPOUT - hl) / HANDLER_KEEPOUT;
        dx += (hdx / hl) * push * 4;
        dy += (hdy / hl) * push * 4;
      }
      const max = 1.5 + p * 0.7;
      const sp = Math.hypot(dx, dy);
      if (sp > max) {
        dx = (dx / sp) * max;
        dy = (dy / sp) * max;
      }
      velRef.current = { dx, dy };
      let nx = pos.x + dx,
        ny = pos.y + dy;
      if (nx < 6) {
        nx = 6;
        velRef.current.dx = Math.abs(dx);
      }
      if (nx > 94) {
        nx = 94;
        velRef.current.dx = -Math.abs(dx);
      }
      if (ny < 8) {
        ny = 8;
        velRef.current.dy = Math.abs(dy);
      }
      if (ny > 92) {
        ny = 92;
        velRef.current.dy = -Math.abs(dy);
      }
      const h2 = Math.hypot(nx - HANDLER.x, ny - HANDLER.y);
      if (h2 < HANDLER_KEEPOUT) {
        const s = HANDLER_KEEPOUT / (h2 || 1);
        nx = HANDLER.x + (nx - HANDLER.x) * s;
        ny = HANDLER.y + (ny - HANDLER.y) * s;
      }
      lastMoveRef.current = { dx: nx - pos.x, dy: ny - pos.y };

      if (onCarpet(nx, ny) && now >= wanderUntilRef.current - 200) {
        const pr = progressRef.current;
        const rearProb = 0.5 * (1 - pr);
        let lt;
        const rr = Math.random();
        if (rr < rearProb) lt = "rear";
        else lt = Math.random() < 0.5 ? "head" : "body";
        lieTypeRef.current = lt;
        setLieType(lt);

        let rad = Math.atan2(ny - CARPET.cy, nx - CARPET.cx);
        if (!isFinite(rad)) rad = Math.random() * Math.PI * 2;
        let radius, headDeg;
        if (lt === "head") {
          radius = 7;
          headDeg = (rad * 180) / Math.PI + 180;
        } else if (lt === "rear") {
          radius = 11;
          headDeg = (rad * 180) / Math.PI;
        } else {
          radius = 2;
          headDeg = (rad * 180) / Math.PI;
        }
        nx = CARPET.cx + Math.cos(rad) * radius;
        ny = CARPET.cy + Math.sin(rad) * radius;
        headingRef.current = headDeg;
        setHeading(headDeg);

        modeRef.current = "stay";
        setMode("stay");
        stayElapsedRef.current = 0;
        setStayElapsed(0);
        lastMoveRef.current = { dx: 0, dy: 0 };
        pos = { x: nx, y: ny };
        posRef.current = pos;
        setPos({ ...pos });
        return;
      }

      pos = { x: nx, y: ny };
      posRef.current = pos;
      setPos({ ...pos });
    }, 60);
    return () => clearInterval(id);
  }, [hintsOn, started]);

  const msgFor = (np) => {
    if (np >= 1) return "Tökéletes! NE klikkelj – tartsa ki a 10 mp-et! ⏳";
    if (np >= 0.75) return "Egyre tovább marad! Cél: 10 mp.";
    if (np >= 0.5)
      return "Kezdi érteni! Most azt jutalmazd, amikor a fejével/testével fekszik rá. 🛑";
    return "Jó időzítés! 🎉";
  };

  const reward = (np, m) => {
    progressRef.current = np;
    setProgress(np);
    setFlash("good");
    say(m);
    spawnJoy(posRef.current.x, posRef.current.y - 8);
  };
  const penalize = (np, m) => {
    progressRef.current = np;
    setProgress(np);
    setFlash("bad");
    say(m);
  };
  const neutral = (m) => {
    setFlash("neutral");
    say(m);
    spawnJoy(posRef.current.x, posRef.current.y - 8);
  };

  const handleClick = () => {
    if (wonRef.current) return;
    setClicks((c) => c + 1);

    if (modeRef.current === "frozen") {
      playClick();
      penalize(
        Math.max(0, progressRef.current - 0.05),
        "A bámulásra klikkeltél – a tétlenséget jutalmaznád. ⬇️"
      );
      sendForTreat();
      setTimeout(() => setFlash(null), 250);
      return;
    }
    if (modeRef.current === "toTreat" || modeRef.current === "eating") {
      say("Várd meg, míg a gazditól megkapja és megeszi a falatkát!");
      return;
    }
    if (modeRef.current === "randomLie") {
      playClick();
      penalize(
        Math.max(0, progressRef.current - 0.025),
        "Szőnyegen kívüli lefekvést jutalmaztál – ez nem cél. ⬇️"
      );
      sendForTreat();
      setTimeout(() => setFlash(null), 250);
      return;
    }
    if (modeRef.current === "sniff") {
      playClick();
      const dot = towardCarpetDot();
      const p = progressRef.current;
      if (dot > 0.2)
        reward(Math.min(1, p + 0.02), "A szőnyeg felé fordult – jó döntés! ⬆️");
      else if (dot < -0.2)
        penalize(
          Math.max(0, p - 0.025),
          "Pont elfelé mozgott – ezt jutalmaztad. ⬇️"
        );
      else {
        setFlash("bad");
        say("Oldalazott – nem egyértelmű irány.");
      }
      sendForTreat();
      setTimeout(() => setFlash(null), 250);
      return;
    }
    if (modeRef.current === "stay") {
      playClick();
      const p = progressRef.current;
      if (lieTypeRef.current === "rear") {
        neutral(
          "A fenekével fekszik rá – kap falatot, de így nem érti meg a szőnyeget, a tanítottság nem változik. ⏸️"
        );
        sendForTreat();
        setTimeout(() => setFlash(null), 250);
        return;
      }
      reward(
        Math.min(1, p + (p < 0.5 ? 0.03 : 0.022)),
        lieTypeRef.current === "head"
          ? "A fejével fekszik rá – szuper! ⬆️"
          : "Az egész testével a szőnyegen – tökéletes! ⬆️"
      );
      sendForTreat();
      setTimeout(() => setFlash(null), 250);
      return;
    }

    playClick();
    const p = progressRef.current;
    const here = onCarpet(posRef.current.x, posRef.current.y);
    let good;
    if (p < 0.5) good = here || towardCarpetDot() > 0.3;
    else good = here;
    if (good)
      reward(
        Math.min(1, p + (p < 0.5 ? 0.03 : 0.022)),
        msgFor(Math.min(1, p + 0.03))
      );
    else penalize(Math.max(0, p - 0.02), "Hoppá – rossz pillanat.");
    sendForTreat();
    setTimeout(() => setFlash(null), 250);
  };

  const reset = () => {
    progressRef.current = 0;
    setProgress(0);
    posRef.current = { x: 50, y: 70 };
    setPos({ x: 50, y: 70 });
    velRef.current = { dx: 0.6, dy: -0.4 };
    lastMoveRef.current = { dx: 0, dy: -1 };
    headingRef.current = -90;
    setHeading(-90);
    exploreTargetRef.current = randomRoomPoint();
    modeRef.current = "wander";
    setMode("wander");
    treatRef.current = false;
    setHasTreat(false);
    frozenUntilRef.current = 0;
    setFrozenLeft(0);
    sniffTargetRef.current = null;
    sniffUntilRef.current = 0;
    randomLieUntilRef.current = 0;
    lieTypeRef.current = "body";
    setLieType("body");
    stayElapsedRef.current = 0;
    setStayElapsed(0);
    wanderUntilRef.current = 0;
    wonRef.current = false;
    setWon(false);
    setShowCert(false);
    setClicks(0);
    setJoys([]);
    setMsg("Figyeld a kutyát, és klikkelj a jó pillanatban!");
    hintsUsedRef.current = false;
    setHintsUsed(false);
    setHintsOn(false);
  };

  const drawPaw = (ctx, cx, cy, s) => {
    ctx.fillStyle = "#181818";
    ctx.beginPath();
    ctx.ellipse(cx, cy + 7 * s, 11 * s, 9 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    [
      [-13, -6],
      [-5, -13],
      [5, -13],
      [13, -6],
    ].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.ellipse(
        cx + dx * s,
        cy + dy * s,
        4.2 * s,
        5.5 * s,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  };
  const wrapText = (ctx, text, x, y, maxW, lh) => {
    const words = text.split(" ");
    let line = "";
    let yy = y;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxW && i > 0) {
        ctx.fillText(line.trim(), x, yy);
        line = words[i] + " ";
        yy += lh;
      } else line = test;
    }
    ctx.fillText(line.trim(), x, yy);
    return yy;
  };
  const buildCertificate = () => {
    const assisted = hintsUsedRef.current;
    const W = 1000,
      H = 760;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fffdf5";
    ctx.fillRect(0, 0, W, H);
    const accent = assisted ? "#3b82f6" : "#F5B91D";
    ctx.strokeStyle = accent;
    ctx.lineWidth = 14;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.strokeStyle = "#181818";
    ctx.lineWidth = 3;
    ctx.strokeRect(42, 42, W - 84, H - 84);
    ctx.beginPath();
    ctx.arc(W / 2, 145, 56, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#181818";
    ctx.stroke();
    drawPaw(ctx, W / 2, 145, 1.5);
    ctx.textAlign = "center";
    ctx.fillStyle = "#181818";
    ctx.font = "900 42px Arial";
    ctx.fillText(
      assisted ? "RÉSZVÉTELI OKLEVÉL" : "KIKÉPZÉSI BIZONYÍTVÁNY",
      W / 2,
      258
    );
    ctx.font = "18px Arial";
    ctx.fillStyle = "#666";
    ctx.fillText("Klikkertréning • „Helyedre – Maradj!” gyakorlat", W / 2, 290);
    ctx.beginPath();
    ctx.moveTo(W / 2 - 210, 308);
    ctx.lineTo(W / 2 + 210, 308);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#333";
    ctx.font = "21px Arial";
    ctx.fillText(
      assisted
        ? "Ezúton igazoljuk, hogy önkéntes kollégánk"
        : "Ezúton igazoljuk, hogy önkéntes kollégánk",
      W / 2,
      360
    );
    const name = volName.trim() || "Önkéntes Kolléga";
    ctx.fillStyle = assisted ? "#1d4ed8" : "#b45309";
    ctx.font = "900 38px Georgia";
    ctx.fillText(name, W / 2, 408);

    ctx.fillStyle = "#333";
    ctx.font = "21px Arial";
    if (assisted) {
      ctx.fillText("a bekapcsolt segítség támogatásával,", W / 2, 452);
      ctx.fillStyle = "#16a34a";
      ctx.font = "900 32px Arial";
      ctx.fillText(String(clicks) + " kattintással", W / 2, 492);
      ctx.fillStyle = "#333";
      ctx.font = "21px Arial";
      ctx.fillText("sikeresen kiképezte a kutyust. 🐾", W / 2, 528);
      ctx.fillStyle = "#eaf2ff";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      const bx = W / 2 - 330,
        by = 552,
        bw = 660,
        bh = 96;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "italic 19px Arial";
      wrapText(
        ctx,
        "Gratulálunk! A következő körben próbáld meg a segítség kikapcsolásával is — figyeld a kutya testbeszédét, és klikkelj önállóan a jó pillanatban. Menni fog! 💪",
        W / 2,
        by + 36,
        bw - 60,
        28
      );
    } else {
      ctx.fillText("mindössze", W / 2 - 150, 470);
      ctx.fillStyle = "#16a34a";
      ctx.font = "900 38px Arial";
      ctx.fillText(String(clicks), W / 2, 473);
      ctx.fillStyle = "#333";
      ctx.font = "21px Arial";
      ctx.fillText("kattintással", W / 2 + 150, 470);
      ctx.fillText("teljesen önállóan kiképezte a kutyust! 🐾", W / 2, 514);
      ctx.fillStyle = "#fff7e6";
      ctx.strokeStyle = "#F5B91D";
      ctx.lineWidth = 2;
      const bx = W / 2 - 300,
        by = 542,
        bw = 600,
        bh = 70;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#92600a";
      ctx.font = "900 24px Arial";
      ctx.fillText("★ Segítség nélküli teljesítés ★", W / 2, by + 44);
    }

    const d = new Date().toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    ctx.fillStyle = "#888";
    ctx.font = "17px Arial";
    ctx.fillText("Kelt: " + d, W / 2, 686);
    ctx.strokeStyle = "#181818";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 170, 712);
    ctx.lineTo(W / 2 + 170, 712);
    ctx.stroke();
    ctx.fillStyle = "#666";
    ctx.font = "16px Arial";
    ctx.fillText(
      "Baráthegyi Vakvezető és Segítő Kutya Iskola • Önkéntes program",
      W / 2,
      734
    );
    return c;
  };
  const downloadCertificate = () => {
    try {
      const url = buildCertificate().toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${
        hintsUsedRef.current ? "reszveteli-oklevel" : "kikepzesi-bizonyitvany"
      }-${(volName.trim() || "onkentes").replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {}
  };

  const flashBorder =
    flash === "good"
      ? "border-emerald-400"
      : flash === "bad"
      ? "border-rose-300"
      : flash === "neutral"
      ? "border-slate-400"
      : "border-white";

  if (!started) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center text-center gap-4"
        >
          <div className="w-24 h-24">
            <LogoGraphic />
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-snug">
            Klikkertréning
            <br />
            <span className="text-base font-bold text-amber-600">
              Baráthegyis önkéntesek számára
            </span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Képezd ki a kiskutyát, hogy{" "}
            <span className="font-semibold text-slate-800">
              legalább 10 másodpercig mozdulatlanul feküdjön a szőnyegen
            </span>
            ! 🐕
            <br />
            Ha még nem tudod, hogyan kellene, kapcsold be a{" "}
            <span className="font-semibold text-blue-600">Segítség</span> gombot
            — végigvezet a tréningen.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-extrabold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            <Play size={20} /> Indítás
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center p-4 select-none">
      <div className="w-full max-w-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">
            🐕 Klikkertréning
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleHints}
              className={`flex items-center gap-1 text-sm rounded-full px-3 py-1 shadow ${
                hintsOn ? "bg-blue-600 text-white" : "bg-white text-slate-500"
              }`}
            >
              <HelpCircle size={14} /> Segítség {hintsOn ? "BE" : "KI"}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1 text-sm text-slate-600 bg-white rounded-full px-3 py-1 shadow"
            >
              <RotateCcw size={14} /> Újra
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 bg-white rounded-xl p-3 shadow text-center">
            <div className="text-xs text-slate-400">Tanítottság</div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {Math.round(progress * 100)}%
            </div>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3 shadow text-center">
            <div className="text-xs text-slate-400">Klikkek</div>
            <div className="text-2xl font-extrabold text-blue-600">
              {clicks}
            </div>
          </div>
        </div>

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

          {FURNITURE.map((f, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                transform: `translate(-50%, -50%) rotate(${f.rot}deg)`,
                zIndex: 6,
              }}
            >
              <div className="drop-shadow">
                <FurnitureTop type={f.type} />
              </div>
            </div>
          ))}

          <LogoCarpet />

          <div
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <div style={{ transform: `rotate(${heading}deg)` }}>
              <DogTop pose={poseFor(mode)} />
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
            <Handler
              offering={hasTreat && (mode === "toTreat" || mode === "eating")}
            />
          </div>

          {joys.map((j) => (
            <div
              key={j.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${j.x}%`, top: `${j.y}%`, zIndex: 30 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 1, 0], y: -34, scale: 1.15 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-lg"
              >
                {j.emoji}
              </motion.div>
            </div>
          ))}

          {hintsOn && mode === "frozen" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-2 bg-white/90 rounded-full px-3 py-1 text-xs text-slate-600 shadow"
              style={{ zIndex: 40 }}
            >
              gazdit bámulja… {frozenLeft.toFixed(1)} mp — várj!
            </div>
          )}
          {hintsOn && mode === "stay" && lieType === "rear" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 top-2 bg-white/90 rounded-full px-3 py-1 text-xs text-slate-500 shadow"
              style={{ zIndex: 40 }}
            >
              fenekével fekszik rá — kap falatot, de a tanítottság nem nő
            </div>
          )}

          {won && !showCert && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-emerald-500/20"
              style={{ zIndex: 40 }}
            >
              <button
                onClick={() => setShowCert(true)}
                className="flex items-center gap-2 bg-white/95 rounded-xl px-4 py-3 text-emerald-700 font-bold shadow"
              >
                <Award size={20} /> Tanúsítvány megnyitása
              </button>
            </div>
          )}
        </div>

        {hintsOn && (
          <div className="bg-white rounded-xl p-3 shadow text-sm text-slate-700 min-h-12 flex items-center">
            {msg}
          </div>
        )}

        <button
          onClick={handleClick}
          disabled={won}
          className={`w-full py-6 rounded-2xl text-white text-2xl font-extrabold shadow-lg active:scale-95 transition-transform ${
            won ? "bg-slate-400" : "bg-blue-600 active:bg-blue-700"
          }`}
        >
          KLIKK
        </button>
      </div>

      {showCert && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 flex flex-col gap-4">
            <div className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full border-4 border-slate-900 flex items-center justify-center text-2xl ${
                  hintsUsed ? "bg-blue-400" : "bg-amber-400"
                }`}
              >
                🐾
              </div>
              <h2 className="mt-2 text-xl font-extrabold text-slate-800">
                {hintsUsed ? "Részvételi oklevél" : "Kiképzési bizonyítvány"}
              </h2>
              <p className="text-sm text-slate-500">
                „Helyedre – Maradj!” gyakorlat
              </p>
            </div>

            {hintsUsed ? (
              <>
                <p className="text-center text-slate-700">
                  A{" "}
                  <span className="font-semibold text-blue-600">
                    segítség támogatásával
                  </span>
                  ,{" "}
                  <span className="font-bold text-green-600 text-lg">
                    {clicks}
                  </span>{" "}
                  kattintással kiképezted a kutyust! 🎉
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                  💪 <span className="font-semibold">Következő kihívás:</span>{" "}
                  próbáld meg legközelebb{" "}
                  <span className="font-semibold">segítség nélkül</span> is!
                  Figyeld a kutya testbeszédét, és klikkelj önállóan a jó
                  pillanatban — menni fog!
                </div>
              </>
            ) : (
              <>
                <p className="text-center text-slate-700">
                  <span className="font-bold text-green-600 text-lg">
                    {clicks}
                  </span>{" "}
                  kattintással,{" "}
                  <span className="font-semibold text-amber-600">
                    teljesen önállóan
                  </span>{" "}
                  kiképezted a kutyust! 🎉
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 text-center font-semibold">
                  ★ Segítség nélküli teljesítés ★
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-slate-500">
                Önkéntes kolléga neve
              </label>
              <input
                value={volName}
                onChange={(e) => setVolName(e.target.value)}
                placeholder="Írd be a neved…"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              onClick={downloadCertificate}
              className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl shadow ${
                hintsUsed
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              <Download size={18} /> {hintsUsed ? "Oklevél" : "Bizonyítvány"}{" "}
              letöltése (PNG)
            </button>
            <button
              onClick={() => setShowCert(false)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
