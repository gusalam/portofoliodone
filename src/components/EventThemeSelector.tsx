import { Check, Calendar, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useEventTheme, EventThemeType, EVENT_THEMES } from "@/hooks/useEventTheme";

// Color mapping for event themes
const eventThemeColors: Record<EventThemeType, string> = {
  default: "bg-gradient-to-r from-primary to-secondary",
  ramadan: "bg-gradient-to-r from-emerald-600 to-amber-500",
  "eid-fitr": "bg-gradient-to-r from-green-500 to-yellow-400",
  "eid-adha": "bg-gradient-to-r from-amber-600 to-orange-500",
  "maulid-nabi": "bg-gradient-to-r from-emerald-500 to-yellow-500",
  "isra-miraj": "bg-gradient-to-r from-blue-800 to-amber-400",
  "islamic-new-year": "bg-gradient-to-r from-amber-600 to-amber-400",
  "independence-day": "bg-gradient-to-r from-red-600 to-white",
  "heroes-day": "bg-gradient-to-r from-red-800 to-amber-600",
  "kartini-day": "bg-gradient-to-r from-amber-500 to-pink-500",
  "youth-pledge": "bg-gradient-to-r from-red-600 to-yellow-500",
  "education-day": "bg-gradient-to-r from-blue-500 to-teal-400",
  "pancasila-day": "bg-gradient-to-r from-red-600 to-amber-400",
  "batik-day": "bg-gradient-to-r from-amber-700 to-amber-500",
  "new-year": "bg-gradient-to-r from-amber-400 to-purple-500",
  "labor-day": "bg-gradient-to-r from-red-600 to-yellow-500",
  "environment-day": "bg-gradient-to-r from-green-500 to-lime-400",
  "valentine": "bg-gradient-to-r from-pink-500 to-red-500",
  "halloween": "bg-gradient-to-r from-orange-500 to-purple-700",
  "christmas": "bg-gradient-to-r from-red-600 to-green-600",
  "earth-day": "bg-gradient-to-r from-blue-500 to-green-500",
  "mothers-day": "bg-gradient-to-r from-pink-400 to-rose-500",
  "fathers-day": "bg-gradient-to-r from-blue-600 to-sky-400",
};

// Group events by category
const islamicEvents = EVENT_THEMES.filter((e) => e.isIslamicEvent);
const nationalEvents = EVENT_THEMES.filter(
  (e) => ["independence-day", "heroes-day", "kartini-day", "youth-pledge", "education-day", "pancasila-day", "batik-day"].includes(e.id)
);
const globalEvents = EVENT_THEMES.filter(
  (e) => ["new-year", "labor-day", "environment-day", "valentine", "halloween", "christmas", "earth-day", "mothers-day", "fathers-day"].includes(e.id)
);

const EventThemeSelector = () => {
  const { currentEventTheme, isAutoMode, setManualEventTheme, detectedEvent } = useEventTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden group box-glow-hover"
          aria-label="Select event theme"
        >
          <Sparkles className="h-5 w-5" />
          <span
            className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${eventThemeColors[currentEventTheme]} ring-1 ring-background`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Event Theme
          </span>
          {isAutoMode && (
            <span className="text-xs text-muted-foreground font-normal">
              (Auto)
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Auto Mode Option */}
        <DropdownMenuItem
          onClick={() => setManualEventTheme(null)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <div>
              <span>Otomatis</span>
              {detectedEvent !== "default" && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({EVENT_THEMES.find((e) => e.id === detectedEvent)?.nameId})
                </span>
              )}
            </div>
          </div>
          {isAutoMode && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Islamic Events */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Event Islam
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {islamicEvents.map((event) => (
            <DropdownMenuItem
              key={event.id}
              onClick={() => setManualEventTheme(event.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${eventThemeColors[event.id]}`}
                />
                <span className="text-sm">{event.nameId}</span>
              </div>
              {!isAutoMode && currentEventTheme === event.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* National Events */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Event Nasional
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {nationalEvents.map((event) => (
            <DropdownMenuItem
              key={event.id}
              onClick={() => setManualEventTheme(event.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${eventThemeColors[event.id]}`}
                />
                <span className="text-sm">{event.nameId}</span>
              </div>
              {!isAutoMode && currentEventTheme === event.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Global Events */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Event Global
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {globalEvents.map((event) => (
            <DropdownMenuItem
              key={event.id}
              onClick={() => setManualEventTheme(event.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${eventThemeColors[event.id]}`}
                />
                <span className="text-sm">{event.nameId}</span>
              </div>
              {!isAutoMode && currentEventTheme === event.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Default */}
        <DropdownMenuItem
          onClick={() => setManualEventTheme("default")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${eventThemeColors["default"]}`}
            />
            <span className="text-sm">Default (Harian)</span>
          </div>
          {!isAutoMode && currentEventTheme === "default" && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventThemeSelector;
