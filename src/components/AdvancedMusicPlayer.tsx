import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/hooks/useLanguage";
import { useEventTheme, EventThemeType } from "@/hooks/useEventTheme";
import { usePerformance } from "@/hooks/usePerformance";

export interface AdvancedMusicPlayerRef {
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

// Audio configuration per event
interface EventAudioConfig {
  src?: string;
  volume: number;
  loop: boolean;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

// Event audio configs
const EVENT_AUDIO_CONFIG: Partial<Record<EventThemeType, EventAudioConfig>> = {
  "new-year": {
    src: "/audio/event/fireworks-ambience.mp3",
    volume: 0.3,
    loop: false,
    fadeInDuration: 1000,
    fadeOutDuration: 500,
  },
  "ramadan": {
    src: "/audio/event/islamic-ambience.mp3",
    volume: 0.2,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
  "independence-day": {
    src: "/audio/event/national-ambience.mp3",
    volume: 0.3,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 500,
  },
  "christmas": {
    src: "/audio/event/christmas-bells.mp3",
    volume: 0.25,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
};

// Default audio config
const DEFAULT_AUDIO_SRC = "/background-music.mp3";
const DEFAULT_VOLUME = 0.3;

// Fade audio utility
function fadeAudio(
  audio: HTMLAudioElement,
  targetVolume: number,
  duration: number,
  onComplete?: () => void
): () => void {
  const startVolume = audio.volume;
  const volumeDiff = targetVolume - startVolume;
  const steps = Math.max(20, Math.floor(duration / 50));
  const stepDuration = duration / steps;
  let currentStep = 0;

  const fadeInterval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    audio.volume = Math.max(0, Math.min(1, startVolume + volumeDiff * easedProgress));

    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      audio.volume = Math.max(0, Math.min(1, targetVolume));
      onComplete?.();
    }
  }, stepDuration);

  return () => clearInterval(fadeInterval);
}

const AdvancedMusicPlayer = forwardRef<AdvancedMusicPlayerRef>((_, ref) => {
  const { language } = useLanguage();
  const { currentEventTheme } = useEventTheme();
  const { isLiteMode } = usePerformance();

  const defaultAudioRef = useRef<HTMLAudioElement | null>(null);
  const eventAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeCleanupRef = useRef<(() => void) | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [currentSource, setCurrentSource] = useState<"default" | "event">("default");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize default audio
  useEffect(() => {
    const audio = new Audio(DEFAULT_AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    defaultAudioRef.current = audio;

    return () => {
      fadeCleanupRef.current?.();
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Handle event theme changes
  useEffect(() => {
    if (!hasUserInteracted || !isPlaying) return;

    const eventConfig = EVENT_AUDIO_CONFIG[currentEventTheme];

    // If no event audio or lite mode, use default
    if (!eventConfig?.src || isLiteMode) {
      if (currentSource === "event") {
        switchToDefault();
      }
      return;
    }

    // Check if event audio exists before switching
    const checkAndSwitchAudio = async () => {
      try {
        const response = await fetch(eventConfig.src!, { method: "HEAD" });
        if (response.ok) {
          switchToEvent(currentEventTheme);
        }
      } catch {
        // Audio doesn't exist, stay with default
      }
    };

    checkAndSwitchAudio();
  }, [currentEventTheme, hasUserInteracted, isPlaying, isLiteMode]);

  const switchToEvent = (eventType: EventThemeType) => {
    const eventConfig = EVENT_AUDIO_CONFIG[eventType];
    if (!eventConfig?.src) return;

    fadeCleanupRef.current?.();

    // Fade out default audio
    if (defaultAudioRef.current && !defaultAudioRef.current.paused) {
      fadeCleanupRef.current = fadeAudio(
        defaultAudioRef.current,
        0,
        eventConfig.fadeOutDuration || 500,
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
      setCurrentSource("event");
      fadeAudio(eventAudio, eventConfig.volume * (volume / DEFAULT_VOLUME), eventConfig.fadeInDuration || 500);
    }).catch(console.error);

    // Return to default when event audio ends (if not looping)
    if (!eventConfig.loop) {
      eventAudio.onended = () => {
        switchToDefault();
      };
    }
  };

  const switchToDefault = () => {
    fadeCleanupRef.current?.();

    // Fade out event audio
    if (eventAudioRef.current && !eventAudioRef.current.paused) {
      fadeCleanupRef.current = fadeAudio(eventAudioRef.current, 0, 500, () => {
        eventAudioRef.current?.pause();
      });
    }

    // Resume default audio
    if (defaultAudioRef.current && isPlaying) {
      defaultAudioRef.current.volume = 0;
      defaultAudioRef.current.play().then(() => {
        setCurrentSource("default");
        fadeAudio(defaultAudioRef.current!, volume, 500);
      }).catch(console.error);
    }
  };

  const play = () => {
    setHasUserInteracted(true);
    const audio = currentSource === "event" ? eventAudioRef.current : defaultAudioRef.current;
    
    if (audio) {
      audio.volume = 0;
      audio.play().then(() => {
        setIsPlaying(true);
        fadeAudio(audio, isMuted ? 0 : volume, 500);
      }).catch(console.error);
    }
  };

  const pause = () => {
    const audio = currentSource === "event" ? eventAudioRef.current : defaultAudioRef.current;
    
    if (audio) {
      fadeAudio(audio, 0, 300, () => {
        audio.pause();
        setIsPlaying(false);
      });
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleMute = () => {
    const audio = currentSource === "event" ? eventAudioRef.current : defaultAudioRef.current;
    
    if (audio) {
      if (isMuted) {
        fadeAudio(audio, volume, 200);
      } else {
        fadeAudio(audio, 0, 200);
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    
    const audio = currentSource === "event" ? eventAudioRef.current : defaultAudioRef.current;
    if (audio && !isMuted) {
      audio.volume = vol;
    }
  };

  useImperativeHandle(ref, () => ({
    play,
    pause,
    toggle,
  }));

  const labels = {
    music: language === "id" ? "Musik" : "Music",
    playing: language === "id" ? "Sedang diputar" : "Now playing",
    default: language === "id" ? "Musik Latar" : "Background Music",
    event: language === "id" ? "Musik Event" : "Event Music",
    volume: language === "id" ? "Volume" : "Volume",
    clickToPlay: language === "id" ? "Klik untuk putar" : "Click to play",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm border-primary/30 shadow-lg hover:bg-primary/20 box-glow-hover"
            aria-label={labels.music}
          >
            <AnimatePresence mode="wait">
              {isPlaying && !isMuted ? (
                <motion.div
                  key="playing"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative"
                >
                  <Music className="h-5 w-5 text-primary" />
                  {/* Audio wave animation */}
                  <motion.div
                    className="absolute -right-1 -top-1 flex gap-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 bg-primary rounded-full"
                        animate={{
                          height: [4, 8, 4],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="muted"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="end"
          className="w-64 p-4"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{labels.music}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Now Playing */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">{labels.playing}</p>
              <p className="text-sm font-medium">
                {currentSource === "event" ? labels.event : labels.default}
              </p>
            </div>

            {/* Play/Pause Button */}
            <Button
              variant={isPlaying ? "outline" : "default"}
              className="w-full"
              onClick={toggle}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Play
                </>
              )}
            </Button>

            {/* Volume Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{labels.volume}</span>
                <span className="text-xs font-mono">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

AdvancedMusicPlayer.displayName = "AdvancedMusicPlayer";

export default AdvancedMusicPlayer;
