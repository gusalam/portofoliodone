import { useState, useEffect, useCallback, useRef } from "react";

export type WeatherIntensity = "none" | "light" | "moderate" | "heavy";

export type WeatherEffect = "clear" | "rain" | "snow" | "thunderstorm" | "fog" | "wind";

interface WeatherState {
  effect: WeatherEffect;
  intensity: WeatherIntensity;
  weatherCode: number | null;
  temperature: number | null;
  loading: boolean;
  error: string | null;
}

// Open-Meteo WMO Weather codes mapping
const getWeatherEffect = (code: number): { effect: WeatherEffect; intensity: WeatherIntensity } => {
  // Fog / Mist (codes 45, 48)
  if (code === 45) return { effect: "fog", intensity: "moderate" };
  if (code === 48) return { effect: "fog", intensity: "heavy" }; // depositing rime fog

  // Snow
  if (code === 71 || code === 77) return { effect: "snow", intensity: "light" };
  if (code === 73 || code === 85) return { effect: "snow", intensity: "moderate" };
  if (code === 75 || code === 86) return { effect: "snow", intensity: "heavy" };
  if (code === 56) return { effect: "snow", intensity: "light" };
  if (code === 57) return { effect: "snow", intensity: "moderate" };

  // Thunderstorm
  if (code === 95) return { effect: "thunderstorm", intensity: "heavy" };
  if (code === 96) return { effect: "thunderstorm", intensity: "heavy" };
  if (code === 99) return { effect: "thunderstorm", intensity: "heavy" };

  // Rain
  if (code === 51) return { effect: "rain", intensity: "light" };
  if (code === 53) return { effect: "rain", intensity: "moderate" };
  if (code === 55) return { effect: "rain", intensity: "heavy" };
  if (code === 61) return { effect: "rain", intensity: "light" };
  if (code === 63) return { effect: "rain", intensity: "moderate" };
  if (code === 65) return { effect: "rain", intensity: "heavy" };
  if (code === 66) return { effect: "rain", intensity: "light" };
  if (code === 67) return { effect: "rain", intensity: "heavy" };
  if (code === 80) return { effect: "rain", intensity: "light" };
  if (code === 81) return { effect: "rain", intensity: "moderate" };
  if (code === 82) return { effect: "rain", intensity: "heavy" };

  return { effect: "clear", intensity: "none" };
};

const POLL_INTERVAL = 10 * 60 * 1000;

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherState>({
    effect: "clear",
    intensity: "none",
    weatherCode: null,
    temperature: null,
    loading: true,
    error: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&windspeed_unit=kmh`
      );
      if (!res.ok) throw new Error("Weather API error");
      const data = await res.json();
      const code = data.current_weather?.weathercode as number;
      const temp = data.current_weather?.temperature as number;
      const windSpeed = data.current_weather?.windspeed as number;

      let { effect, intensity } = getWeatherEffect(code);

      // If clear but windy (>30 km/h), show wind effect
      if (effect === "clear" && windSpeed > 30) {
        effect = "wind";
        intensity = windSpeed > 60 ? "heavy" : windSpeed > 45 ? "moderate" : "light";
      }

      setWeather({
        effect,
        intensity,
        weatherCode: code,
        temperature: temp,
        loading: false,
        error: null,
      });
    } catch (err) {
      setWeather((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  }, []);

  const getLocationAndFetch = useCallback(() => {
    if (!navigator.geolocation) {
      fetchWeather(-6.2088, 106.8456);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(-6.2088, 106.8456),
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchWeather]);

  useEffect(() => {
    getLocationAndFetch();
    intervalRef.current = setInterval(getLocationAndFetch, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [getLocationAndFetch]);

  return weather;
};
