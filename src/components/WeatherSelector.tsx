import {
  CloudRain, Snowflake, CloudLightning, Sun, CloudFog, Wind, Cloud, Check, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWeatherSettings } from "@/hooks/useWeatherSettings";
import { WeatherEffect, WeatherIntensity } from "@/hooks/useWeather";

const WEATHER_OPTIONS: { effect: WeatherEffect; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { effect: "clear", icon: Sun, label: "Cerah" },
  { effect: "rain", icon: CloudRain, label: "Hujan" },
  { effect: "snow", icon: Snowflake, label: "Salju" },
  { effect: "thunderstorm", icon: CloudLightning, label: "Badai Petir" },
  { effect: "fog", icon: CloudFog, label: "Kabut" },
  { effect: "wind", icon: Wind, label: "Angin" },
];

const INTENSITY_OPTIONS: { value: WeatherIntensity; label: string }[] = [
  { value: "light", label: "Ringan" },
  { value: "moderate", label: "Sedang" },
  { value: "heavy", label: "Lebat" },
];

const WeatherSelector = () => {
  const {
    activeEffect, activeIntensity, isManual,
    setEffect, setIntensity, resetToAuto,
  } = useWeatherSettings();

  const activeOption = WEATHER_OPTIONS.find((o) => o.effect === activeEffect);
  const ActiveIcon = activeOption?.icon ?? Cloud;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden group box-glow-hover"
          aria-label="Weather effects"
        >
          <ActiveIcon className="h-5 w-5" />
          {isManual && (
            <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-primary ring-1 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Efek Cuaca</span>
          {!isManual && (
            <span className="text-xs text-muted-foreground font-normal">(Otomatis)</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Auto mode */}
        <DropdownMenuItem
          onClick={resetToAuto}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <span>Otomatis</span>
          </div>
          {!isManual && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Effect options */}
        {WEATHER_OPTIONS.map(({ effect, icon: Icon, label }) => (
          <DropdownMenuItem
            key={effect}
            onClick={() => setEffect(effect)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
            {activeEffect === effect && isManual && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        {/* Intensity - only when not clear */}
        {activeEffect !== "clear" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">Intensitas</DropdownMenuLabel>
            {INTENSITY_OPTIONS.map(({ value, label }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => setIntensity(value)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{label}</span>
                {activeIntensity === value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WeatherSelector;
