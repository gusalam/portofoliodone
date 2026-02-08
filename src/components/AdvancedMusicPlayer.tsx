import { useRef, forwardRef, useImperativeHandle, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Disc3 } from "lucide-react";
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
  name: string;
  nameId: string;
  volume: number;
  loop: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
}

// Event audio configs - using background-music.mp3 as fallback since event audio files may not exist
const EVENT_AUDIO_CONFIG: Partial<Record<EventThemeType, EventAudioConfig>> = {
  "new-year": {
    name: "New Year Celebration",
    nameId: "Perayaan Tahun Baru",
    volume: 0.35,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "ramadan": {
    name: "Ramadan Ambience",
    nameId: "Suasana Ramadhan",
    volume: 0.25,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
  "eid-fitr": {
    name: "Eid Celebration",
    nameId: "Perayaan Idul Fitri",
    volume: 0.35,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "eid-adha": {
    name: "Eid Adha Ambience",
    nameId: "Suasana Idul Adha",
    volume: 0.3,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "independence-day": {
    name: "Independence Day",
    nameId: "Hari Kemerdekaan",
    volume: 0.35,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "christmas": {
    name: "Christmas Bells",
    nameId: "Lonceng Natal",
    volume: 0.3,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
  "valentine": {
    name: "Valentine Romance",
    nameId: "Romantis Valentine",
    volume: 0.25,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "halloween": {
    name: "Spooky Ambience",
    nameId: "Suasana Menyeramkan",
    volume: 0.3,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "maulid-nabi": {
    name: "Islamic Celebration",
    nameId: "Perayaan Islami",
    volume: 0.25,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
  "isra-miraj": {
    name: "Night Journey",
    nameId: "Perjalanan Malam",
    volume: 0.25,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
  "islamic-new-year": {
    name: "Islamic New Year",
    nameId: "Tahun Baru Islam",
    volume: 0.25,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
};

// Default audio config
const DEFAULT_AUDIO_SRC = "/background-music.mp3";
const DEFAULT_VOLUME = 0.3;
const DEFAULT_FADE_DURATION = 800;

// Smooth fade audio utility with easing
function fadeAudio(
  audio: HTMLAudioElement,
  targetVolume: number,
  duration: number,
  onComplete?: () => void
): () => void {
  const startVolume = audio.volume;
  const volumeDiff = targetVolume - startVolume;
  const startTime = performance.now();

  let animationFrame: number;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic for smooth fade
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const newVolume = startVolume + volumeDiff * easedProgress;
    
    audio.volume = Math.max(0, Math.min(1, newVolume));

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      audio.volume = Math.max(0, Math.min(1, targetVolume));
      onComplete?.();
    }
  };

  animationFrame = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationFrame);
}

// Crossfade between two audio sources
function crossfadeAudio(
  outAudio: HTMLAudioElement | null,
  inAudio: HTMLAudioElement,
  targetVolume: number,
  duration: number,
  onComplete?: () => void
): () => void {
  const cleanups: (() => void)[] = [];

  // Fade out current audio
  if (outAudio && !outAudio.paused) {
    const fadeOutCleanup = fadeAudio(outAudio, 0, duration, () => {
      outAudio.pause();
    });
    cleanups.push(fadeOutCleanup);
  }

  // Fade in new audio
  inAudio.volume = 0;
  inAudio.play().then(() => {
    const fadeInCleanup = fadeAudio(inAudio, targetVolume, duration, onComplete);
    cleanups.push(fadeInCleanup);
  }).catch(console.error);

  return () => cleanups.forEach(cleanup => cleanup());
}

const AdvancedMusicPlayer = forwardRef<AdvancedMusicPlayerRef>((_, ref) => {
  const { language } = useLanguage();
  const { currentEventTheme, isEventActive } = useEventTheme();
  const { isLiteMode } = usePerformance();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const crossfadeCleanupRef = useRef<(() => void) | null>(null);
  const previousThemeRef = useRef<EventThemeType | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState({ en: "Background Music", id: "Musik Latar" });

  // Get current audio config
  const getAudioConfig = useCallback((theme: EventThemeType) => {
    if (isEventActive && EVENT_AUDIO_CONFIG[theme]) {
      return {
        ...EVENT_AUDIO_CONFIG[theme]!,
        src: DEFAULT_AUDIO_SRC, // Use default audio since event-specific files may not exist
      };
    }
    return {
      name: "Background Music",
      nameId: "Musik Latar",
      volume: DEFAULT_VOLUME,
      loop: true,
      fadeInDuration: DEFAULT_FADE_DURATION,
      fadeOutDuration: DEFAULT_FADE_DURATION,
      src: DEFAULT_AUDIO_SRC,
    };
  }, [isEventActive]);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(DEFAULT_AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    // Update track name on init
    const config = getAudioConfig(currentEventTheme);
    setCurrentTrackName({ en: config.name, id: config.nameId });

    return () => {
      crossfadeCleanupRef.current?.();
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Handle event theme changes with crossfade
  useEffect(() => {
    if (!hasUserInteracted || !isPlaying) return;
    if (previousThemeRef.current === currentEventTheme) return;

    const config = getAudioConfig(currentEventTheme);
    const previousConfig = previousThemeRef.current 
      ? getAudioConfig(previousThemeRef.current)
      : null;

    // Update track name
    setCurrentTrackName({ en: config.name, id: config.nameId });

    // Clean up previous crossfade
    crossfadeCleanupRef.current?.();

    // If theme changed and we're playing, do a smooth volume transition
    if (audioRef.current && !audioRef.current.paused) {
      setIsTransitioning(true);
      
      const crossfadeDuration = Math.max(
        previousConfig?.fadeOutDuration || DEFAULT_FADE_DURATION,
        config.fadeInDuration
      );

      // Smooth volume transition for theme change
      crossfadeCleanupRef.current = fadeAudio(
        audioRef.current,
        isMuted ? 0 : config.volume * (volume / DEFAULT_VOLUME),
        crossfadeDuration,
        () => setIsTransitioning(false)
      );
    }

    previousThemeRef.current = currentEventTheme;
  }, [currentEventTheme, hasUserInteracted, isPlaying, getAudioConfig, isMuted, volume]);

  const play = useCallback(() => {
    setHasUserInteracted(true);
    previousThemeRef.current = currentEventTheme;
    
    const config = getAudioConfig(currentEventTheme);
    setCurrentTrackName({ en: config.name, id: config.nameId });

    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        fadeAudio(
          audioRef.current!,
          isMuted ? 0 : config.volume * (volume / DEFAULT_VOLUME),
          config.fadeInDuration
        );
      }).catch(console.error);
    }
  }, [currentEventTheme, getAudioConfig, isMuted, volume]);

  const pause = useCallback(() => {
    const config = getAudioConfig(currentEventTheme);
    
    if (audioRef.current) {
      fadeAudio(audioRef.current, 0, config.fadeOutDuration, () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
    }
  }, [currentEventTheme, getAudioConfig]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    const config = getAudioConfig(currentEventTheme);
    
    if (audioRef.current) {
      if (isMuted) {
        fadeAudio(audioRef.current, config.volume * (volume / DEFAULT_VOLUME), 200);
      } else {
        fadeAudio(audioRef.current, 0, 200);
      }
      setIsMuted(!isMuted);
    }
  }, [currentEventTheme, getAudioConfig, isMuted, volume]);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    
    const config = getAudioConfig(currentEventTheme);
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = config.volume * (vol / DEFAULT_VOLUME);
    }
  }, [currentEventTheme, getAudioConfig, isMuted]);

  useImperativeHandle(ref, () => ({
    play,
    pause,
    toggle,
  }));

  const labels = {
    music: language === "id" ? "Musik" : "Music",
    playing: language === "id" ? "Sedang diputar" : "Now playing",
    volume: language === "id" ? "Volume" : "Volume",
    clickToPlay: language === "id" ? "Klik untuk putar" : "Click to play",
    transitioning: language === "id" ? "Beralih..." : "Transitioning...",
  };

  const trackName = language === "id" ? currentTrackName.id : currentTrackName.en;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm border-primary/30 shadow-lg hover:bg-primary/20 transition-all duration-300"
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
                  {isTransitioning ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Disc3 className="h-5 w-5 text-primary" />
                    </motion.div>
                  ) : (
                    <>
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
                    </>
                  )}
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
              <div className="flex items-center gap-2">
                {isTransitioning && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Disc3 className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
                <p className="text-sm font-medium">
                  {isTransitioning ? labels.transitioning : trackName}
                </p>
              </div>
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

            {/* Event Theme Indicator */}
            {isEventActive && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-center text-muted-foreground border-t pt-2"
              >
                🎵 {language === "id" ? "Tema Event Aktif" : "Event Theme Active"}
              </motion.div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

AdvancedMusicPlayer.displayName = "AdvancedMusicPlayer";

export default AdvancedMusicPlayer;
