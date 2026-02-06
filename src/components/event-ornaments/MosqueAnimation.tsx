import { motion } from "framer-motion";

interface MosqueAnimationProps {
  position?: "left" | "right" | "center";
  opacity?: number;
}

const MosqueAnimation = ({ position = "center", opacity = 0.15 }: MosqueAnimationProps) => {
  const getPositionStyles = () => {
    switch (position) {
      case "left":
        return { left: "5%", right: "auto", transform: "translateX(0)" };
      case "right":
        return { right: "5%", left: "auto", transform: "translateX(0)" };
      default:
        return { left: "50%", right: "auto", transform: "translateX(-50%)" };
    }
  };

  const positionStyles = getPositionStyles();

  return (
    <div
      className="fixed bottom-0 pointer-events-none z-0"
      style={{
        ...positionStyles,
        width: position === "center" ? "100%" : "45%",
        maxWidth: position === "center" ? "800px" : "400px",
      }}
    >
      <motion.svg
        viewBox="0 0 800 400"
        className="w-full h-auto"
        style={{ opacity }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Main Mosque Dome */}
        <motion.g
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Center Main Dome */}
          <path
            d="M400 80 Q400 20 400 20 Q450 60 450 120 L450 200 L350 200 L350 120 Q350 60 400 20"
            fill="currentColor"
            className="text-primary/30"
          />
          {/* Dome Crescent */}
          <motion.path
            d="M400 15 Q405 10 408 18 Q402 22 400 15"
            fill="currentColor"
            className="text-primary"
            animate={{
              filter: [
                "drop-shadow(0 0 5px hsl(var(--primary) / 0.5))",
                "drop-shadow(0 0 15px hsl(var(--primary) / 0.8))",
                "drop-shadow(0 0 5px hsl(var(--primary) / 0.5))",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Main Building */}
          <rect
            x="320"
            y="200"
            width="160"
            height="200"
            fill="currentColor"
            className="text-muted/40"
          />
          
          {/* Main Door */}
          <path
            d="M370 400 L370 280 Q400 250 430 280 L430 400 Z"
            fill="currentColor"
            className="text-background/60"
          />
          
          {/* Windows */}
          <motion.ellipse
            cx="355"
            cy="250"
            rx="15"
            ry="20"
            fill="currentColor"
            className="text-primary/40"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="445"
            cy="250"
            rx="15"
            ry="20"
            fill="currentColor"
            className="text-primary/40"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.g>

        {/* Left Minaret */}
        <motion.g
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          {/* Tower */}
          <rect
            x="200"
            y="100"
            width="40"
            height="300"
            fill="currentColor"
            className="text-muted/35"
          />
          {/* Top Dome */}
          <path
            d="M220 100 Q220 60 220 50 Q240 70 240 100 L200 100 Q200 70 220 50"
            fill="currentColor"
            className="text-primary/25"
          />
          {/* Crescent */}
          <motion.circle
            cx="220"
            cy="45"
            r="5"
            fill="currentColor"
            className="text-primary"
            animate={{
              filter: [
                "drop-shadow(0 0 3px hsl(var(--primary) / 0.4))",
                "drop-shadow(0 0 10px hsl(var(--primary) / 0.7))",
                "drop-shadow(0 0 3px hsl(var(--primary) / 0.4))",
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          {/* Balcony */}
          <rect x="190" y="180" width="60" height="10" fill="currentColor" className="text-muted/45" />
          <rect x="190" y="280" width="60" height="10" fill="currentColor" className="text-muted/45" />
        </motion.g>

        {/* Right Minaret */}
        <motion.g
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          {/* Tower */}
          <rect
            x="560"
            y="100"
            width="40"
            height="300"
            fill="currentColor"
            className="text-muted/35"
          />
          {/* Top Dome */}
          <path
            d="M580 100 Q580 60 580 50 Q600 70 600 100 L560 100 Q560 70 580 50"
            fill="currentColor"
            className="text-primary/25"
          />
          {/* Crescent */}
          <motion.circle
            cx="580"
            cy="45"
            r="5"
            fill="currentColor"
            className="text-primary"
            animate={{
              filter: [
                "drop-shadow(0 0 3px hsl(var(--primary) / 0.4))",
                "drop-shadow(0 0 10px hsl(var(--primary) / 0.7))",
                "drop-shadow(0 0 3px hsl(var(--primary) / 0.4))",
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          {/* Balcony */}
          <rect x="550" y="180" width="60" height="10" fill="currentColor" className="text-muted/45" />
          <rect x="550" y="280" width="60" height="10" fill="currentColor" className="text-muted/45" />
        </motion.g>

        {/* Side Domes - Left */}
        <motion.g
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        >
          <path
            d="M290 140 Q290 100 290 100 Q320 120 320 160 L320 200 L260 200 L260 160 Q260 120 290 100"
            fill="currentColor"
            className="text-primary/20"
          />
          <rect x="260" y="200" width="60" height="200" fill="currentColor" className="text-muted/30" />
        </motion.g>

        {/* Side Domes - Right */}
        <motion.g
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
        >
          <path
            d="M510 140 Q510 100 510 100 Q540 120 540 160 L540 200 L480 200 L480 160 Q480 120 510 100"
            fill="currentColor"
            className="text-primary/20"
          />
          <rect x="480" y="200" width="60" height="200" fill="currentColor" className="text-muted/30" />
        </motion.g>

        {/* Ground line with glow */}
        <motion.rect
          x="0"
          y="398"
          width="800"
          height="2"
          fill="currentColor"
          className="text-primary/30"
          animate={{
            filter: [
              "drop-shadow(0 0 5px hsl(var(--primary) / 0.3))",
              "drop-shadow(0 0 15px hsl(var(--primary) / 0.5))",
              "drop-shadow(0 0 5px hsl(var(--primary) / 0.3))",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
};

export default MosqueAnimation;
