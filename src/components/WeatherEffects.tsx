import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Volume2, VolumeX, CloudRain, Snowflake, CloudLightning,
  Settings, Sun, X, Cloud,
} from "lucide-react";
import { useWeather, WeatherEffect, WeatherIntensity } from "@/hooks/useWeather";
import RainEffect from "./RainEffect";
import SnowEffect from "./SnowEffect";
import LightningEffect from "./LightningEffect";

const WEATHER_LABELS: Record<WeatherEffect, string> = {
  clear: "Cerah",
  rain: "Hujan",
  snow: "Salju",
  thunderstorm: "Badai Petir",
};

const WEATHER_OPTIONS: { effect: WeatherEffect; icon: typeof CloudRain; label: string }[] = [
  { effect: "clear", icon: Sun, label: "Cerah" },
  { effect: "rain", icon: CloudRain, label: "Hujan" },
  { effect: "snow", icon: Snowflake, label: "Salju" },
  { effect: "thunderstorm", icon: CloudLightning, label: "Badai Petir" },
];

const INTENSITY_OPTIONS: { value: WeatherIntensity; label: string }[] = [
  { value: "light", label: "Ringan" },
  { value: "moderate", label: "Sedang" },
  { value: "heavy", label: "Lebat" },
];

const WeatherEffects = () => {
  const weather = useWeather();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [manualOverride, setManualOverride] = useState<{
    effect: WeatherEffect;
    intensity: WeatherIntensity;
  } | null>(null);

  const activeEffect = manualOverride?.effect ?? weather.effect;
  const activeIntensity = manualOverride?.intensity ?? weather.intensity;
  const isActive = activeEffect !== "clear";
  const ActiveIcon = WEATHER_OPTIONS.find((o) => o.effect === activeEffect)?.icon ?? Cloud;

  const handleSelectEffect = (effect: WeatherEffect) => {
    if (effect === "clear") {
      setManualOverride({ effect: "clear", intensity: "none" });
    } else {
      setManualOverride({
        effect,
        intensity: manualOverride?.intensity && manualOverride.intensity !== "none"
          ? manualOverride.intensity
          : "moderate",
      });
    }
  };

  const handleSelectIntensity = (intensity: WeatherIntensity) => {
    if (manualOverride) {
      setManualOverride({ ...manualOverride, intensity });
    }
  };

  const handleResetToAuto = () => {
    setManualOverride(null);
  };

  return (
    <>
      {/* Render effects */}
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
      </AnimatePresence>

      {/* Bottom-left controls */}
      <div className="fixed bottom-20 left-4 z-[9999] flex flex-col items-start gap-2">
        {/* Settings panel */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-3 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 shadow-lg min-w-[200px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">Efek Cuaca</span>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>

              {/* Effect options */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {WEATHER_OPTIONS.map(({ effect, icon: Icon, label }) => (
                  <button
                    key={effect}
                    onClick={() => handleSelectEffect(effect)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      activeEffect === effect
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Intensity slider - only when not clear */}
              {activeEffect !== "clear" && (
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground mb-1 block">Intensitas</span>
                  <div className="flex gap-1">
                    {INTENSITY_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => handleSelectIntensity(value)}
                        className={`flex-1 px-2 py-1 rounded-md text-xs transition-colors ${
                          activeIntensity === value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto/manual indicator */}
              <button
                onClick={handleResetToAuto}
                className={`w-full text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                  manualOverride === null
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {manualOverride === null ? "✓ Mode Otomatis" : "Kembali ke Otomatis"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="flex items-center gap-2">
          {/* Weather badge */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground"
            >
              <ActiveIcon className="w-3 h-3" />
              <span>{WEATHER_LABELS[activeEffect]}</span>
              <span className="opacity-60 capitalize">({activeIntensity})</span>
              {manualOverride !== null && (
                <span className="text-primary opacity-80">• Manual</span>
              )}
            </motion.div>
          )}

          {/* Sound toggle */}
          {(activeEffect === "rain" || activeEffect === "thunderstorm") && (
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
              title={soundEnabled ? "Matikan suara" : "Nyalakan suara"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={() => setSettingsOpen((prev) => !prev)}
            className={`p-2 rounded-full backdrop-blur-sm border border-border/50 transition-colors ${
              settingsOpen
                ? "bg-primary text-primary-foreground"
                : "bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background/80"
            }`}
            title="Pengaturan Cuaca"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};

export default WeatherEffects;
