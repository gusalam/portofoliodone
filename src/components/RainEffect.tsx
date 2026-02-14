import { useEffect, useRef, useCallback, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeatherIntensity } from "@/hooks/useWeather";
import { Volume2, VolumeX } from "lucide-react";

// Rain config per intensity
const RAIN_CONFIG = {
  none: { dropCount: 0, speed: 0, opacity: 0 },
  light: { dropCount: 40, speed: 1.2, opacity: 0.25 },
  moderate: { dropCount: 80, speed: 1.6, opacity: 0.35 },
  heavy: { dropCount: 150, speed: 2.2, opacity: 0.45 },
};

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

const RainCanvas = memo(({ intensity }: { intensity: WeatherIntensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<RainDrop[]>([]);
  const animFrameRef = useRef<number>(0);
  const config = RAIN_CONFIG[intensity];

  const initDrops = useCallback((width: number, height: number) => {
    const drops: RainDrop[] = [];
    for (let i = 0; i < config.dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 10 + Math.random() * 20,
        speed: 2 + Math.random() * config.speed * 4,
        opacity: 0.1 + Math.random() * config.opacity,
        width: 0.5 + Math.random() * 1.5,
      });
    }
    dropsRef.current = drops;
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const drops = dropsRef.current;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 0.5, d.y + d.length);
        ctx.strokeStyle = `rgba(174, 194, 224, ${d.opacity})`;
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";
        ctx.stroke();

        d.y += d.speed;
        d.x += 0.2;

        if (d.y > canvas.height) {
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initDrops]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}
    />
  );
});

RainCanvas.displayName = "RainCanvas";

interface RainEffectProps {
  intensity: WeatherIntensity;
  soundEnabled: boolean;
}

const RainEffect = ({ intensity, soundEnabled }: RainEffectProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!soundEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/rain-sound.mp3");
      audioRef.current.loop = true;
    }

    const vol = intensity === "heavy" ? 0.3 : intensity === "moderate" ? 0.2 : 0.1;
    audioRef.current.volume = vol;
    audioRef.current.play().catch(() => {});

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [soundEnabled, intensity]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <RainCanvas intensity={intensity} />
    </motion.div>
  );
};

export default RainEffect;
