import { createContext, useContext, useState, ReactNode } from "react";
import { WeatherEffect, WeatherIntensity, useWeather } from "./useWeather";

interface WeatherSettingsContextType {
  activeEffect: WeatherEffect;
  activeIntensity: WeatherIntensity;
  isManual: boolean;
  soundEnabled: boolean;
  setEffect: (effect: WeatherEffect) => void;
  setIntensity: (intensity: WeatherIntensity) => void;
  resetToAuto: () => void;
  toggleSound: () => void;
}

const WeatherSettingsContext = createContext<WeatherSettingsContextType | undefined>(undefined);

export const WeatherSettingsProvider = ({ children }: { children: ReactNode }) => {
  const weather = useWeather();
  const [manualOverride, setManualOverride] = useState<{
    effect: WeatherEffect;
    intensity: WeatherIntensity;
  } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const activeEffect = manualOverride?.effect ?? weather.effect;
  const activeIntensity = manualOverride?.intensity ?? weather.intensity;

  const setEffect = (effect: WeatherEffect) => {
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

  const setIntensity = (intensity: WeatherIntensity) => {
    if (manualOverride) {
      setManualOverride({ ...manualOverride, intensity });
    } else {
      setManualOverride({ effect: weather.effect, intensity });
    }
  };

  const resetToAuto = () => setManualOverride(null);
  const toggleSound = () => setSoundEnabled((p) => !p);

  return (
    <WeatherSettingsContext.Provider
      value={{
        activeEffect,
        activeIntensity,
        isManual: manualOverride !== null,
        soundEnabled,
        setEffect,
        setIntensity,
        resetToAuto,
        toggleSound,
      }}
    >
      {children}
    </WeatherSettingsContext.Provider>
  );
};

export const useWeatherSettings = () => {
  const ctx = useContext(WeatherSettingsContext);
  if (!ctx) throw new Error("useWeatherSettings must be used within WeatherSettingsProvider");
  return ctx;
};
