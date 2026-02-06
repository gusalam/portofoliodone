import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { EventThemeType } from "./useEventTheme";
import { usePerformance } from "./usePerformance";

// Video configuration per event
interface EventVideoConfig {
  src?: string;
  fallbackSrc?: string; // Fallback if main video fails
  overlay?: string; // CSS overlay color/gradient
  blendMode?: string;
}

// Default video path
const DEFAULT_VIDEO = "/hero-video.mp4";

// Event-specific video configurations
const EVENT_VIDEO_CONFIG: Partial<Record<EventThemeType, EventVideoConfig>> = {
  "ramadan": {
    src: "/video/event/ramadan-bg.mp4",
    fallbackSrc: DEFAULT_VIDEO,
    overlay: "linear-gradient(to bottom, rgba(5, 46, 22, 0.9), rgba(20, 83, 45, 0.85))",
  },
  "eid-fitr": {
    src: "/video/event/eid-celebration.mp4",
    fallbackSrc: DEFAULT_VIDEO,
    overlay: "linear-gradient(to bottom, rgba(22, 101, 52, 0.85), rgba(101, 163, 13, 0.8))",
  },
  "new-year": {
    src: "/video/event/new-year-fireworks.mp4",
    fallbackSrc: DEFAULT_VIDEO,
    overlay: "linear-gradient(to bottom, rgba(30, 27, 75, 0.9), rgba(88, 28, 135, 0.85))",
  },
  "independence-day": {
    src: "/video/event/independence-bg.mp4",
    fallbackSrc: DEFAULT_VIDEO,
    overlay: "linear-gradient(to bottom, rgba(127, 29, 29, 0.85), rgba(255, 255, 255, 0.7))",
  },
  "christmas": {
    src: "/video/event/christmas-snow.mp4",
    fallbackSrc: DEFAULT_VIDEO,
    overlay: "linear-gradient(to bottom, rgba(21, 94, 117, 0.85), rgba(22, 101, 52, 0.85))",
  },
  "halloween": {
    src: "/video/event/halloween-fog.mp4",
    fallbackSrc: DEFAULT_VIDEO,
    overlay: "linear-gradient(to bottom, rgba(30, 27, 30, 0.95), rgba(88, 28, 60, 0.9))",
  },
  "valentine": {
    src: "/video/event/valentine-hearts.mp4",
    fallbackSrc: DEFAULT_VIDEO,
    overlay: "linear-gradient(to bottom, rgba(136, 19, 55, 0.85), rgba(190, 18, 60, 0.8))",
  },
};

// Default video config
const DEFAULT_VIDEO_CONFIG: EventVideoConfig = {
  src: DEFAULT_VIDEO,
  overlay: "rgba(0, 0, 0, 0.9)",
};

interface VideoBackgroundContextType {
  currentVideoSrc: string;
  overlayStyle: string;
  isLoading: boolean;
  hasError: boolean;
  isDisabled: boolean;
  retryLoad: () => void;
}

const VideoBackgroundContext = createContext<VideoBackgroundContextType | undefined>(undefined);

export const VideoBackgroundProvider = ({
  children,
  currentEventTheme,
}: {
  children: ReactNode;
  currentEventTheme: EventThemeType;
}) => {
  const { videoQuality, isLiteMode } = usePerformance();
  const [currentVideoSrc, setCurrentVideoSrc] = useState(DEFAULT_VIDEO);
  const [overlayStyle, setOverlayStyle] = useState(DEFAULT_VIDEO_CONFIG.overlay || "");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoCheckRef = useRef<AbortController | null>(null);

  // Check if video exists
  const checkVideoExists = useCallback(async (src: string): Promise<boolean> => {
    try {
      // Cancel previous check
      videoCheckRef.current?.abort();
      videoCheckRef.current = new AbortController();

      const response = await fetch(src, {
        method: "HEAD",
        signal: videoCheckRef.current.signal,
      });
      return response.ok;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return false;
      }
      return false;
    }
  }, []);

  // Load video for current theme
  const loadVideo = useCallback(async () => {
    // Disable video in lite mode on mobile
    if (videoQuality === "disabled") {
      setCurrentVideoSrc("");
      setOverlayStyle("var(--background)");
      return;
    }

    const eventConfig = EVENT_VIDEO_CONFIG[currentEventTheme];
    
    if (!eventConfig?.src) {
      // Use default video
      setCurrentVideoSrc(DEFAULT_VIDEO);
      setOverlayStyle(DEFAULT_VIDEO_CONFIG.overlay || "");
      setHasError(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Check if event video exists
    const videoExists = await checkVideoExists(eventConfig.src);

    if (videoExists) {
      setCurrentVideoSrc(eventConfig.src);
      setOverlayStyle(eventConfig.overlay || DEFAULT_VIDEO_CONFIG.overlay || "");
    } else if (eventConfig.fallbackSrc) {
      // Use fallback
      setCurrentVideoSrc(eventConfig.fallbackSrc);
      setOverlayStyle(eventConfig.overlay || DEFAULT_VIDEO_CONFIG.overlay || "");
    } else {
      // Use default
      setCurrentVideoSrc(DEFAULT_VIDEO);
      setOverlayStyle(DEFAULT_VIDEO_CONFIG.overlay || "");
      setHasError(true);
    }

    setIsLoading(false);
  }, [currentEventTheme, checkVideoExists, videoQuality]);

  // Load video when theme changes
  useEffect(() => {
    loadVideo();

    return () => {
      videoCheckRef.current?.abort();
    };
  }, [loadVideo]);

  const retryLoad = useCallback(() => {
    loadVideo();
  }, [loadVideo]);

  return (
    <VideoBackgroundContext.Provider
      value={{
        currentVideoSrc,
        overlayStyle,
        isLoading,
        hasError,
        isDisabled: videoQuality === "disabled",
        retryLoad,
      }}
    >
      {children}
    </VideoBackgroundContext.Provider>
  );
};

export const useVideoBackground = () => {
  const context = useContext(VideoBackgroundContext);
  if (context === undefined) {
    throw new Error("useVideoBackground must be used within a VideoBackgroundProvider");
  }
  return context;
};

export default useVideoBackground;
