import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Lantern {
  id: number;
  x: number;
  delay: number;
  size: number;
  glowIntensity: number;
}

interface LanternOrnamentsProps {
  count?: number;
  active?: boolean;
}

const LanternOrnaments = ({ count = 8, active = true }: LanternOrnamentsProps) => {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);

  useEffect(() => {
    if (!active) {
      setLanterns([]);
      return;
    }

    const newLanterns: Lantern[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i / count) * 100 + Math.random() * 10 - 5,
      delay: Math.random() * 2,
      size: 40 + Math.random() * 20,
      glowIntensity: 0.5 + Math.random() * 0.5,
    }));
    setLanterns(newLanterns);
  }, [active, count]);

  if (!active) return null;

  return (
    <div className="fixed inset-x-0 top-0 pointer-events-none overflow-hidden z-30 h-48">
      <AnimatePresence>
        {lanterns.map((lantern) => (
          <motion.div
            key={lantern.id}
            className="absolute"
            style={{
              left: `${lantern.x}%`,
              top: -10,
            }}
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: [0, 10, 0],
              opacity: 1,
            }}
            transition={{
              y: {
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: lantern.delay,
              },
              opacity: {
                duration: 0.8,
                delay: lantern.delay,
              },
            }}
          >
            {/* Lantern Rope */}
            <div 
              className="w-px mx-auto bg-gradient-to-b from-transparent via-amber-600/50 to-amber-500"
              style={{ height: 30 + Math.random() * 20 }}
            />
            
            {/* Lantern Body */}
            <motion.div
              className="relative"
              style={{ width: lantern.size, height: lantern.size * 1.3 }}
              animate={{
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-lg blur-md"
                style={{
                  background: `radial-gradient(circle, hsl(45 90% 60% / ${lantern.glowIntensity}) 0%, transparent 70%)`,
                  transform: "scale(1.5)",
                }}
              />
              
              {/* Lantern Shape */}
              <svg viewBox="0 0 40 52" className="w-full h-full">
                <defs>
                  <linearGradient id={`lanternGrad${lantern.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(45 90% 55%)" />
                    <stop offset="50%" stopColor="hsl(35 85% 45%)" />
                    <stop offset="100%" stopColor="hsl(25 80% 40%)" />
                  </linearGradient>
                </defs>
                
                {/* Top */}
                <rect x="14" y="0" width="12" height="4" fill="hsl(35 60% 25%)" rx="1" />
                
                {/* Body */}
                <ellipse cx="20" cy="28" rx="18" ry="22" fill={`url(#lanternGrad${lantern.id})`} opacity="0.9" />
                
                {/* Inner Glow */}
                <ellipse cx="20" cy="28" rx="12" ry="16" fill="hsl(45 95% 70%)" opacity="0.6" />
                
                {/* Bottom */}
                <ellipse cx="20" cy="48" rx="8" ry="3" fill="hsl(35 60% 25%)" />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LanternOrnaments;
