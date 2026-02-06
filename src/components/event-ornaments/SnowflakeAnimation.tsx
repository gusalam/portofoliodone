import { motion } from "framer-motion";
import { useMemo } from "react";

interface SnowflakeAnimationProps {
  count?: number;
}

const SnowflakeAnimation = ({ count = 40 }: SnowflakeAnimationProps) => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 15,
      size: 8 + Math.random() * 16,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute text-white"
          style={{
            left: `${flake.left}%`,
            top: -20,
            fontSize: flake.size,
            opacity: flake.opacity,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(flake.id) * 50, Math.cos(flake.id) * -30, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
};

export default SnowflakeAnimation;
