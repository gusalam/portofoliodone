import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

export interface MusicPlayerRef {
  play: () => void;
  pause: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerRef>((_, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {
          console.log("Autoplay prevented");
        });
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    },
  }));

  return (
    <audio ref={audioRef} loop>
      <source src="/background-music.mp3" type="audio/mpeg" />
    </audio>
  );
});

MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
