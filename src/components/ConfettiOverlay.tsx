import { motion } from "framer-motion";
import { useMemo } from "react";

interface ConfettiOverlayProps {
  seed: number;
}

interface ConfettiPiece {
  id: number;
  color: string;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  rotation: number;
  width: number;
  height: number;
}

const colors = ["#FCC635", "#3b82f6", "#16a34a", "#ef4444", "#a855f7"];

function seededRandom(seed: number) {
  let state = seed || 1;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function ConfettiOverlay({ seed }: ConfettiOverlayProps) {
  const pieces = useMemo<ConfettiPiece[]>(() => {
    const random = seededRandom(seed);

    return Array.from({ length: 80 }, (_, index) => ({
      id: index,
      color: colors[index % colors.length],
      left: random() * 100,
      delay: random() * 0.45,
      duration: 2.1 + random() * 1.4,
      drift: -80 + random() * 160,
      rotation: -260 + random() * 520,
      width: 6 + random() * 7,
      height: 10 + random() * 10,
    }));
  }, [seed]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={`${seed}-${piece.id}`}
          className="absolute top-[-24px] rounded-sm"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
          }}
          initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "110vh",
            x: piece.drift,
            rotate: piece.rotation,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            delay: piece.delay,
            duration: piece.duration,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
