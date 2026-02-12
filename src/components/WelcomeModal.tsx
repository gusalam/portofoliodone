import { useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface WelcomeModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  showLockedMessage?: boolean;
}

const WelcomeModal = ({ open, onAccept, onDecline, showLockedMessage = false }: WelcomeModalProps) => {
  const lockedAudioRef = useRef<HTMLAudioElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (showLockedMessage && lockedAudioRef.current) {
      lockedAudioRef.current.volume = 0.4;
      lockedAudioRef.current.play().catch(() => {
        console.log("Locked audio autoplay prevented");
      });
    }
  }, [showLockedMessage]);

  useEffect(() => {
    if (open && !showLockedMessage) {
      // Auto-accept after a short delay (no music gate)
      const timer = setTimeout(() => onAccept(), 100);
      return () => clearTimeout(timer);
    }
  }, [open, showLockedMessage, onAccept]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Default theme background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Locked Music */}
      <audio ref={lockedAudioRef} loop>
        <source src="/locked-music.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md transform transition-all duration-500 ease-out animate-in fade-in zoom-in-95 bg-card border border-primary/30 rounded-3xl shadow-2xl">
        <div className="p-8 text-center">
          {/* Glowing accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-orbitron font-bold mb-4 mt-4 gradient-text">
            {t("welcome.title")}
          </h1>

          {/* Locked message */}
          {showLockedMessage && (
            <div className="mb-8">
              <p className="text-destructive font-poppins text-sm md:text-base leading-relaxed">
                {t("welcome.musicRequired")}
              </p>
              <p className="text-muted-foreground font-poppins text-xs md:text-sm mt-2">
                {t("welcome.refreshHint")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
