import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

interface FireworksAnimationProps {
  colors?: string[];
  active?: boolean;
}

const FireworksAnimation = ({
  colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#3B82F6"],
  active = true,
}: FireworksAnimationProps) => {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  useEffect(() => {
    if (!active) {
      setFireworks([]);
      return;
    }

    const createFirework = () => ({
      id: Date.now() + Math.random(),
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    });

    // Initial fireworks
    setFireworks([createFirework(), createFirework()]);

    // Add new fireworks periodically
    const interval = setInterval(() => {
      setFireworks((prev) => {
        const newFireworks = [...prev, createFirework()];
        // Keep only last 5 fireworks
        return newFireworks.slice(-5);
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [active, colors]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30">
      <AnimatePresence>
        {fireworks.map((firework) => (
          <Firework key={firework.id} {...firework} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Firework = ({ x, y, color, delay }: Omit<Firework, "id">) => {
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    return {
      angle,
      distance: 60 + Math.random() * 40,
    };
  });

  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Launch trail */}
      <motion.div
        className="absolute w-1 bg-gradient-to-t from-transparent to-yellow-300"
        style={{ bottom: 0, left: "50%", transform: "translateX(-50%)" }}
        initial={{ height: 0, opacity: 1 }}
        animate={{ height: 100, opacity: 0 }}
        transition={{ duration: 0.5, delay }}
      />

      {/* Explosion particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            delay: delay + 0.5,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Center flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 20,
          height: 20,
          backgroundColor: "white",
          left: -10,
          top: -10,
          boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
        transition={{
          duration: 0.6,
          delay: delay + 0.5,
        }}
      />

      {/* Sparkle trails */}
      {particles.slice(0, 6).map((particle, i) => (
        <motion.div
          key={`trail-${i}`}
          className="absolute"
          style={{
            width: 2,
            height: 20,
            background: `linear-gradient(to bottom, ${color}, transparent)`,
            transformOrigin: "center top",
            rotate: `${(particle.angle * 180) / Math.PI + 90}deg`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0.5],
            x: Math.cos(particle.angle) * particle.distance * 0.5,
            y: Math.sin(particle.angle) * particle.distance * 0.5,
          }}
          transition={{
            duration: 0.8,
            delay: delay + 0.6,
          }}
        />
      ))}
    </motion.div>
  );
};

export default FireworksAnimation;
