import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

interface ConfettiAnimationProps {
  colors?: string[];
  count?: number;
  duration?: number;
  active?: boolean;
}

const ConfettiAnimation = ({
  colors = ["#FFD700", "#22C55E", "#3B82F6", "#EF4444", "#A855F7"],
  count = 50,
  duration = 5,
  active = true,
}: ConfettiAnimationProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const newPieces: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 8,
      delay: Math.random() * 2,
    }));
    setPieces(newPieces);

    // Regenerate periodically
    const interval = setInterval(() => {
      setPieces(
        Array.from({ length: count }, (_, i) => ({
          id: i + Date.now(),
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 8 + Math.random() * 8,
          delay: Math.random() * 0.5,
        }))
      );
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [active, colors, count, duration]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: `${piece.x}vw`,
              y: `${piece.y}vh`,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: "110vh",
              rotate: piece.rotation + 720,
              opacity: [1, 1, 0.8, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration,
              delay: piece.delay,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ConfettiAnimation;
