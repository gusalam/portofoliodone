import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX, CloudRain, Snowflake, CloudLightning } from "lucide-react";
import { useWeather, WeatherEffect } from "@/hooks/useWeather";
import RainEffect from "./RainEffect";
import SnowEffect from "./SnowEffect";
import LightningEffect from "./LightningEffect";

const WEATHER_LABELS: Record<WeatherEffect, string> = {
  clear: "",
  rain: "Hujan",
  snow: "Salju",
  thunderstorm: "Badai Petir",
};

const WEATHER_ICONS: Record<WeatherEffect, typeof CloudRain | null> = {
  clear: null,
  rain: CloudRain,
  snow: Snowflake,
  thunderstorm: CloudLightning,
};

const WeatherEffects = () => {
  const { effect, intensity } = useWeather();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const isActive = effect !== "clear";
  const Icon = WEATHER_ICONS[effect];

  return (
    <>
      <AnimatePresence>
        {effect === "rain" && (
          <RainEffect intensity={intensity} soundEnabled={soundEnabled} />
        )}
        {effect === "snow" && <SnowEffect intensity={intensity} />}
        {effect === "thunderstorm" && (
          <>
            <RainEffect intensity={intensity} soundEnabled={soundEnabled} />
            <LightningEffect />
          </>
        )}
      </AnimatePresence>

      {/* Weather indicator + sound toggle */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="fixed bottom-20 left-4 z-[9999] flex items-center gap-2"
        >
          {/* Weather badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground">
            {Icon && <Icon className="w-3 h-3" />}
            <span>{WEATHER_LABELS[effect]}</span>
            <span className="opacity-60 capitalize">({intensity})</span>
          </div>

          {/* Sound toggle - only for rain/thunderstorm */}
          {(effect === "rain" || effect === "thunderstorm") && (
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
              title={soundEnabled ? "Matikan suara" : "Nyalakan suara"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          )}
        </motion.div>
      )}
    </>
  );
};

export default WeatherEffects;
