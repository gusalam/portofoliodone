import { useState, useEffect, useCallback, useRef } from "react";

export type RainIntensity = "none" | "light" | "moderate" | "heavy";

interface WeatherState {
  isRaining: boolean;
  intensity: RainIntensity;
  weatherCode: number | null;
  temperature: number | null;
  loading: boolean;
  error: string | null;
}

// Open-Meteo WMO Weather codes for rain conditions
const RAIN_CODES: Record<number, RainIntensity> = {
  51: "light",    // Drizzle: Light
  53: "moderate", // Drizzle: Moderate
  55: "heavy",    // Drizzle: Dense
  56: "light",    // Freezing Drizzle: Light
  57: "moderate", // Freezing Drizzle: Dense
  61: "light",    // Rain: Slight
  63: "moderate", // Rain: Moderate
  65: "heavy",    // Rain: Heavy
  66: "light",    // Freezing Rain: Light
  67: "heavy",    // Freezing Rain: Heavy
  80: "light",    // Rain showers: Slight
  81: "moderate", // Rain showers: Moderate
  82: "heavy",    // Rain showers: Violent
  95: "heavy",    // Thunderstorm
  96: "heavy",    // Thunderstorm with slight hail
  99: "heavy",    // Thunderstorm with heavy hail
};

const POLL_INTERVAL = 10 * 60 * 1000; // 10 minutes

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherState>({
    isRaining: false,
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
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      if (!res.ok) throw new Error("Weather API error");
      const data = await res.json();
      const code = data.current_weather?.weathercode as number;
      const temp = data.current_weather?.temperature as number;
      const intensity = RAIN_CODES[code] || "none";

      setWeather({
        isRaining: intensity !== "none",
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
      // Fallback: Jakarta coordinates
      fetchWeather(-6.2088, 106.8456);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
        // On denial, fallback to Jakarta
        fetchWeather(-6.2088, 106.8456);
      },
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
