import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const LoadingScreen = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center animate-fade-out">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative animate-glow-pulse">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-spin" style={{ animationDuration: "3s" }}></div>
            
            {/* Middle ring */}
            <div className="absolute inset-2 border-4 border-secondary/50 rounded-full animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }}></div>
            
            {/* Inner content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-orbitron font-bold gradient-text">Tretan Developer</span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-orbitron font-bold gradient-text">
            {language === 'id' ? 'Memulai Portfolio' : 'Initializing Portfolio'}
          </h2>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-gradient-primary transition-all duration-300 box-glow"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-muted-foreground font-poppins text-sm">
            {progress}% {language === 'id' ? 'Selesai' : 'Complete'}
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2 justify-center">
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
