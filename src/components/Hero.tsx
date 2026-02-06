import { useEffect, useState, useMemo } from "react";
import { ArrowDown, Download, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useEventTheme, EventThemeType } from "@/hooks/useEventTheme";
import { usePerformance } from "@/hooks/usePerformance";
import EventHeroBackground from "./EventHeroBackground";

const Hero = () => {
  const { t, language } = useLanguage();
  const { currentEventTheme, eventInfo } = useEventTheme();
  const { shouldReduceAnimations } = usePerformance();
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

  // Get event-specific greeting with year for New Year
  const getEventGreeting = () => {
    if (currentEventTheme === "default" || !eventInfo?.greeting) {
      return t("hero.greeting");
    }
    
    // Special handling for New Year - show the year
    if (currentEventTheme === "new-year") {
      const year = new Date().getFullYear();
      if (language === "id") {
        return `Selamat Tahun Baru ${year}`;
      }
      return `Happy New Year ${year}`;
    }
    
    return language === "id" ? (eventInfo.greetingId || eventInfo.greeting) : eventInfo.greeting;
  };

  // Check if current theme is an Islamic event
  const isIslamicTheme = ["ramadan", "eid-fitr", "eid-adha", "maulid-nabi", "isra-miraj", "islamic-new-year"].includes(currentEventTheme);
  
  // Check if current theme is a celebration event
  const isCelebrationTheme = ["new-year", "independence-day", "valentine", "christmas", "halloween", "eid-fitr"].includes(currentEventTheme);

  // Get event-specific icon
  const getEventIcon = () => {
    switch (currentEventTheme) {
      case "ramadan":
      case "eid-fitr":
      case "eid-adha":
      case "maulid-nabi":
      case "isra-miraj":
      case "islamic-new-year":
        return "☪";
      case "christmas":
        return "🎄";
      case "new-year":
        return "🎆";
      case "valentine":
        return "💕";
      case "halloween":
        return "🎃";
      case "independence-day":
        return "🇮🇩";
      case "earth-day":
      case "environment-day":
        return "🌍";
      case "mothers-day":
        return "💐";
      case "fathers-day":
        return "👔";
      case "heroes-day":
        return "🎖️";
      case "kartini-day":
        return "🌸";
      case "youth-pledge":
        return "✊";
      case "labor-day":
        return "⚒️";
      default:
        return null;
    }
  };

  // Get button styles based on event
  const getButtonStyles = useMemo(() => {
    const isEventActive = currentEventTheme !== "default";
    
    if (currentEventTheme === "independence-day") {
      return {
        primary: "bg-red-600 hover:bg-red-700 text-white border-red-600",
        secondary: "border-white text-white hover:bg-white/20",
      };
    }
    
    if (currentEventTheme === "new-year") {
      return {
        primary: "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black border-amber-500",
        secondary: "border-amber-400 text-amber-300 hover:bg-amber-400/20",
      };
    }
    
    if (isIslamicTheme) {
      return {
        primary: "bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white border-emerald-600",
        secondary: "border-emerald-400 text-emerald-300 hover:bg-emerald-400/20",
      };
    }
    
    if (currentEventTheme === "christmas") {
      return {
        primary: "bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white border-red-600",
        secondary: "border-white text-white hover:bg-white/20",
      };
    }
    
    if (currentEventTheme === "valentine" || currentEventTheme === "mothers-day") {
      return {
        primary: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-pink-500",
        secondary: "border-pink-400 text-pink-300 hover:bg-pink-400/20",
      };
    }
    
    // Default styles
    return {
      primary: "bg-primary hover:bg-primary/90",
      secondary: "border-primary text-primary hover:bg-primary/10",
    };
  }, [currentEventTheme, isIslamicTheme]);

  const eventIcon = getEventIcon();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Event-Aware Background */}
      <EventHeroBackground 
        onVideoLoaded={() => setVideoLoaded(true)}
      />

      {/* Animated Grid - only in default mode */}
      {currentEventTheme === "default" && !shouldReduceAnimations && (
        <div className="absolute inset-0 z-[1] opacity-10">
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
            className={`text-base sm:text-lg md:text-xl font-poppins font-medium mb-4 ${
              isCelebrationTheme && !shouldReduceAnimations ? "animate-pulse" : ""
            } ${
              currentEventTheme === "independence-day" 
                ? "text-white drop-shadow-lg" 
                : currentEventTheme === "new-year"
                ? "text-amber-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                : isIslamicTheme
                ? "text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                : "text-primary"
            }`}
          >
            {getEventGreeting()}
            {eventIcon && <span className="ml-2">{eventIcon}</span>}
          </motion.p>

          {/* Name with event-specific styling */}
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-orbitron font-bold mb-6 ${
              currentEventTheme === "independence-day"
                ? "text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.3)]"
                : currentEventTheme === "new-year"
                ? "bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                : isIslamicTheme
                ? "bg-gradient-to-r from-emerald-300 via-green-200 to-lime-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                : currentEventTheme === "christmas"
                ? "bg-gradient-to-r from-red-400 via-white to-green-400 bg-clip-text text-transparent"
                : currentEventTheme === "valentine" || currentEventTheme === "mothers-day"
                ? "bg-gradient-to-r from-pink-300 via-rose-200 to-pink-400 bg-clip-text text-transparent"
                : "gradient-text"
            }`}
          >
            Fikih Sulaiman Pratama
          </h1>

          {/* Typing Effect */}
          <div className="h-12 sm:h-16 md:h-20 mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-poppins font-semibold text-foreground">
              <span className={`${
                currentEventTheme === "independence-day"
                  ? "text-white"
                  : currentEventTheme === "new-year"
                  ? "text-amber-200"
                  : isIslamicTheme
                  ? "text-emerald-200"
                  : "text-secondary"
              }`}>{displayedText}</span>
              <span className={`animate-blink ${
                currentEventTheme === "new-year"
                  ? "text-amber-400"
                  : isIslamicTheme
                  ? "text-emerald-400"
                  : "text-primary"
              }`}>|</span>
            </h2>
          </div>

          {/* Description */}
          <p className={`text-sm sm:text-base md:text-lg lg:text-xl font-poppins max-w-3xl mx-auto mb-12 leading-relaxed ${
            currentEventTheme === "independence-day"
              ? "text-white/90"
              : currentEventTheme === "new-year"
              ? "text-amber-100/80"
              : isIslamicTheme
              ? "text-emerald-100/80"
              : "text-muted-foreground"
          }`}>
            {t("hero.description")}
          </p>

          {/* CTA Buttons with event-specific styling */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full sm:w-auto font-poppins text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 box-glow-hover group transition-all duration-300 ${getButtonStyles.primary}`}
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
              className={`w-full sm:w-auto font-poppins text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 box-glow-hover group transition-all duration-300 ${getButtonStyles.secondary}`}
            >
              <Download className="mr-2 group-hover:scale-110 transition-transform" />
              {t("hero.downloadCV")}
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <a
          href="#about"
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce ${
            currentEventTheme === "independence-day"
              ? "text-white"
              : currentEventTheme === "new-year"
              ? "text-amber-400"
              : isIslamicTheme
              ? "text-emerald-400"
              : "text-primary"
          }`}
        >
          <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
