import { Button } from "@/components/ui/button";
import { Play, LogOut } from "lucide-react";
import { useRef, useEffect } from "react";
import lockedBg from "@/assets/locked-bg.jpg";

interface WelcomeModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  showLockedMessage?: boolean;
}

const WelcomeModal = ({ open, onAccept, onDecline, showLockedMessage = false }: WelcomeModalProps) => {
  const lockedAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (showLockedMessage && lockedAudioRef.current) {
      lockedAudioRef.current.volume = 0.4;
      lockedAudioRef.current.play().catch(() => {
        console.log("Locked audio autoplay prevented");
      });
    }
  }, [showLockedMessage]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Image with Overlay when locked */}
      {showLockedMessage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${lockedBg})`,
          }}
        >
           <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      
      {/* Backdrop */}
      {!showLockedMessage && (
         <div className="absolute inset-0 bg-background/95" />
      )}
      
      {/* Locked Music */}
      <audio ref={lockedAudioRef} loop>
        <source src="/locked-music.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Modal */}
      <div 
         className="relative z-10 w-full max-w-md transform transition-all duration-500 ease-out animate-in fade-in zoom-in-95 bg-card border border-primary/30 rounded-3xl shadow-2xl"
      >
        <div className="p-8 text-center">
          {/* Glowing accent line */}
          <div 
             className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
          />

          {/* Title */}
           <h1 className="text-2xl md:text-3xl font-orbitron font-bold mb-4 mt-4 gradient-text">
            Selamat Datang di Portofolio Tretan Developer
          </h1>

          {/* Description */}
          {!showLockedMessage ? (
             <p className="text-muted-foreground font-poppins text-sm md:text-base mb-8 leading-relaxed">
              Untuk melanjutkan, silakan putar musik latar terlebih dahulu.
            </p>
          ) : (
            <div className="mb-8">
               <p className="text-destructive font-poppins text-sm md:text-base leading-relaxed">
                Musik diperlukan untuk pengalaman penuh.
              </p>
               <p className="text-muted-foreground font-poppins text-xs md:text-sm mt-2">
                Silakan refresh halaman jika ingin masuk kembali.
              </p>
            </div>
          )}

          {/* Buttons */}
          {!showLockedMessage && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={onAccept}
                 className="w-full py-6 text-base font-poppins font-semibold transition-all duration-300 group bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Putar Musik & Masuk
              </Button>
              <Button
                variant="ghost"
                onClick={onDecline}
                 className="w-full py-5 text-muted-foreground hover:text-foreground hover:bg-muted font-poppins transition-all duration-300 border border-border hover:border-primary/50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
