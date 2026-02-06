import { useState, useEffect, useCallback } from "react";

interface ParallaxConfig {
  speed?: number; // 0.1 = slow, 0.5 = medium, 1 = match scroll
  maxOffset?: number; // Maximum Y offset in pixels
  enabled?: boolean;
}

export const useParallax = ({
  speed = 0.3,
  maxOffset = 150,
  enabled = true,
}: ParallaxConfig = {}) => {
  const [offset, setOffset] = useState(0);
  const [scale, setScale] = useState(1);

  const handleScroll = useCallback(() => {
    if (!enabled) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Calculate parallax offset (moves slower than scroll)
    const parallaxOffset = Math.min(scrollY * speed, maxOffset);
    setOffset(parallaxOffset);
    
    // Calculate subtle scale effect (zoom out slightly as you scroll)
    const scaleValue = 1 + Math.min(scrollY * 0.0002, 0.1);
    setScale(scaleValue);
  }, [speed, maxOffset, enabled]);

  useEffect(() => {
    if (!enabled) return;
    
    // Initial calculation
    handleScroll();
    
    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, enabled]);

  return {
    offset,
    scale,
    style: enabled
      ? {
          transform: `translateY(${offset}px) scale(${scale})`,
          willChange: "transform",
        }
      : {},
  };
};

export default useParallax;
