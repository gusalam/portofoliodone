import { useEffect, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { WeatherIntensity } from "@/hooks/useWeather";

const WIND_CONFIG = {
  none: { lineCount: 0, speed: 0, opacity: 0 },
  light: { lineCount: 8, speed: 3, opacity: 0.12 },
  moderate: { lineCount: 15, speed: 5, opacity: 0.18 },
  heavy: { lineCount: 25, speed: 8, opacity: 0.25 },
};

interface WindLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  thickness: number;
  curve: number;
}

const WindCanvas = memo(({ intensity }: { intensity: WeatherIntensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<WindLine[]>([]);
  const animRef = useRef<number>(0);
  const config = WIND_CONFIG[intensity];

  const initLines = useCallback((w: number, h: number) => {
    const lines: WindLine[] = [];
    for (let i = 0; i < config.lineCount; i++) {
      lines.push({
        x: Math.random() * w,
        y: Math.random() * h,
        length: 60 + Math.random() * 120,
        speed: config.speed + Math.random() * config.speed * 0.8,
        opacity: config.opacity * (0.5 + Math.random() * 0.5),
        thickness: 0.5 + Math.random() * 1,
        curve: (Math.random() - 0.5) * 20,
      });
    }
    linesRef.current = lines;
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initLines(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const l of linesRef.current) {
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.quadraticCurveTo(
          l.x + l.length * 0.5,
          l.y + l.curve,
          l.x + l.length,
          l.y + l.curve * 0.3
        );
        ctx.strokeStyle = `rgba(200, 210, 220, ${l.opacity})`;
        ctx.lineWidth = l.thickness;
        ctx.lineCap = "round";
        ctx.stroke();

        l.x += l.speed;

        // Fade out near the edge
        if (l.x > canvas.width) {
          l.x = -l.length;
          l.y = Math.random() * canvas.height;
          l.curve = (Math.random() - 0.5) * 20;
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initLines]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}
    />
  );
});
WindCanvas.displayName = "WindCanvas";

const WindEffect = ({ intensity }: { intensity: WeatherIntensity }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
  >
    <WindCanvas intensity={intensity} />
  </motion.div>
);

export default WindEffect;
