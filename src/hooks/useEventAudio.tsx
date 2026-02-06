import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { EventThemeType } from "./useEventTheme";
import { usePerformance } from "./usePerformance";

// Audio configuration per event
interface EventAudioConfig {
  src?: string;
  volume: number;
  loop: boolean;
  fadeIn?: boolean;
  fadeDuration?: number;
}

// Default audio paths (placeholder - can be replaced with actual audio files)
const EVENT_AUDIO_CONFIG: Partial<Record<EventThemeType, EventAudioConfig>> = {
  "new-year": {
    src: "/audio/event/fireworks-ambience.mp3",
    volume: 0.3,
    loop: false,
    fadeIn: true,
    fadeDuration: 1000,
  },
  "ramadan": {
    src: "/audio/event/islamic-ambience.mp3",
    volume: 0.2,
    loop: true,
    fadeIn: true,
    fadeDuration: 2000,
  },
  "eid-fitr": {
    src: "/audio/event/celebration.mp3",
    volume: 0.3,
    loop: false,
    fadeIn: true,
    fadeDuration: 1000,
  },
  "independence-day": {
    src: "/audio/event/national-ambience.mp3",
    volume: 0.3,
    loop: true,
    fadeIn: true,
    fadeDuration: 1500,
  },
  "christmas": {
    src: "/audio/event/christmas-bells.mp3",
    volume: 0.25,
    loop: true,
    fadeIn: true,
    fadeDuration: 2000,
  },
};

// Default background music config
const DEFAULT_AUDIO_CONFIG: EventAudioConfig = {
  src: "/background-music.mp3",
  volume: 0.3,
  loop: true,
  fadeIn: true,
  fadeDuration: 500,
};

interface AudioManagerContextType {
  isPlaying: boolean;
  currentAudio: "default" | "event";
  isMuted: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  switchToEventAudio: (eventType: EventThemeType) => void;
  switchToDefaultAudio: () => void;
}

const AudioManagerContext = createContext<AudioManagerContextType | undefined>(undefined);

// Fade audio volume
function fadeAudio(
  audio: HTMLAudioElement,
  targetVolume: number,
  duration: number,
  onComplete?: () => void
) {
  const startVolume = audio.volume;
  const volumeDiff = targetVolume - startVolume;
  const steps = 20;
  const stepDuration = duration / steps;
  let currentStep = 0;

  const fadeInterval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    audio.volume = Math.max(0, Math.min(1, startVolume + volumeDiff * progress));

    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      audio.volume = targetVolume;
      onComplete?.();
    }
  }, stepDuration);

  return () => clearInterval(fadeInterval);
}

export const AudioManagerProvider = ({
  children,
  currentEventTheme,
}: {
  children: ReactNode;
  currentEventTheme: EventThemeType;
}) => {
  const { isLiteMode } = usePerformance();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<"default" | "event">("default");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const defaultAudioRef = useRef<HTMLAudioElement | null>(null);
  const eventAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeCleanupRef = useRef<(() => void) | null>(null);

  // Initialize default audio
  useEffect(() => {
    const audio = new Audio(DEFAULT_AUDIO_CONFIG.src);
    audio.loop = DEFAULT_AUDIO_CONFIG.loop;
    audio.volume = 0;
    audio.preload = "auto";
    defaultAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Handle event theme changes
  useEffect(() => {
    if (!hasUserInteracted) return;

    const eventConfig = EVENT_AUDIO_CONFIG[currentEventTheme];

    // If no event audio or in lite mode, stick with default
    if (!eventConfig?.src || isLiteMode) {
      switchToDefaultAudio();
      return;
    }

    // Check if event audio exists before switching
    const checkEventAudio = async () => {
      try {
        const response = await fetch(eventConfig.src!, { method: "HEAD" });
        if (response.ok) {
          switchToEventAudio(currentEventTheme);
        } else {
          // Event audio doesn't exist, use default
          switchToDefaultAudio();
        }
      } catch {
        // Network error or file doesn't exist, use default
        switchToDefaultAudio();
      }
    };

    checkEventAudio();
  }, [currentEventTheme, hasUserInteracted, isLiteMode]);

  // Cleanup fade on unmount
  useEffect(() => {
    return () => {
      fadeCleanupRef.current?.();
    };
  }, []);

  const switchToEventAudio = useCallback((eventType: EventThemeType) => {
    const eventConfig = EVENT_AUDIO_CONFIG[eventType];
    if (!eventConfig?.src) return;

    // Clean up previous fade
    fadeCleanupRef.current?.();

    // Fade out default audio
    if (defaultAudioRef.current && !defaultAudioRef.current.paused) {
      fadeCleanupRef.current = fadeAudio(
        defaultAudioRef.current,
        0,
        eventConfig.fadeDuration || 500,
        () => {
          defaultAudioRef.current?.pause();
        }
      );
    }

    // Create and play event audio
    if (eventAudioRef.current) {
      eventAudioRef.current.pause();
      eventAudioRef.current.src = "";
    }

    const eventAudio = new Audio(eventConfig.src);
    eventAudio.loop = eventConfig.loop;
    eventAudio.volume = 0;
    eventAudioRef.current = eventAudio;

    eventAudio.play().then(() => {
      setCurrentAudio("event");
      setIsPlaying(true);
      fadeAudio(eventAudio, eventConfig.volume * volume, eventConfig.fadeDuration || 500);
    }).catch(console.error);

    // Handle event audio end - return to default
    if (!eventConfig.loop) {
      eventAudio.onended = () => {
        switchToDefaultAudio();
      };
    }
  }, [volume]);

  const switchToDefaultAudio = useCallback(() => {
    // Clean up previous fade
    fadeCleanupRef.current?.();

    // Fade out event audio
    if (eventAudioRef.current && !eventAudioRef.current.paused) {
      fadeCleanupRef.current = fadeAudio(
        eventAudioRef.current,
        0,
        500,
        () => {
          eventAudioRef.current?.pause();
        }
      );
    }

    // Resume default audio
    if (defaultAudioRef.current && isPlaying) {
      defaultAudioRef.current.volume = 0;
      defaultAudioRef.current.play().then(() => {
        setCurrentAudio("default");
        fadeAudio(defaultAudioRef.current!, DEFAULT_AUDIO_CONFIG.volume * volume, 500);
      }).catch(console.error);
    }
  }, [isPlaying, volume]);

  const play = useCallback(() => {
    setHasUserInteracted(true);
    const audio = currentAudio === "event" ? eventAudioRef.current : defaultAudioRef.current;
    if (audio) {
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        const config = currentAudio === "event" 
          ? EVENT_AUDIO_CONFIG[currentEventTheme] 
          : DEFAULT_AUDIO_CONFIG;
        fadeAudio(audio, (config?.volume || 0.3) * volume, config?.fadeDuration || 500);
      }).catch(console.error);
    }
  }, [currentAudio, currentEventTheme, volume]);

  const pause = useCallback(() => {
    const audio = currentAudio === "event" ? eventAudioRef.current : defaultAudioRef.current;
    if (audio) {
      fadeAudio(audio, 0, 300, () => {
        audio.pause();
        setIsPlaying(false);
      });
    }
  }, [currentAudio]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    const audio = currentAudio === "event" ? eventAudioRef.current : defaultAudioRef.current;
    if (audio) {
      if (isMuted) {
        audio.volume = volume;
      } else {
        audio.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  }, [currentAudio, isMuted, volume]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    const audio = currentAudio === "event" ? eventAudioRef.current : defaultAudioRef.current;
    if (audio && !isMuted) {
      audio.volume = newVolume;
    }
  }, [currentAudio, isMuted]);

  return (
    <AudioManagerContext.Provider
      value={{
        isPlaying,
        currentAudio,
        isMuted,
        volume,
        play,
        pause,
        toggle,
        toggleMute,
        setVolume,
        switchToEventAudio,
        switchToDefaultAudio,
      }}
    >
      {children}
    </AudioManagerContext.Provider>
  );
};

export const useEventAudio = () => {
  const context = useContext(AudioManagerContext);
  if (context === undefined) {
    throw new Error("useEventAudio must be used within an AudioManagerProvider");
  }
  return context;
};

export default useEventAudio;
