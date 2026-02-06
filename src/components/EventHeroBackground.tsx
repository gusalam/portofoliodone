import { lazy, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEventTheme, EventThemeType } from "@/hooks/useEventTheme";
import { usePerformance } from "@/hooks/usePerformance";

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

interface EventHeroBackgroundProps {
  children?: React.ReactNode;
  showDefaultVideo?: boolean;
  onVideoLoaded?: () => void;
}

const EventHeroBackground = ({ children, showDefaultVideo = true, onVideoLoaded }: EventHeroBackgroundProps) => {
  const { currentEventTheme } = useEventTheme();
  const { videoQuality, shouldReduceAnimations, isLiteMode } = usePerformance();

  // Check if we should show event UI instead of video
  const isEventActive = currentEventTheme !== "default";
  const eventConfig = isEventActive ? EVENT_BACKGROUNDS[currentEventTheme] : null;

  // Show video only when: default theme + video enabled + not in lite mode on mobile
  const shouldShowVideo = !isEventActive && showDefaultVideo && videoQuality !== "disabled";

  // Memoize animated elements to prevent re-renders
  const animatedElements = useMemo(() => {
    if (!eventConfig?.animatedElements || shouldReduceAnimations) return null;
    
    // Reduce animations in lite mode
    if (isLiteMode) {
      // Return simplified version based on event
      return null;
    }
    
    return eventConfig.animatedElements;
  }, [eventConfig, shouldReduceAnimations, isLiteMode]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {shouldShowVideo ? (
          /* Default mode: Show background video */
          <motion.div
            key="video-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={onVideoLoaded}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            {/* Default video overlay */}
            <div 
              className="absolute inset-0"
              style={{ background: "rgba(0, 0, 0, 0.85)" }}
            />
          </motion.div>
        ) : eventConfig ? (
          /* Event mode: Show full themed background */
          <motion.div
            key={`event-bg-${currentEventTheme}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {/* Base gradient background */}
            <div 
              className="absolute inset-0"
              style={{ background: eventConfig.gradient }}
            />
            
            {/* Overlay gradient for depth */}
            {eventConfig.overlayGradient && (
              <div 
                className="absolute inset-0"
                style={{ background: eventConfig.overlayGradient }}
              />
            )}
            
            {/* Pattern overlay */}
            <PatternOverlay pattern={eventConfig.pattern} />
            
            {/* Glow effects */}
            <GlowEffects config={eventConfig} />
            
            {/* Animated elements */}
            {animatedElements && (
              <Suspense fallback={null}>
                <div className="absolute inset-0 pointer-events-none">
                  {animatedElements}
                </div>
              </Suspense>
            )}
          </motion.div>
        ) : (
          /* Fallback: Solid background */
          <motion.div
            key="fallback-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background"
          />
        )}
      </AnimatePresence>
      
      {children}
    </div>
  );
};

export default EventHeroBackground;
