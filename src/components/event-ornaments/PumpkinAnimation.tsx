import { motion } from "framer-motion";
import { useMemo } from "react";

interface PumpkinAnimationProps {
  count?: number;
}

const PumpkinAnimation = ({ count = 8 }: PumpkinAnimationProps) => {
  const pumpkins = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 5 + (i / count) * 90,
      size: 30 + Math.random() * 25,
      delay: Math.random() * 2,
      bottom: Math.random() * 15,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pumpkins.map((pumpkin) => (
        <motion.div
          key={pumpkin.id}
          className="absolute"
          style={{
            left: `${pumpkin.left}%`,
            bottom: `${pumpkin.bottom}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: pumpkin.delay }}
        >
          <motion.svg
            width={pumpkin.size}
            height={pumpkin.size}
            viewBox="0 0 64 64"
            animate={{
              filter: [
                "drop-shadow(0 0 5px rgba(255, 140, 0, 0.5))",
                "drop-shadow(0 0 15px rgba(255, 140, 0, 0.8))",
                "drop-shadow(0 0 5px rgba(255, 140, 0, 0.5))",
              ],
            }}
            transition={{
              duration: 2,
              delay: pumpkin.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Pumpkin Body */}
            <ellipse cx="32" cy="38" rx="26" ry="22" fill="#FF8C00" />
            <ellipse cx="22" cy="38" rx="10" ry="20" fill="#FFA500" opacity="0.6" />
            <ellipse cx="42" cy="38" rx="10" ry="20" fill="#FFA500" opacity="0.6" />
            
            {/* Stem */}
            <path d="M30 16 Q32 10 34 16 L33 20 Q32 22 31 20 Z" fill="#228B22" />
            
            {/* Scary Face */}
            <motion.g
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {/* Eyes */}
              <path d="M20 32 L26 28 L26 36 Z" fill="#000" />
              <path d="M44 32 L38 28 L38 36 Z" fill="#000" />
              
              {/* Glowing Eye Centers */}
              <circle cx="24" cy="32" r="2" fill="#FFD700" />
              <circle cx="40" cy="32" r="2" fill="#FFD700" />
              
              {/* Mouth */}
              <path d="M18 44 L22 40 L26 44 L30 40 L34 44 L38 40 L42 44 L46 40 L46 46 L18 46 Z" fill="#000" />
            </motion.g>
          </motion.svg>
        </motion.div>
      ))}

      {/* Bats */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`bat-${i}`}
          className="absolute"
          style={{
            left: `${10 + i * 20}%`,
            top: `${10 + Math.random() * 20}%`,
          }}
          animate={{
            x: [0, 100, 200, 100, 0],
            y: [0, -20, 0, 20, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.svg
            width="30"
            height="20"
            viewBox="0 0 30 20"
            fill="currentColor"
            className="text-foreground/20"
            animate={{
              scaleX: [1, 0.7, 1],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
            }}
          >
            <path d="M15 8 Q5 2 0 10 Q8 8 12 12 Q13 15 15 15 Q17 15 18 12 Q22 8 30 10 Q25 2 15 8" />
            <circle cx="13" cy="10" r="1" fill="#FFD700" />
            <circle cx="17" cy="10" r="1" fill="#FFD700" />
          </motion.svg>
        </motion.div>
      ))}

      {/* Spider Web Corner */}
      <svg
        className="fixed top-0 left-0 w-32 h-32 text-foreground/10 pointer-events-none"
        viewBox="0 0 100 100"
      >
        <path d="M0 0 L100 100 M0 20 L80 100 M0 40 L60 100 M0 60 L40 100 M0 80 L20 100 M20 0 L100 80 M40 0 L100 60 M60 0 L100 40 M80 0 L100 20" 
              stroke="currentColor" 
              strokeWidth="0.5" 
              fill="none" />
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.5" />
        <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
};

export default PumpkinAnimation;
