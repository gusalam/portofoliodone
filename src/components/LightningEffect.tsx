import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const LightningEffect = () => {
  const [flash, setFlash] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    // Random double-flash
    if (Math.random() > 0.5) {
      setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
      }, 200);
    }
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      // Random interval between 4-15 seconds
      const delay = 4000 + Math.random() * 11000;
      timeoutRef.current = setTimeout(() => {
        triggerFlash();
        scheduleNext();
      }, delay);
    };

    // First flash after 2-5 seconds
    timeoutRef.current = setTimeout(() => {
      triggerFlash();
      scheduleNext();
    }, 2000 + Math.random() * 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [triggerFlash]);

  return (
    <>
      {/* Lightning flash overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9997 }}
        animate={{
          backgroundColor: flash
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(255, 255, 255, 0)",
        }}
        transition={{ duration: flash ? 0.05 : 0.3 }}
      />

      {/* Lightning bolt SVG - appears randomly */}
      {flash && (
        <motion.div
          className="fixed pointer-events-none"
          style={{
            zIndex: 9997,
            top: 0,
            left: `${20 + Math.random() * 60}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <svg
            width="40"
            height="200"
            viewBox="0 0 40 200"
            className="opacity-70"
          >
            <path
              d="M20 0 L12 80 L24 75 L8 200 L28 90 L16 95 L28 0 Z"
              fill="rgba(200, 220, 255, 0.6)"
              filter="url(#glow)"
            />
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </motion.div>
      )}
    </>
  );
};

export default LightningEffect;
