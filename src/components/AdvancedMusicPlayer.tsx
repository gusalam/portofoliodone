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
  src: string;
  volume: number;
  loop: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
}

// Event audio files - stored in public/audio/event/
const EVENT_AUDIO_CONFIG: Partial<Record<EventThemeType, EventAudioConfig>> = {
  "new-year": {
    name: "New Year Celebration",
    nameId: "Perayaan Tahun Baru",
    src: "/audio/event/new-year.mp3",
    volume: 0.35,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "ramadan": {
    name: "Ramadan Ambience",
    nameId: "Suasana Ramadhan",
    src: "/audio/event/ramadan.mp3",
    volume: 0.25,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
  "eid-fitr": {
    name: "Eid Celebration",
    nameId: "Perayaan Idul Fitri",
    src: "/audio/event/eid-fitr.mp3",
    volume: 0.35,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "eid-adha": {
    name: "Eid Adha Ambience",
    nameId: "Suasana Idul Adha",
    src: "/audio/event/eid-adha.mp3",
    volume: 0.3,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "independence-day": {
    name: "Independence Day",
    nameId: "Hari Kemerdekaan",
    src: "/audio/event/independence-day.mp3",
    volume: 0.35,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "christmas": {
    name: "Christmas Bells",
    nameId: "Lonceng Natal",
    src: "/audio/event/christmas.mp3",
    volume: 0.3,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
  "valentine": {
    name: "Valentine Romance",
    nameId: "Romantis Valentine",
    src: "/audio/event/valentine.mp3",
    volume: 0.25,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "halloween": {
    name: "Spooky Ambience",
    nameId: "Suasana Menyeramkan",
    src: "/audio/event/halloween.mp3",
    volume: 0.3,
    loop: true,
    fadeInDuration: 1500,
    fadeOutDuration: 800,
  },
  "maulid-nabi": {
    name: "Islamic Celebration",
    nameId: "Perayaan Islami",
    src: "/audio/event/maulid-nabi.mp3",
    volume: 0.25,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
  "isra-miraj": {
    name: "Night Journey",
    nameId: "Perjalanan Malam",
    src: "/audio/event/isra-miraj.mp3",
    volume: 0.25,
    loop: true,
    fadeInDuration: 2000,
    fadeOutDuration: 1000,
  },
  "islamic-new-year": {
    name: "Islamic New Year",
    nameId: "Tahun Baru Islam",
    src: "/audio/event/islamic-new-year.mp3",
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

// Cache for audio availability check
const audioAvailabilityCache = new Map<string, boolean>();

// Check if audio file exists
async function checkAudioExists(src: string): Promise<boolean> {
  if (audioAvailabilityCache.has(src)) {
    return audioAvailabilityCache.get(src)!;
  }
  
  try {
    const response = await fetch(src, { method: "HEAD" });
    const exists = response.ok;
    audioAvailabilityCache.set(src, exists);
    return exists;
  } catch {
    audioAvailabilityCache.set(src, false);
    return false;
  }
}

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
  const { language, t } = useLanguage();
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

  const [currentAudioSrc, setCurrentAudioSrc] = useState<string>(DEFAULT_AUDIO_SRC);

  // Get current audio config with fallback
  const getAudioConfig = useCallback((theme: EventThemeType): EventAudioConfig => {
    const eventConfig = EVENT_AUDIO_CONFIG[theme];
    if (isEventActive && eventConfig) {
      return eventConfig;
    }
    return {
      name: "Background Music",
      nameId: "Musik Latar",
      src: DEFAULT_AUDIO_SRC,
      volume: DEFAULT_VOLUME,
      loop: true,
      fadeInDuration: DEFAULT_FADE_DURATION,
      fadeOutDuration: DEFAULT_FADE_DURATION,
    };
  }, [isEventActive]);

  // Initialize default audio
  useEffect(() => {
    const audio = new Audio(DEFAULT_AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    audioRef.current = audio;

    const config = getAudioConfig(currentEventTheme);
    setCurrentTrackName({ en: config.name, id: config.nameId });

    return () => {
      crossfadeCleanupRef.current?.();
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Switch audio source with crossfade
  const switchAudioSource = useCallback(async (newSrc: string, config: EventAudioConfig) => {
    if (!audioRef.current || !isPlaying) return;
    
    setIsTransitioning(true);
    
    // Fade out current audio
    const currentAudio = audioRef.current;
    crossfadeCleanupRef.current?.();
    
    crossfadeCleanupRef.current = fadeAudio(currentAudio, 0, config.fadeOutDuration, () => {
      currentAudio.pause();
      
      // Create new audio with new source
      const newAudio = new Audio(newSrc);
      newAudio.loop = config.loop;
      newAudio.volume = 0;
      newAudio.preload = "auto";
      audioRef.current = newAudio;
      
      // Play and fade in
      newAudio.play().then(() => {
        setCurrentAudioSrc(newSrc);
        fadeAudio(newAudio, isMuted ? 0 : config.volume * (volume / DEFAULT_VOLUME), config.fadeInDuration, () => {
          setIsTransitioning(false);
        });
      }).catch(() => {
        setIsTransitioning(false);
      });
    });
  }, [isPlaying, isMuted, volume]);

  // Handle event theme changes with crossfade to different audio source
  useEffect(() => {
    if (!hasUserInteracted || !isPlaying) return;
    if (previousThemeRef.current === currentEventTheme) return;

    const config = getAudioConfig(currentEventTheme);
    
    // Update track name
    setCurrentTrackName({ en: config.name, id: config.nameId });

    // Check if audio source should change
    const checkAndSwitchAudio = async () => {
      // Check if event-specific audio exists
      const eventAudioExists = await checkAudioExists(config.src);
      const targetSrc = eventAudioExists ? config.src : DEFAULT_AUDIO_SRC;
      
      // If source is different, do crossfade switch
      if (targetSrc !== currentAudioSrc) {
        await switchAudioSource(targetSrc, config);
      } else {
        // Same source, just adjust volume
        crossfadeCleanupRef.current?.();
        if (audioRef.current && !audioRef.current.paused) {
          setIsTransitioning(true);
          crossfadeCleanupRef.current = fadeAudio(
            audioRef.current,
            isMuted ? 0 : config.volume * (volume / DEFAULT_VOLUME),
            config.fadeInDuration,
            () => setIsTransitioning(false)
          );
        }
      }
    };

    checkAndSwitchAudio();
    previousThemeRef.current = currentEventTheme;
  }, [currentEventTheme, hasUserInteracted, isPlaying, getAudioConfig, isMuted, volume, currentAudioSrc, switchAudioSource]);

  const play = useCallback(async () => {
    setHasUserInteracted(true);
    previousThemeRef.current = currentEventTheme;
    
    const config = getAudioConfig(currentEventTheme);
    setCurrentTrackName({ en: config.name, id: config.nameId });

    // Check if event audio exists, fallback to default
    const eventAudioExists = await checkAudioExists(config.src);
    const targetSrc = eventAudioExists ? config.src : DEFAULT_AUDIO_SRC;

    // If current audio has different source, switch it
    if (audioRef.current?.src !== targetSrc && targetSrc !== currentAudioSrc) {
      const newAudio = new Audio(targetSrc);
      newAudio.loop = config.loop;
      newAudio.volume = 0;
      newAudio.preload = "auto";
      
      audioRef.current?.pause();
      audioRef.current = newAudio;
      setCurrentAudioSrc(targetSrc);
    }

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
  }, [currentEventTheme, getAudioConfig, isMuted, volume, currentAudioSrc]);

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
    music: t("music.music"),
    playing: t("music.playing"),
    volume: t("music.volume"),
    clickToPlay: t("music.clickToPlay"),
    transitioning: t("music.transitioning"),
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
                  {t("music.pause")}
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  {t("music.play")}
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
                🎵 {t("music.eventActive")}
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
