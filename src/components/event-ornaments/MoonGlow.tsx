import { motion } from "framer-motion";

interface MoonGlowProps {
  active?: boolean;
  size?: number;
  position?: "top-left" | "top-right";
}

const MoonGlow = ({ 
  active = true, 
  size = 120,
  position = "top-right" 
}: MoonGlowProps) => {
  if (!active) return null;

  const positionClasses = position === "top-right" 
    ? "top-20 right-10" 
    : "top-20 left-10";

  return (
    <motion.div
      className={`fixed ${positionClasses} pointer-events-none z-20`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Outer Glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 2.5,
          height: size * 2.5,
          left: -size * 0.75,
          top: -size * 0.75,
          background: "radial-gradient(circle, hsl(48 88% 60% / 0.15) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Middle Glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          left: -size * 0.4,
          top: -size * 0.4,
          background: "radial-gradient(circle, hsl(48 85% 65% / 0.25) 0%, transparent 50%)",
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Moon Body */}
      <motion.div
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, hsl(48 90% 85%) 0%, hsl(45 85% 75%) 50%, hsl(42 80% 65%) 100%)",
          boxShadow: `
            0 0 40px hsl(48 88% 60% / 0.4),
            0 0 80px hsl(48 88% 60% / 0.2),
            inset -10px -10px 30px hsl(45 70% 60% / 0.3)
          `,
        }}
        animate={{
          boxShadow: [
            "0 0 40px hsl(48 88% 60% / 0.4), 0 0 80px hsl(48 88% 60% / 0.2), inset -10px -10px 30px hsl(45 70% 60% / 0.3)",
            "0 0 60px hsl(48 88% 60% / 0.5), 0 0 100px hsl(48 88% 60% / 0.3), inset -10px -10px 30px hsl(45 70% 60% / 0.3)",
            "0 0 40px hsl(48 88% 60% / 0.4), 0 0 80px hsl(48 88% 60% / 0.2), inset -10px -10px 30px hsl(45 70% 60% / 0.3)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Moon Craters */}
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            top: "20%",
            left: "25%",
            background: "hsl(40 60% 50%)",
          }}
        />
        <div
          className="absolute rounded-full opacity-15"
          style={{
            width: size * 0.1,
            height: size * 0.1,
            top: "50%",
            left: "60%",
            background: "hsl(40 60% 50%)",
          }}
        />
        <div
          className="absolute rounded-full opacity-10"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            top: "65%",
            left: "30%",
            background: "hsl(40 60% 50%)",
          }}
        />
      </motion.div>

      {/* Stars around moon */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
            left: size * (0.5 + Math.cos((i * 72 * Math.PI) / 180) * 1.2),
            top: size * (0.5 + Math.sin((i * 72 * Math.PI) / 180) * 1.2),
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  );
};

export default MoonGlow;
