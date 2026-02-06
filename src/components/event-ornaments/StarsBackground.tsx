import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface StarsBackgroundProps {
  count?: number;
  active?: boolean;
}

const StarsBackground = ({ count = 50, active = true }: StarsBackgroundProps) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (!active) {
      setStars([]);
      return;
    }

    const newStars: Star[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));
    setStars(newStars);
  }, [active, count]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute"
          style={{
            width: 2,
            height: 2,
            background: "white",
            boxShadow: "0 0 6px 2px white, -30px 0 15px -3px rgba(255,255,255,0.5)",
            borderRadius: "50%",
          }}
          initial={{
            x: -50,
            y: 100 + i * 100,
            opacity: 0,
          }}
          animate={{
            x: ["0vw", "100vw"],
            y: [100 + i * 100, 300 + i * 50],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5 + i * 3,
            delay: i * 4,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default StarsBackground;
