import { useEffect, useState, useRef, lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Skills from "@/components/Skills";
import Resume from "@/components/Resume";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import AdvancedMusicPlayer, { AdvancedMusicPlayerRef } from "@/components/AdvancedMusicPlayer";
import MatrixBackground from "@/components/MatrixBackground";
import WelcomeModal from "@/components/WelcomeModal";
import EventBanner from "@/components/EventBanner";

import { DayThemeProvider } from "@/hooks/useDayTheme";
import { EventThemeProvider, useEventTheme } from "@/hooks/useEventTheme";
import { PerformanceProvider } from "@/hooks/usePerformance";

// Lazy load event ornaments for performance
const EventOrnaments = lazy(() => import("@/components/event-ornaments/EventOrnaments"));

const IndexContent = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const musicPlayerRef = useRef<AdvancedMusicPlayerRef>(null);
  const { currentEventTheme } = useEventTheme();

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");
  }, []);

  const handleAcceptMusic = () => {
    setShowWelcomeModal(false);
    musicPlayerRef.current?.play();
  };

  const handleDeclineMusic = () => {
    setShowLockedMessage(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Solid background layer */}
      <div className="fixed inset-0 z-0 bg-background" />
      <MatrixBackground />
      
      {/* Event Ornaments - Lazy loaded */}
      <Suspense fallback={null}>
        <EventOrnaments />
      </Suspense>
      
      <WelcomeModal
        open={showWelcomeModal || showLockedMessage}
        onAccept={handleAcceptMusic}
        onDecline={handleDeclineMusic}
        showLockedMessage={showLockedMessage}
      />
      
      {!showWelcomeModal && !showLockedMessage && (
        <>
          <LoadingScreen />
          <Navigation />
          <EventBanner />
          
          <main className="relative z-10 bg-transparent">
            <Hero />
            <About />
            <Portfolio />
            <Skills />
            <Resume />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </>
      )}
      <AdvancedMusicPlayer ref={musicPlayerRef} />
    </div>
  );
};

const Index = () => {
  return (
    <PerformanceProvider>
      <DayThemeProvider>
        <EventThemeProvider>
          <IndexContent />
        </EventThemeProvider>
      </DayThemeProvider>
    </PerformanceProvider>
  );
};

export default Index;
