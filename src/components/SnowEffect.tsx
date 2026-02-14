import { useEffect, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { WeatherIntensity } from "@/hooks/useWeather";

const SNOW_CONFIG = {
  none: { count: 0, speed: 0, opacity: 0 },
  light: { count: 30, speed: 0.8, opacity: 0.6 },
  moderate: { count: 70, speed: 1.0, opacity: 0.7 },
  heavy: { count: 140, speed: 1.4, opacity: 0.85 },
};

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  drift: number;
  driftSpeed: number;
  angle: number;
}

const SnowCanvas = memo(({ intensity }: { intensity: WeatherIntensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flakesRef = useRef<Snowflake[]>([]);
  const animRef = useRef<number>(0);
  const config = SNOW_CONFIG[intensity];

  const initFlakes = useCallback((w: number, h: number) => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < config.count; i++) {
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 1 + Math.random() * 3,
        speed: 0.3 + Math.random() * config.speed,
        opacity: 0.3 + Math.random() * config.opacity * 0.7,
        drift: Math.random() * 1.5 - 0.75,
        driftSpeed: 0.005 + Math.random() * 0.01,
        angle: Math.random() * Math.PI * 2,
      });
    }
    flakesRef.current = flakes;
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFlakes(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const f of flakesRef.current) {
        f.angle += f.driftSpeed;
        f.x += Math.sin(f.angle) * f.drift;
        f.y += f.speed;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();

        if (f.y > canvas.height + f.radius) {
          f.y = -f.radius;
          f.x = Math.random() * canvas.width;
        }
        if (f.x < -10) f.x = canvas.width + 10;
        if (f.x > canvas.width + 10) f.x = -10;
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initFlakes]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}
    />
  );
});

SnowCanvas.displayName = "SnowCanvas";

const SnowEffect = ({ intensity }: { intensity: WeatherIntensity }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
  >
    <SnowCanvas intensity={intensity} />
  </motion.div>
);

export default SnowEffect;
