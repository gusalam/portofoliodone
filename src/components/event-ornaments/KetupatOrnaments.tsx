import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ketupat {
  id: number;
  x: number;
  delay: number;
  size: number;
  rotation: number;
}

interface KetupatOrnamentsProps {
  count?: number;
  active?: boolean;
}

const KetupatOrnaments = ({ count = 6, active = true }: KetupatOrnamentsProps) => {
  const [ketupats, setKetupats] = useState<Ketupat[]>([]);

  useEffect(() => {
    if (!active) {
      setKetupats([]);
      return;
    }

    const newKetupats: Ketupat[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i / count) * 100 + Math.random() * 8 - 4,
      delay: Math.random() * 1.5,
      size: 35 + Math.random() * 20,
      rotation: -15 + Math.random() * 30,
    }));
    setKetupats(newKetupats);
  }, [active, count]);

  if (!active) return null;

  return (
    <div className="fixed inset-x-0 top-0 pointer-events-none overflow-hidden z-30 h-40">
      <AnimatePresence>
        {ketupats.map((ketupat) => (
          <motion.div
            key={ketupat.id}
            className="absolute"
            style={{
              left: `${ketupat.x}%`,
              top: -10,
            }}
            initial={{ y: -80, opacity: 0, rotate: ketupat.rotation }}
            animate={{
              y: [0, 8, 0],
              opacity: 1,
              rotate: [ketupat.rotation - 5, ketupat.rotation + 5, ketupat.rotation - 5],
            }}
            transition={{
              y: {
                duration: 3 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: ketupat.delay,
              },
              rotate: {
                duration: 4 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: ketupat.delay,
              },
              opacity: {
                duration: 0.6,
                delay: ketupat.delay,
              },
            }}
          >
            {/* Rope */}
            <div className="w-px h-6 mx-auto bg-gradient-to-b from-transparent to-amber-700" />
            
            {/* Ketupat Shape */}
            <svg
              width={ketupat.size}
              height={ketupat.size * 1.2}
              viewBox="0 0 50 60"
              className="drop-shadow-lg"
            >
              <defs>
                <linearGradient id={`ketupatGrad${ketupat.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(85 55% 50%)" />
                  <stop offset="50%" stopColor="hsl(90 50% 40%)" />
                  <stop offset="100%" stopColor="hsl(85 45% 35%)" />
                </linearGradient>
              </defs>
              
              {/* Diamond shape */}
              <path
                d="M25 5 L45 30 L25 55 L5 30 Z"
                fill={`url(#ketupatGrad${ketupat.id})`}
                stroke="hsl(90 40% 30%)"
                strokeWidth="1"
              />
              
              {/* Woven pattern */}
              <line x1="15" y1="18" x2="35" y2="42" stroke="hsl(80 35% 55%)" strokeWidth="2" opacity="0.7" />
              <line x1="35" y1="18" x2="15" y2="42" stroke="hsl(80 35% 55%)" strokeWidth="2" opacity="0.7" />
              <line x1="25" y1="12" x2="25" y2="48" stroke="hsl(80 35% 55%)" strokeWidth="2" opacity="0.7" />
              <line x1="10" y1="30" x2="40" y2="30" stroke="hsl(80 35% 55%)" strokeWidth="2" opacity="0.7" />
              
              {/* Highlight */}
              <ellipse cx="20" cy="25" rx="5" ry="8" fill="hsl(85 60% 60%)" opacity="0.3" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default KetupatOrnaments;
