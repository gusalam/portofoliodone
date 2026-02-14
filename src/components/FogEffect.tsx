import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { WeatherIntensity } from "@/hooks/useWeather";

const FOG_CONFIG = {
  none: { layers: 0, opacity: 0 },
  light: { layers: 2, opacity: 0.15 },
  moderate: { layers: 3, opacity: 0.25 },
  heavy: { layers: 4, opacity: 0.4 },
};

const FogLayer = memo(({ index, opacity, speed }: { index: number; opacity: number; speed: number }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: `radial-gradient(ellipse at ${30 + index * 20}% ${50 + index * 10}%, rgba(200,200,210,${opacity}) 0%, transparent 70%)`,
      animation: `fogDrift${index % 2 === 0 ? "Left" : "Right"} ${speed}s ease-in-out infinite`,
    }}
  />
));
FogLayer.displayName = "FogLayer";

const FogEffect = ({ intensity }: { intensity: WeatherIntensity }) => {
  const config = FOG_CONFIG[intensity];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}
    >
      {/* CSS keyframes */}
      <style>{`
        @keyframes fogDriftLeft {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(-5%) scale(1.05); }
        }
        @keyframes fogDriftRight {
          0%, 100% { transform: translateX(0) scale(1); }
          50% { transform: translateX(5%) scale(1.03); }
        }
      `}</style>

      {Array.from({ length: config.layers }).map((_, i) => (
        <FogLayer
          key={i}
          index={i}
          opacity={config.opacity * (0.6 + Math.random() * 0.4)}
          speed={12 + i * 4}
        />
      ))}

      {/* Bottom fog band */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "40%",
          background: `linear-gradient(to top, rgba(180,185,195,${config.opacity * 0.8}) 0%, transparent 100%)`,
        }}
      />
    </motion.div>
  );
};

export default FogEffect;
