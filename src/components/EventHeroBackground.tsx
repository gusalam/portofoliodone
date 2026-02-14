import { lazy, Suspense, useMemo, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEventTheme, EventThemeType } from "@/hooks/useEventTheme";
import { usePerformance } from "@/hooks/usePerformance";
import useParallax from "@/hooks/useParallax";
import { Skeleton } from "@/components/ui/skeleton";

// Import all event background images
import newYearBg from "@/assets/event-bg-new-year.jpg";
import ramadanBg from "@/assets/event-bg-ramadan.jpg";
import eidFitrBg from "@/assets/event-bg-eid-fitr.jpg";
import eidAdhaBg from "@/assets/event-bg-eid-adha.jpg";
import maulidNabiBg from "@/assets/event-bg-maulid-nabi.jpg";
import israMirajBg from "@/assets/event-bg-isra-miraj.jpg";
import islamicNewYearBg from "@/assets/event-bg-islamic-new-year.jpg";
import independenceBg from "@/assets/event-bg-independence.jpg";
import heroesDayBg from "@/assets/event-bg-heroes-day.jpg";
import kartiniDayBg from "@/assets/event-bg-kartini-day.jpg";
import youthPledgeBg from "@/assets/event-bg-youth-pledge.jpg";
import pancasilaDayBg from "@/assets/event-bg-pancasila-day.jpg";
import batikDayBg from "@/assets/event-bg-batik-day.jpg";
import educationDayBg from "@/assets/event-bg-education-day.jpg";
import valentineBg from "@/assets/event-bg-valentine.jpg";
import halloweenBg from "@/assets/event-bg-halloween.jpg";
import earthDayBg from "@/assets/event-bg-earth-day.jpg";
import environmentDayBg from "@/assets/event-bg-environment-day.jpg";
import mothersDayBg from "@/assets/event-bg-mothers-day.jpg";
import fathersDayBg from "@/assets/event-bg-fathers-day.jpg";
import laborDayBg from "@/assets/event-bg-labor-day.jpg";
import christmasBg from "@/assets/event-bg-christmas.jpg";

// ========== IMAGE CACHE SYSTEM ==========
// Global cache to persist across component re-renders
const imageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();

// Preload and cache an image
const preloadImage = (src: string): Promise<HTMLImageElement> => {
  // Return cached image immediately
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }

  // Return existing loading promise to avoid duplicate requests
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }

  // Create new loading promise
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      imageCache.set(src, img);
      loadingPromises.delete(src);
      resolve(img);
    };
    
    img.onerror = () => {
      loadingPromises.delete(src);
      reject(new Error(`Failed to load image: ${src}`));
    };
  });

  loadingPromises.set(src, promise);
  return promise;
};

// Check if image is cached
const isImageCached = (src: string): boolean => imageCache.has(src);

// Get cache stats for debugging
const getCacheStats = () => ({
  cachedImages: imageCache.size,
  loadingImages: loadingPromises.size,
});

// Lazy load heavy visual components
const FireworksAnimation = lazy(() => import("./event-ornaments/FireworksAnimation"));
const LanternOrnaments = lazy(() => import("./event-ornaments/LanternOrnaments"));
const MoonGlow = lazy(() => import("./event-ornaments/MoonGlow"));
const KetupatOrnaments = lazy(() => import("./event-ornaments/KetupatOrnaments"));
const ConfettiAnimation = lazy(() => import("./event-ornaments/ConfettiAnimation"));
const StarsBackground = lazy(() => import("./event-ornaments/StarsBackground"));
const SnowflakeAnimation = lazy(() => import("./event-ornaments/SnowflakeAnimation"));
const MosqueAnimation = lazy(() => import("./event-ornaments/MosqueAnimation"));
const FlagAnimation = lazy(() => import("./event-ornaments/FlagAnimation"));
const HeartAnimation = lazy(() => import("./event-ornaments/HeartAnimation"));

// Complete event background image mapping - ALL events have unique backgrounds
const EVENT_BACKGROUND_IMAGES: Record<EventThemeType, string | null> = {
  "default": null,
  // Islamic Events
  "new-year": newYearBg,
  "ramadan": ramadanBg,
  "eid-fitr": eidFitrBg,
  "eid-adha": eidAdhaBg,
  "maulid-nabi": maulidNabiBg,
  "isra-miraj": israMirajBg,
  "islamic-new-year": islamicNewYearBg,
  // Indonesian National Events
  "independence-day": independenceBg,
  "heroes-day": heroesDayBg,
  "kartini-day": kartiniDayBg,
  "youth-pledge": youthPledgeBg,
  "pancasila-day": pancasilaDayBg,
  "batik-day": batikDayBg,
  "education-day": educationDayBg,
  // Global Events
  "valentine": valentineBg,
  "halloween": halloweenBg,
  "christmas": christmasBg,
  "earth-day": earthDayBg,
  "environment-day": environmentDayBg,
  "mothers-day": mothersDayBg,
  "fathers-day": fathersDayBg,
  "labor-day": laborDayBg,
};

// Event background configurations
interface EventBackgroundConfig {
  gradient: string;
  overlayGradient?: string;
  glowColor: string;
  secondaryGlow?: string;
  pattern?: "stars" | "dots" | "islamic" | "festive";
  animatedElements?: React.ReactNode;
}

// Full visual configurations for each event
const EVENT_BACKGROUNDS: Partial<Record<EventThemeType, EventBackgroundConfig>> = {
  "new-year": {
    gradient: "linear-gradient(135deg, hsl(250, 60%, 10%) 0%, hsl(280, 70%, 15%) 30%, hsl(220, 60%, 12%) 70%, hsl(260, 50%, 8%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 0%, hsl(45, 100%, 50%, 0.15) 0%, transparent 60%)",
    glowColor: "hsl(45, 100%, 50%)",
    secondaryGlow: "hsl(280, 80%, 60%)",
    pattern: "festive",
    animatedElements: (
      <>
        <FireworksAnimation colors={["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#F59E0B"]} />
        <StarsBackground count={60} />
      </>
    ),
  },
  "ramadan": {
    gradient: "linear-gradient(180deg, hsl(160, 60%, 8%) 0%, hsl(150, 50%, 12%) 40%, hsl(140, 40%, 10%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 80% 10%, hsl(45, 90%, 50%, 0.2) 0%, transparent 50%)",
    glowColor: "hsl(45, 90%, 55%)",
    secondaryGlow: "hsl(160, 70%, 40%)",
    pattern: "islamic",
    animatedElements: (
      <>
        <MosqueAnimation position="center" opacity={0.15} />
        <MoonGlow position="top-right" size={120} />
        <LanternOrnaments count={10} />
        <StarsBackground count={50} />
      </>
    ),
  },
  "eid-fitr": {
    gradient: "linear-gradient(180deg, hsl(140, 50%, 12%) 0%, hsl(120, 45%, 15%) 50%, hsl(80, 60%, 18%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 30%, hsl(45, 100%, 50%, 0.15) 0%, transparent 60%)",
    glowColor: "hsl(120, 60%, 50%)",
    secondaryGlow: "hsl(45, 90%, 55%)",
    pattern: "festive",
    animatedElements: (
      <>
        <KetupatOrnaments count={12} />
        <ConfettiAnimation colors={["#22C55E", "#FFD700", "#FFFFFF", "#84CC16"]} count={50} />
        <LanternOrnaments count={6} />
      </>
    ),
  },
  "eid-adha": {
    gradient: "linear-gradient(180deg, hsl(30, 60%, 12%) 0%, hsl(25, 55%, 15%) 50%, hsl(35, 50%, 10%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 80% 20%, hsl(45, 80%, 50%, 0.2) 0%, transparent 50%)",
    glowColor: "hsl(35, 80%, 55%)",
    secondaryGlow: "hsl(25, 70%, 50%)",
    pattern: "islamic",
    animatedElements: (
      <>
        <MosqueAnimation position="right" opacity={0.12} />
        <MoonGlow position="top-right" size={100} />
        <LanternOrnaments count={8} />
      </>
    ),
  },
  "maulid-nabi": {
    gradient: "linear-gradient(180deg, hsl(150, 50%, 8%) 0%, hsl(45, 70%, 12%) 40%, hsl(35, 60%, 10%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 20%, hsl(45, 100%, 50%, 0.25) 0%, transparent 50%)",
    glowColor: "hsl(45, 100%, 55%)",
    secondaryGlow: "hsl(150, 60%, 45%)",
    pattern: "islamic",
    animatedElements: (
      <>
        <MosqueAnimation position="center" opacity={0.18} />
        <LanternOrnaments count={12} />
        <MoonGlow position="top-right" size={100} />
        <StarsBackground count={45} />
      </>
    ),
  },
  "isra-miraj": {
    gradient: "linear-gradient(180deg, hsl(240, 50%, 8%) 0%, hsl(250, 60%, 12%) 40%, hsl(220, 50%, 10%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 70% 15%, hsl(45, 100%, 60%, 0.3) 0%, transparent 40%)",
    glowColor: "hsl(45, 100%, 60%)",
    secondaryGlow: "hsl(240, 70%, 60%)",
    pattern: "stars",
    animatedElements: (
      <>
        <MosqueAnimation position="center" opacity={0.15} />
        <StarsBackground count={80} />
        <MoonGlow position="top-right" size={140} />
      </>
    ),
  },
  "islamic-new-year": {
    gradient: "linear-gradient(180deg, hsl(35, 50%, 10%) 0%, hsl(30, 60%, 14%) 50%, hsl(25, 50%, 8%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 60% 20%, hsl(45, 90%, 50%, 0.2) 0%, transparent 50%)",
    glowColor: "hsl(35, 90%, 55%)",
    secondaryGlow: "hsl(45, 80%, 50%)",
    pattern: "islamic",
    animatedElements: (
      <>
        <MosqueAnimation position="left" opacity={0.12} />
        <MoonGlow position="top-right" size={110} />
        <StarsBackground count={50} />
      </>
    ),
  },
  "independence-day": {
    gradient: "linear-gradient(180deg, hsl(0, 70%, 20%) 0%, hsl(0, 65%, 30%) 45%, hsl(0, 0%, 95%) 55%, hsl(0, 0%, 98%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 50%, hsl(0, 70%, 50%, 0.15) 0%, transparent 60%)",
    glowColor: "hsl(0, 80%, 50%)",
    secondaryGlow: "hsl(0, 0%, 100%)",
    pattern: "festive",
    animatedElements: (
      <>
        <FlagAnimation position="both" />
        <ConfettiAnimation colors={["#EF4444", "#FFFFFF", "#DC2626"]} count={60} />
      </>
    ),
  },
  "heroes-day": {
    gradient: "linear-gradient(180deg, hsl(0, 60%, 15%) 0%, hsl(20, 50%, 18%) 50%, hsl(30, 45%, 12%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 30% 30%, hsl(20, 70%, 40%, 0.2) 0%, transparent 50%)",
    glowColor: "hsl(0, 70%, 50%)",
    secondaryGlow: "hsl(35, 80%, 50%)",
    pattern: "dots",
    animatedElements: (
      <>
        <FlagAnimation position="left" />
      </>
    ),
  },
  "kartini-day": {
    gradient: "linear-gradient(180deg, hsl(35, 60%, 12%) 0%, hsl(340, 45%, 18%) 50%, hsl(30, 50%, 15%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 40%, hsl(340, 60%, 50%, 0.15) 0%, transparent 50%)",
    glowColor: "hsl(35, 80%, 55%)",
    secondaryGlow: "hsl(340, 60%, 55%)",
    pattern: "dots",
  },
  "youth-pledge": {
    gradient: "linear-gradient(180deg, hsl(0, 60%, 18%) 0%, hsl(40, 70%, 20%) 50%, hsl(0, 55%, 15%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 40%, hsl(40, 80%, 50%, 0.15) 0%, transparent 50%)",
    glowColor: "hsl(0, 70%, 55%)",
    secondaryGlow: "hsl(40, 90%, 55%)",
    pattern: "festive",
    animatedElements: (
      <>
        <FlagAnimation position="right" />
        <ConfettiAnimation colors={["#EF4444", "#FFD700", "#FFFFFF"]} count={35} />
      </>
    ),
  },
  "pancasila-day": {
    gradient: "linear-gradient(180deg, hsl(0, 55%, 15%) 0%, hsl(35, 60%, 18%) 50%, hsl(0, 50%, 12%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 30%, hsl(35, 70%, 50%, 0.15) 0%, transparent 50%)",
    glowColor: "hsl(0, 65%, 50%)",
    secondaryGlow: "hsl(35, 80%, 55%)",
    pattern: "stars",
    animatedElements: (
      <>
        <FlagAnimation position="left" />
        <StarsBackground count={30} />
      </>
    ),
  },
  "batik-day": {
    gradient: "linear-gradient(180deg, hsl(30, 50%, 12%) 0%, hsl(35, 55%, 16%) 50%, hsl(25, 45%, 10%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 50%, hsl(30, 60%, 40%, 0.1) 0%, transparent 50%)",
    glowColor: "hsl(30, 70%, 50%)",
    secondaryGlow: "hsl(35, 75%, 55%)",
    pattern: "dots",
  },
  "education-day": {
    gradient: "linear-gradient(180deg, hsl(45, 80%, 20%) 0%, hsl(210, 60%, 25%) 50%, hsl(45, 70%, 18%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 30%, hsl(45, 90%, 60%, 0.2) 0%, transparent 50%)",
    glowColor: "hsl(45, 90%, 55%)",
    secondaryGlow: "hsl(210, 70%, 55%)",
    pattern: "dots",
  },
  "christmas": {
    gradient: "linear-gradient(180deg, hsl(200, 50%, 12%) 0%, hsl(150, 45%, 15%) 50%, hsl(160, 40%, 10%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 0%, hsl(0, 0%, 100%, 0.1) 0%, transparent 50%)",
    glowColor: "hsl(0, 75%, 55%)",
    secondaryGlow: "hsl(140, 60%, 45%)",
    pattern: "festive",
    animatedElements: (
      <>
        <SnowflakeAnimation count={60} />
      </>
    ),
  },
  "halloween": {
    gradient: "linear-gradient(180deg, hsl(270, 30%, 8%) 0%, hsl(25, 80%, 15%) 40%, hsl(280, 40%, 10%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 80%, hsl(25, 100%, 50%, 0.2) 0%, transparent 50%)",
    glowColor: "hsl(25, 100%, 50%)",
    secondaryGlow: "hsl(280, 70%, 50%)",
    pattern: "dots",
  },
  "valentine": {
    gradient: "linear-gradient(180deg, hsl(340, 50%, 12%) 0%, hsl(350, 60%, 18%) 50%, hsl(330, 45%, 15%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 30%, hsl(340, 80%, 60%, 0.2) 0%, transparent 50%)",
    glowColor: "hsl(340, 80%, 60%)",
    secondaryGlow: "hsl(350, 90%, 65%)",
    pattern: "festive",
    animatedElements: (
      <>
        <HeartAnimation count={25} colors={["#FF6B9D", "#FF4081", "#E91E63", "#FF1744"]} />
      </>
    ),
  },
  "earth-day": {
    gradient: "linear-gradient(180deg, hsl(200, 50%, 15%) 0%, hsl(150, 45%, 18%) 50%, hsl(180, 40%, 12%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 50%, hsl(150, 60%, 40%, 0.15) 0%, transparent 60%)",
    glowColor: "hsl(150, 60%, 45%)",
    secondaryGlow: "hsl(200, 70%, 50%)",
    pattern: "dots",
  },
  "environment-day": {
    gradient: "linear-gradient(180deg, hsl(140, 50%, 10%) 0%, hsl(150, 55%, 15%) 50%, hsl(160, 45%, 12%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 40%, hsl(140, 70%, 45%, 0.15) 0%, transparent 50%)",
    glowColor: "hsl(140, 65%, 45%)",
    secondaryGlow: "hsl(160, 60%, 50%)",
    pattern: "dots",
  },
  "mothers-day": {
    gradient: "linear-gradient(180deg, hsl(330, 45%, 15%) 0%, hsl(340, 55%, 20%) 50%, hsl(350, 50%, 18%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 30%, hsl(330, 70%, 60%, 0.2) 0%, transparent 50%)",
    glowColor: "hsl(330, 70%, 60%)",
    secondaryGlow: "hsl(340, 80%, 70%)",
    pattern: "festive",
    animatedElements: (
      <>
        <HeartAnimation count={15} colors={["#FF69B4", "#FFB6C1", "#FFC0CB"]} />
      </>
    ),
  },
  "fathers-day": {
    gradient: "linear-gradient(180deg, hsl(210, 50%, 15%) 0%, hsl(200, 45%, 20%) 50%, hsl(220, 40%, 18%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 30%, hsl(210, 60%, 50%, 0.15) 0%, transparent 50%)",
    glowColor: "hsl(210, 60%, 55%)",
    secondaryGlow: "hsl(200, 70%, 60%)",
    pattern: "dots",
    animatedElements: (
      <>
        <StarsBackground count={25} />
      </>
    ),
  },
  "labor-day": {
    gradient: "linear-gradient(180deg, hsl(0, 55%, 15%) 0%, hsl(45, 70%, 18%) 50%, hsl(0, 50%, 12%) 100%)",
    overlayGradient: "radial-gradient(ellipse at 50% 40%, hsl(45, 80%, 50%, 0.15) 0%, transparent 50%)",
    glowColor: "hsl(0, 65%, 50%)",
    secondaryGlow: "hsl(45, 85%, 55%)",
    pattern: "dots",
  },
};

// Pattern components
const PatternOverlay = ({ pattern }: { pattern?: string }) => {
  if (!pattern) return null;

  const getPatternStyle = () => {
    switch (pattern) {
      case "stars":
        return {
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.5), transparent),
            radial-gradient(2px 2px at 40% 70%, rgba(255, 255, 255, 0.4), transparent),
            radial-gradient(2px 2px at 60% 20%, rgba(255, 255, 255, 0.6), transparent),
            radial-gradient(2px 2px at 80% 50%, rgba(255, 255, 255, 0.3), transparent),
            radial-gradient(1px 1px at 10% 60%, rgba(255, 255, 255, 0.5), transparent),
            radial-gradient(1px 1px at 90% 80%, rgba(255, 255, 255, 0.4), transparent)
          `,
          backgroundSize: "200px 200px",
        };
      case "islamic":
        return {
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 0% 0%, rgba(255, 215, 0, 0.02) 0%, transparent 30%),
            radial-gradient(circle at 100% 100%, rgba(255, 215, 0, 0.02) 0%, transparent 30%)
          `,
          backgroundSize: "100px 100px, 150px 150px, 150px 150px",
        };
      case "festive":
        return {
          backgroundImage: `
            radial-gradient(3px 3px at 25% 25%, rgba(255, 255, 255, 0.15), transparent),
            radial-gradient(2px 2px at 75% 75%, rgba(255, 255, 255, 0.1), transparent),
            radial-gradient(2px 2px at 50% 10%, rgba(255, 215, 0, 0.1), transparent)
          `,
          backgroundSize: "80px 80px",
        };
      case "dots":
        return {
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        };
      default:
        return {};
    }
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none opacity-50"
      style={getPatternStyle()}
    />
  );
};

// Glow effect component
const GlowEffects = ({ config }: { config: EventBackgroundConfig }) => (
  <>
    {/* Primary glow */}
    <div
      className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
      style={{ background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)` }}
    />
    {/* Secondary glow */}
    {config.secondaryGlow && (
      <div
        className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${config.secondaryGlow}, transparent 70%)` }}
      />
    )}
  </>
);

// Loading skeleton component for background image
const BackgroundSkeleton = () => (
  <div className="absolute inset-0 overflow-hidden">
    <Skeleton className="absolute inset-0 w-full h-full bg-gradient-to-br from-muted/80 via-muted/60 to-muted/80" />
    {/* Animated shimmer effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    {/* Pulse glow effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent"
      animate={{
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
);

// Background image component with parallax, lazy loading, and caching
const ParallaxBackgroundImage = ({ 
  src, 
  alt, 
  onLoad,
  parallaxEnabled = true,
}: { 
  src: string; 
  alt: string; 
  onLoad?: () => void;
  parallaxEnabled?: boolean;
}) => {
  const [isLoaded, setIsLoaded] = useState(() => isImageCached(src));
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(() => 
    isImageCached(src) ? src : null
  );
  
  const { style: parallaxStyle } = useParallax({ 
    speed: 0.25, 
    maxOffset: 100,
    enabled: parallaxEnabled && isLoaded,
  });

  // Load image with cache
  useEffect(() => {
    // If already cached, use immediately
    if (isImageCached(src)) {
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
      return;
    }

    setIsLoaded(false);
    setHasError(false);
    
    preloadImage(src)
      .then(() => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
      });
  }, [src, onLoad]);

  return (
    <>
      {/* Loading skeleton - shown until image loads */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10"
          >
            <BackgroundSkeleton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual image */}
      {imageSrc && !hasError && (
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: isImageCached(src) ? 0.3 : 1.2, ease: "easeOut" }}
        >
          <motion.img
            src={imageSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              ...parallaxStyle,
              // Extend image to cover parallax movement
              top: "-10%",
              height: "120%",
            }}
            initial={{ scale: isImageCached(src) ? 1.05 : 1.1 }}
            animate={{ 
              scale: isLoaded ? 1.05 : 1.1,
            }}
            transition={{ 
              duration: isImageCached(src) ? 0.3 : 1.5, 
              ease: "easeOut"
            }}
          />
          {/* Overlay gradient for better text readability */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
          />
        </motion.div>
      )}
    </>
  );
};

// Hook to preload adjacent event images for faster switching
const usePreloadAdjacentImages = (currentTheme: EventThemeType) => {
  useEffect(() => {
    // Get all event themes with images
    const themes = Object.entries(EVENT_BACKGROUND_IMAGES)
      .filter(([_, src]) => src !== null)
      .map(([theme]) => theme as EventThemeType);
    
    const currentIndex = themes.indexOf(currentTheme);
    if (currentIndex === -1) return;

    // Preload next and previous themes
    const adjacentIndices = [
      (currentIndex + 1) % themes.length,
      (currentIndex - 1 + themes.length) % themes.length,
    ];

    adjacentIndices.forEach((index) => {
      const theme = themes[index];
      const src = EVENT_BACKGROUND_IMAGES[theme];
      if (src && !isImageCached(src)) {
        preloadImage(src).catch(() => {
          // Silent fail for preloading
        });
      }
    });
  }, [currentTheme]);
};

// Sequential video player - cycles through multiple videos
const VIDEO_SOURCES = ["/hero-video.mp4", "/hero-video-2.mp4", "/hero-video-3.mp4"];

const SequentialVideoPlayer = ({ onVideoLoaded }: { onVideoLoaded?: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCalledLoaded = useRef(false);

  const handleEnded = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % VIDEO_SOURCES.length);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    video.play().catch(console.error);
  }, [currentIndex]);

  const handleLoadedData = useCallback(() => {
    if (!hasCalledLoaded.current) {
      hasCalledLoaded.current = true;
      onVideoLoaded?.();
    }
  }, [onVideoLoaded]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
      onEnded={handleEnded}
      onLoadedData={handleLoadedData}
      key={currentIndex}
    >
      <source src={VIDEO_SOURCES[currentIndex]} type="video/mp4" />
    </video>
  );
};

interface EventHeroBackgroundProps {
  children?: React.ReactNode;
  showDefaultVideo?: boolean;
  onVideoLoaded?: () => void;
}

const EventHeroBackground = ({ children, showDefaultVideo = true, onVideoLoaded }: EventHeroBackgroundProps) => {
  const { currentEventTheme } = useEventTheme();
  const { videoQuality, shouldReduceAnimations, isLiteMode } = usePerformance();
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  // Preload adjacent event images for faster switching
  usePreloadAdjacentImages(currentEventTheme);

  // Check if we should show event UI instead of video
  const isEventActive = currentEventTheme !== "default";
  const eventConfig = isEventActive ? EVENT_BACKGROUNDS[currentEventTheme] : null;
  const eventBgImage = isEventActive ? EVENT_BACKGROUND_IMAGES[currentEventTheme] : null;

  // Reset image loaded state when theme/background changes
  useEffect(() => {
    setBgImageLoaded(false);
  }, [currentEventTheme, eventBgImage]);

  // Show video only when: default theme + video enabled + not in lite mode on mobile
  const shouldShowVideo = !isEventActive && showDefaultVideo && videoQuality !== "disabled";

  // Memoize animated elements to prevent re-renders
  const animatedElements = useMemo(() => {
    if (!eventConfig?.animatedElements || shouldReduceAnimations) return null;

    // Reduce animations in lite mode
    if (isLiteMode) {
      return null;
    }

    return eventConfig.animatedElements;
  }, [eventConfig, shouldReduceAnimations, isLiteMode]);

  // Smooth transition variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        staggerChildren: 0.15,
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {shouldShowVideo ? (
          /* Default mode: Show background videos in sequence */
          <motion.div
            key="video-bg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0"
          >
            <SequentialVideoPlayer onVideoLoaded={onVideoLoaded} />
            {/* Video overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
          </motion.div>
        ) : isEventActive && eventConfig ? (
          /* Event mode: Show full event visual UI */
          <motion.div
            key={`event-bg-${currentEventTheme}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Fallback gradient background (always behind image) */}
            <motion.div
              variants={childVariants}
              className="absolute inset-0 z-0"
              style={{ background: eventConfig.gradient }}
            />

            {/* Background Image with Parallax */}
            {eventBgImage && (
              <div className="absolute inset-0 z-[1]">
                <ParallaxBackgroundImage
                  src={eventBgImage}
                  alt={`${currentEventTheme} background`}
                  onLoad={() => setBgImageLoaded(true)}
                  parallaxEnabled={!shouldReduceAnimations && !isLiteMode}
                />
              </div>
            )}
            
            {/* Overlay gradient */}
            {eventConfig.overlayGradient && (
              <motion.div
                variants={childVariants}
                className="absolute inset-0 pointer-events-none"
                style={{ background: eventConfig.overlayGradient }}
              />
            )}
            
            {/* Pattern overlay */}
            <motion.div variants={childVariants}>
              <PatternOverlay pattern={eventConfig.pattern} />
            </motion.div>
            
            {/* Glow effects */}
            <motion.div variants={childVariants}>
              <GlowEffects config={eventConfig} />
            </motion.div>
            
            {/* Animated elements */}
            {animatedElements && (
              <Suspense fallback={null}>
                <motion.div 
                  variants={childVariants}
                  className="absolute inset-0 pointer-events-none"
                >
                  {animatedElements}
                </motion.div>
              </Suspense>
            )}
            
            {/* Final overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/30 pointer-events-none" />
          </motion.div>
        ) : (
          /* Fallback: Static background */
          <motion.div
            key="fallback-bg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-background"
          />
        )}
      </AnimatePresence>
      
      {children}
    </div>
  );
};

export default EventHeroBackground;
