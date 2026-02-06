import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Leaf {
  id: number;
  x: number;
  delay: number;
  size: number;
  rotation: number;
  type: "leaf" | "flower";
}

interface NatureOrnamentsProps {
  count?: number;
  active?: boolean;
}

const NatureOrnaments = ({ count = 15, active = true }: NatureOrnamentsProps) => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    if (!active) {
      setLeaves([]);
      return;
    }

    const newLeaves: Leaf[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      size: 15 + Math.random() * 15,
      rotation: Math.random() * 360,
      type: Math.random() > 0.7 ? "flower" : "leaf",
    }));
    setLeaves(newLeaves);
  }, [active, count]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{ left: `${leaf.x}%` }}
          initial={{ y: -50, rotate: leaf.rotation, opacity: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [leaf.rotation, leaf.rotation + 180],
            x: [0, Math.sin(leaf.id) * 50, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear",
          }}
        >
          {leaf.type === "leaf" ? (
            <svg
              width={leaf.size}
              height={leaf.size * 1.5}
              viewBox="0 0 30 45"
            >
              <defs>
                <linearGradient id={`leafGrad${leaf.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(120 60% 45%)" />
                  <stop offset="100%" stopColor="hsl(100 50% 35%)" />
                </linearGradient>
              </defs>
              <path
                d="M15 0 Q30 15 15 45 Q0 15 15 0"
                fill={`url(#leafGrad${leaf.id})`}
              />
              <line
                x1="15"
                y1="5"
                x2="15"
                y2="40"
                stroke="hsl(100 40% 30%)"
                strokeWidth="1"
              />
            </svg>
          ) : (
            <svg width={leaf.size} height={leaf.size} viewBox="0 0 30 30">
              {[...Array(5)].map((_, i) => (
                <ellipse
                  key={i}
                  cx="15"
                  cy="8"
                  rx="5"
                  ry="8"
                  fill="hsl(330 70% 70%)"
                  transform={`rotate(${i * 72} 15 15)`}
                  opacity="0.8"
                />
              ))}
              <circle cx="15" cy="15" r="4" fill="hsl(50 90% 60%)" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default NatureOrnaments;
