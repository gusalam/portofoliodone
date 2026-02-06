import { lazy, Suspense, useMemo } from "react";
import { useEventTheme, EventThemeType } from "@/hooks/useEventTheme";
import { usePerformance } from "@/hooks/usePerformance";

// Lazy load ornaments for performance
const ConfettiAnimation = lazy(() => import("./ConfettiAnimation"));
const LanternOrnaments = lazy(() => import("./LanternOrnaments"));
const MoonGlow = lazy(() => import("./MoonGlow"));
const FireworksAnimation = lazy(() => import("./FireworksAnimation"));
const FlagAnimation = lazy(() => import("./FlagAnimation"));
const KetupatOrnaments = lazy(() => import("./KetupatOrnaments"));
const StarsBackground = lazy(() => import("./StarsBackground"));
const NatureOrnaments = lazy(() => import("./NatureOrnaments"));
const MosqueAnimation = lazy(() => import("./MosqueAnimation"));
const HeartAnimation = lazy(() => import("./HeartAnimation"));
const PumpkinAnimation = lazy(() => import("./PumpkinAnimation"));
const SnowflakeAnimation = lazy(() => import("./SnowflakeAnimation"));
const ChristmasOrnaments = lazy(() => import("./ChristmasOrnaments"));

// Configuration for which ornaments to show for each theme
const THEME_ORNAMENTS: Record<EventThemeType, React.ReactNode> = {
  default: null,
  
  // Islamic Events
  ramadan: (
    <>
      <MosqueAnimation position="center" opacity={0.12} />
      <LanternOrnaments count={8} />
      <MoonGlow position="top-right" size={100} />
      <StarsBackground count={40} />
    </>
  ),
  "eid-fitr": (
    <>
      <KetupatOrnaments count={8} />
      <ConfettiAnimation colors={["#22C55E", "#FFD700", "#FFFFFF"]} count={40} />
      <LanternOrnaments count={5} />
    </>
  ),
  "eid-adha": (
    <>
      <MosqueAnimation position="right" opacity={0.1} />
      <LanternOrnaments count={6} />
      <MoonGlow position="top-right" size={80} />
    </>
  ),
  "maulid-nabi": (
    <>
      <MosqueAnimation position="center" opacity={0.15} />
      <LanternOrnaments count={10} />
      <MoonGlow position="top-right" size={90} />
      <StarsBackground count={35} />
    </>
  ),
  "isra-miraj": (
    <>
      <MosqueAnimation position="center" opacity={0.12} />
      <StarsBackground count={60} />
      <MoonGlow position="top-right" size={120} />
    </>
  ),
  "islamic-new-year": (
    <>
      <MosqueAnimation position="left" opacity={0.1} />
      <MoonGlow position="top-right" size={100} />
      <StarsBackground count={45} />
    </>
  ),
  
  // Indonesian National Events
  "independence-day": (
    <>
      <FlagAnimation position="both" />
      <ConfettiAnimation colors={["#EF4444", "#FFFFFF"]} count={60} />
    </>
  ),
  "heroes-day": (
    <>
      <FlagAnimation position="left" />
    </>
  ),
  "kartini-day": (
    <>
      <NatureOrnaments count={12} />
    </>
  ),
  "youth-pledge": (
    <>
      <FlagAnimation position="right" />
      <ConfettiAnimation colors={["#EF4444", "#FFD700", "#FFFFFF"]} count={30} />
    </>
  ),
  "education-day": null,
  "pancasila-day": (
    <>
      <FlagAnimation position="left" />
      <StarsBackground count={25} />
    </>
  ),
  "batik-day": (
    <>
      <NatureOrnaments count={15} />
    </>
  ),
  
  // Global Events
  "new-year": (
    <>
      <FireworksAnimation colors={["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7"]} />
      <ConfettiAnimation colors={["#FFD700", "#C0C0C0", "#FFFFFF"]} count={50} />
      <StarsBackground count={30} />
    </>
  ),
  "valentine": (
    <>
      <HeartAnimation count={20} colors={["#FF6B9D", "#FF4081", "#E91E63", "#FF1744"]} />
    </>
  ),
  "earth-day": (
    <>
      <NatureOrnaments count={25} />
    </>
  ),
  "labor-day": null,
  "mothers-day": (
    <>
      <HeartAnimation count={15} colors={["#FF69B4", "#FFB6C1", "#FFC0CB"]} />
      <NatureOrnaments count={10} />
    </>
  ),
  "fathers-day": (
    <>
      <StarsBackground count={20} />
    </>
  ),
  "environment-day": (
    <>
      <NatureOrnaments count={20} />
    </>
  ),
  "halloween": (
    <>
      <PumpkinAnimation count={10} />
    </>
  ),
  "christmas": (
    <>
      <SnowflakeAnimation count={50} />
      <ChristmasOrnaments />
    </>
  ),
};

// Performance-adjusted ornament counts
const getLiteOrnaments = (theme: EventThemeType): React.ReactNode => {
  switch (theme) {
    case "ramadan":
      return <MoonGlow position="top-right" size={80} />;
    case "eid-fitr":
      return <ConfettiAnimation colors={["#22C55E", "#FFD700"]} count={15} />;
    case "new-year":
      return <StarsBackground count={15} />;
    case "christmas":
      return <SnowflakeAnimation count={20} />;
    case "independence-day":
      return <FlagAnimation position="left" />;
    case "halloween":
      return <PumpkinAnimation count={5} />;
    case "valentine":
      return <HeartAnimation count={10} colors={["#FF6B9D", "#FF4081"]} />;
    default:
      return null;
  }
};

const EventOrnaments = () => {
  const { currentEventTheme } = useEventTheme();
  const { isLiteMode, shouldReduceAnimations, particleCount } = usePerformance();

  // Get ornaments based on performance mode
  const ornaments = useMemo(() => {
    if (shouldReduceAnimations) {
      return null;
    }

    if (isLiteMode) {
      return getLiteOrnaments(currentEventTheme);
    }

    return THEME_ORNAMENTS[currentEventTheme];
  }, [currentEventTheme, isLiteMode, shouldReduceAnimations]);

  if (!ornaments) return null;

  return (
    <Suspense fallback={null}>
      <div className="event-ornaments-container">
        {ornaments}
      </div>
    </Suspense>
  );
};

export default EventOrnaments;
