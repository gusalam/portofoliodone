import { motion } from "framer-motion";
import { useMemo } from "react";

interface HeartAnimationProps {
  count?: number;
  colors?: string[];
}

const HeartAnimation = ({ count = 15, colors = ["#FF6B9D", "#FF4081", "#E91E63", "#FF1744"] }: HeartAnimationProps) => {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6,
      size: 12 + Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      startY: 100 + Math.random() * 20,
    }));
  }, [count, colors]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            bottom: `-${heart.size}px`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [`0vh`, `-${heart.startY}vh`],
            opacity: [0, 0.8, 0.6, 0],
            x: [0, Math.sin(heart.id) * 30, Math.cos(heart.id) * -20, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill={heart.color}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default HeartAnimation;
