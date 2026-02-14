import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useWeatherSettings } from "@/hooks/useWeatherSettings";
import RainEffect from "./RainEffect";
import SnowEffect from "./SnowEffect";
import LightningEffect from "./LightningEffect";
import FogEffect from "./FogEffect";
import WindEffect from "./WindEffect";

const WeatherEffects = () => {
  const { activeEffect, activeIntensity, soundEnabled, toggleSound } = useWeatherSettings();
  const hasSound = activeEffect === "rain" || activeEffect === "thunderstorm";

  return (
    <>
      <AnimatePresence>
        {activeEffect === "rain" && (
          <RainEffect intensity={activeIntensity} soundEnabled={soundEnabled} />
        )}
        {activeEffect === "snow" && <SnowEffect intensity={activeIntensity} />}
        {activeEffect === "thunderstorm" && (
          <>
            <RainEffect intensity={activeIntensity} soundEnabled={soundEnabled} />
            <LightningEffect />
          </>
        )}
        {activeEffect === "fog" && <FogEffect intensity={activeIntensity} />}
        {activeEffect === "wind" && <WindEffect intensity={activeIntensity} />}
      </AnimatePresence>

      {/* Sound toggle - only floating element remaining, minimal */}
      {hasSound && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={toggleSound}
          className="fixed bottom-20 left-4 z-[9999] p-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
          title={soundEnabled ? "Matikan suara" : "Nyalakan suara"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </motion.button>
      )}
    </>
  );
};

export default WeatherEffects;
