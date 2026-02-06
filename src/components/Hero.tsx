import { useEffect, useState, useMemo } from "react";
import { ArrowDown, Download, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useEventTheme, EventThemeType } from "@/hooks/useEventTheme";
import { usePerformance } from "@/hooks/usePerformance";

// Video overlay configuration per event
const EVENT_VIDEO_OVERLAYS: Partial<Record<EventThemeType, string>> = {
  "ramadan": "linear-gradient(to bottom, rgba(5, 46, 22, 0.92), rgba(20, 83, 45, 0.88))",
  "eid-fitr": "linear-gradient(to bottom, rgba(22, 101, 52, 0.88), rgba(101, 163, 13, 0.85))",
  "eid-adha": "linear-gradient(to bottom, rgba(120, 53, 15, 0.9), rgba(180, 83, 9, 0.85))",
  "maulid-nabi": "linear-gradient(to bottom, rgba(5, 46, 22, 0.9), rgba(101, 163, 13, 0.85))",
  "isra-miraj": "linear-gradient(to bottom, rgba(30, 27, 75, 0.92), rgba(49, 46, 129, 0.88))",
  "islamic-new-year": "linear-gradient(to bottom, rgba(120, 53, 15, 0.9), rgba(180, 83, 9, 0.85))",
  "new-year": "linear-gradient(to bottom, rgba(30, 27, 75, 0.9), rgba(88, 28, 135, 0.85))",
  "independence-day": "linear-gradient(to bottom, rgba(127, 29, 29, 0.88), rgba(185, 28, 28, 0.85))",
  "heroes-day": "linear-gradient(to bottom, rgba(127, 29, 29, 0.9), rgba(120, 53, 15, 0.85))",
  "kartini-day": "linear-gradient(to bottom, rgba(120, 53, 15, 0.85), rgba(190, 18, 60, 0.8))",
  "christmas": "linear-gradient(to bottom, rgba(21, 94, 117, 0.88), rgba(22, 101, 52, 0.85))",
  "halloween": "linear-gradient(to bottom, rgba(30, 27, 30, 0.95), rgba(88, 28, 60, 0.9))",
  "valentine": "linear-gradient(to bottom, rgba(136, 19, 55, 0.88), rgba(190, 18, 60, 0.85))",
  "earth-day": "linear-gradient(to bottom, rgba(5, 46, 22, 0.88), rgba(21, 94, 117, 0.85))",
  "environment-day": "linear-gradient(to bottom, rgba(5, 46, 22, 0.88), rgba(22, 101, 52, 0.85))",
};

const DEFAULT_OVERLAY = "rgba(0, 0, 0, 0.9)";

const Hero = () => {
  const { t, language } = useLanguage();
  const { currentEventTheme, eventInfo } = useEventTheme();
  const { videoQuality, shouldReduceAnimations } = usePerformance();
  const [displayedText, setDisplayedText] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);

  const roles = language === "id"
    ? [
        "Pengembang Fullstack",
        "Insinyur AI",
        "Pengembang Web3",
        "Pengembang Mobile",
        "Insinyur IoT",
        "Desainer UI/UX",
      ]
    : [
        "Fullstack Developer",
        "AI Engineer",
        "Web3 Developer",
        "Mobile Developer",
        "IoT Engineer",
        "UI/UX Designer",
      ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    let currentIndex = 0;
    const currentRole = roles[currentRoleIndex];
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= currentRole.length) {
        setDisplayedText(currentRole.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentRoleIndex]);

  // Get event-specific greeting
  const getEventGreeting = () => {
    if (currentEventTheme === "default" || !eventInfo?.greeting) {
      return t("hero.greeting");
    }
    return language === "id" ? (eventInfo.greetingId || eventInfo.greeting) : eventInfo.greeting;
  };

  // Check if current theme is an Islamic event
  const isIslamicTheme = ["ramadan", "eid-fitr", "eid-adha", "maulid-nabi", "isra-miraj", "islamic-new-year"].includes(currentEventTheme);
  
  // Check if current theme is a celebration event
  const isCelebrationTheme = ["new-year", "independence-day", "valentine", "christmas", "halloween", "eid-fitr"].includes(currentEventTheme);

  // Get video overlay based on current event
  const videoOverlay = useMemo(() => {
    return EVENT_VIDEO_OVERLAYS[currentEventTheme] || DEFAULT_OVERLAY;
  }, [currentEventTheme]);

  // Determine if video should be shown
  const showVideo = videoQuality !== "disabled";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video with Event-Aware Overlay */}
      <div className="absolute inset-0 z-0">
        {showVideo ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            {/* Dynamic event overlay */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ background: videoOverlay }}
              key={currentEventTheme}
            />
          </>
        ) : (
          /* Fallback for disabled video */
          <div className="absolute inset-0 bg-background" />
        )}
      </div>

      {/* Animated Grid */}
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--primary) / 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--primary) / 0.08) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Event-Aware Greeting */}
          <motion.p
            key={currentEventTheme}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`text-primary text-base sm:text-lg md:text-xl font-poppins font-medium mb-4 ${
              isCelebrationTheme && !shouldReduceAnimations ? "animate-pulse" : ""
            }`}
          >
            {getEventGreeting()}
            {isIslamicTheme && <span className="ml-2">☪</span>}
            {currentEventTheme === "christmas" && <span className="ml-2">🎄</span>}
            {currentEventTheme === "new-year" && <span className="ml-2">🎉</span>}
            {currentEventTheme === "valentine" && <span className="ml-2">💕</span>}
            {currentEventTheme === "halloween" && <span className="ml-2">🎃</span>}
            {currentEventTheme === "independence-day" && <span className="ml-2">🇮🇩</span>}
            {currentEventTheme === "earth-day" && <span className="ml-2">🌍</span>}
            {currentEventTheme === "mothers-day" && <span className="ml-2">💐</span>}
            {currentEventTheme === "fathers-day" && <span className="ml-2">👔</span>}
          </motion.p>

          {/* Name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-orbitron font-bold mb-6 gradient-text">
            Fikih Sulaiman Pratama
          </h1>

          {/* Typing Effect */}
          <div className="h-12 sm:h-16 md:h-20 mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-poppins font-semibold text-foreground">
              <span className="text-secondary">{displayedText}</span>
              <span className="animate-blink text-primary">|</span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-poppins text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            {t("hero.description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto font-poppins text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-primary hover:bg-primary/90 box-glow-hover group"
            >
              <Briefcase className="mr-2 group-hover:scale-110 transition-transform" />
              {t("nav.hireMe")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/cv-fikih-sulaiman-pratama.pdf';
                link.download = 'CV-Fikih-Sulaiman-Pratama.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full sm:w-auto font-poppins text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-primary text-primary hover:bg-primary/10 box-glow-hover group"
            >
              <Download className="mr-2 group-hover:scale-110 transition-transform" />
              {t("hero.downloadCV")}
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <a
          href="#about"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
