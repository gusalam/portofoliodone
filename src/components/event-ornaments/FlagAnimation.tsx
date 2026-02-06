import { motion } from "framer-motion";

interface FlagAnimationProps {
  active?: boolean;
  position?: "left" | "right" | "both";
}

const FlagAnimation = ({ active = true, position = "both" }: FlagAnimationProps) => {
  if (!active) return null;

  const renderFlag = (pos: "left" | "right") => {
    const isLeft = pos === "left";
    
    return (
      <motion.div
        className={`fixed ${isLeft ? "left-4" : "right-4"} top-20 pointer-events-none z-30`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: isLeft ? 0 : 0.2 }}
      >
        {/* Flag Pole */}
        <div className="relative">
          <div className="w-2 h-40 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-full shadow-lg" />
          
          {/* Pole Top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-md" />
          
          {/* Flag */}
          <motion.div
            className={`absolute top-2 ${isLeft ? "left-2" : "right-2"} origin-left`}
            style={{
              perspective: 500,
            }}
          >
            <motion.svg
              width="80"
              height="50"
              viewBox="0 0 80 50"
              animate={{
                rotateY: [0, 5, 0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <defs>
                <linearGradient id={`wave-${pos}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(0 85% 55%)" />
                  <stop offset="50%" stopColor="hsl(0 80% 50%)" />
                  <stop offset="100%" stopColor="hsl(0 85% 55%)" />
                </linearGradient>
              </defs>
              
              {/* Red stripe */}
              <motion.path
                d="M0 0 Q20 2, 40 0 T80 0 L80 25 Q60 27, 40 25 T0 25 Z"
                fill={`url(#wave-${pos})`}
                animate={{
                  d: [
                    "M0 0 Q20 2, 40 0 T80 0 L80 25 Q60 27, 40 25 T0 25 Z",
                    "M0 0 Q20 -2, 40 2 T80 0 L80 25 Q60 23, 40 27 T0 25 Z",
                    "M0 0 Q20 2, 40 0 T80 0 L80 25 Q60 27, 40 25 T0 25 Z",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* White stripe */}
              <motion.path
                d="M0 25 Q20 27, 40 25 T80 25 L80 50 Q60 52, 40 50 T0 50 Z"
                fill="white"
                animate={{
                  d: [
                    "M0 25 Q20 27, 40 25 T80 25 L80 50 Q60 52, 40 50 T0 50 Z",
                    "M0 25 Q20 23, 40 27 T80 25 L80 50 Q60 48, 40 52 T0 50 Z",
                    "M0 25 Q20 27, 40 25 T80 25 L80 50 Q60 52, 40 50 T0 50 Z",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.svg>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {(position === "left" || position === "both") && renderFlag("left")}
      {(position === "right" || position === "both") && renderFlag("right")}
    </>
  );
};

export default FlagAnimation;
