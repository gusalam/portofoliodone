import { useState, useEffect, useRef, useCallback } from "react";
import { Check, Calendar, RotateCcw, Sparkles, Play, Square } from "lucide-react";
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

// Get all theme IDs for cycling (excluding default, put it at the end)
const allThemeIds = EVENT_THEMES.filter((e) => e.id !== "default").map((e) => e.id);

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
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const savedThemeRef = useRef<EventThemeType | null>(null);
  const wasAutoModeRef = useRef<boolean>(false);

  const stopPreview = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setIsPreviewMode(false);
    setCountdown(3);
    
    // Restore previous theme
    if (wasAutoModeRef.current) {
      setManualEventTheme(null);
    } else if (savedThemeRef.current !== null) {
      setManualEventTheme(savedThemeRef.current);
    }
    savedThemeRef.current = null;
    wasAutoModeRef.current = false;
  }, [setManualEventTheme]);

  const startPreview = useCallback(() => {
    // Save current state
    wasAutoModeRef.current = isAutoMode;
    savedThemeRef.current = currentEventTheme;
    
    setIsPreviewMode(true);
    setPreviewIndex(0);
    setCountdown(3);
    
    // Apply first theme
    setManualEventTheme(allThemeIds[0]);
    
    // Start countdown timer
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 3 : prev - 1));
    }, 1000);
    
    // Start theme cycling
    intervalRef.current = setInterval(() => {
      setPreviewIndex((prev) => {
        const nextIndex = (prev + 1) % allThemeIds.length;
        setManualEventTheme(allThemeIds[nextIndex]);
        return nextIndex;
      });
    }, 3000);
  }, [currentEventTheme, isAutoMode, setManualEventTheme]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const currentPreviewTheme = isPreviewMode ? allThemeIds[previewIndex] : null;
  const currentPreviewThemeInfo = currentPreviewTheme
    ? EVENT_THEMES.find((e) => e.id === currentPreviewTheme)
    : null;

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
          {isPreviewMode && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Event Theme
          </span>
          {isAutoMode && !isPreviewMode && (
            <span className="text-xs text-muted-foreground font-normal">
              (Auto)
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Preview Mode Button */}
        {isPreviewMode ? (
          <div className="px-2 py-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${eventThemeColors[currentPreviewTheme || "default"]} animate-pulse`}
                />
                <span className="text-sm font-medium">
                  {currentPreviewThemeInfo?.nameId || "Loading..."}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {previewIndex + 1}/{allThemeIds.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-linear"
                  style={{ width: `${((3 - countdown + 1) / 3) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-4">{countdown}s</span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                stopPreview();
              }}
            >
              <Square className="h-3 w-3 mr-2" />
              Stop Preview
            </Button>
          </div>
        ) : (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              startPreview();
            }}
            className="flex items-center gap-2 cursor-pointer bg-primary/10 hover:bg-primary/20"
          >
            <Play className="h-4 w-4 text-primary" />
            <div>
              <span className="font-medium">Preview Semua Theme</span>
              <span className="text-xs text-muted-foreground block">
                Auto-cycle setiap 3 detik
              </span>
            </div>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Auto Mode Option */}
        <DropdownMenuItem
          onClick={() => {
            if (isPreviewMode) stopPreview();
            setManualEventTheme(null);
          }}
          className="flex items-center justify-between cursor-pointer"
          disabled={isPreviewMode}
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
          {isAutoMode && !isPreviewMode && <Check className="h-4 w-4 text-primary" />}
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
              onClick={() => {
                if (isPreviewMode) stopPreview();
                setManualEventTheme(event.id);
              }}
              className="flex items-center justify-between cursor-pointer"
              disabled={isPreviewMode}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${eventThemeColors[event.id]}`}
                />
                <span className="text-sm">{event.nameId}</span>
              </div>
              {!isAutoMode && !isPreviewMode && currentEventTheme === event.id && (
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
              onClick={() => {
                if (isPreviewMode) stopPreview();
                setManualEventTheme(event.id);
              }}
              className="flex items-center justify-between cursor-pointer"
              disabled={isPreviewMode}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${eventThemeColors[event.id]}`}
                />
                <span className="text-sm">{event.nameId}</span>
              </div>
              {!isAutoMode && !isPreviewMode && currentEventTheme === event.id && (
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
              onClick={() => {
                if (isPreviewMode) stopPreview();
                setManualEventTheme(event.id);
              }}
              className="flex items-center justify-between cursor-pointer"
              disabled={isPreviewMode}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${eventThemeColors[event.id]}`}
                />
                <span className="text-sm">{event.nameId}</span>
              </div>
              {!isAutoMode && !isPreviewMode && currentEventTheme === event.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Default */}
        <DropdownMenuItem
          onClick={() => {
            if (isPreviewMode) stopPreview();
            setManualEventTheme("default");
          }}
          className="flex items-center justify-between cursor-pointer"
          disabled={isPreviewMode}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${eventThemeColors["default"]}`}
            />
            <span className="text-sm">Default (Harian)</span>
          </div>
          {!isAutoMode && !isPreviewMode && currentEventTheme === "default" && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventThemeSelector;
