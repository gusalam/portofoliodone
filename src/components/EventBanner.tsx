import { motion, AnimatePresence } from "framer-motion";
import { useEventTheme } from "@/hooks/useEventTheme";
import { useLanguage } from "@/hooks/useLanguage";

interface EventBannerProps {
  showBanner?: boolean;
}

const EventBanner = ({ showBanner = true }: EventBannerProps) => {
  const { currentEventTheme, eventInfo } = useEventTheme();
  const { language } = useLanguage();

  // Don't show banner for default theme
  if (!showBanner || currentEventTheme === "default" || !eventInfo) {
    return null;
  }

  const greeting = language === "id" ? eventInfo.greetingId : eventInfo.greeting;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-16 sm:top-20 left-0 right-0 z-40 flex justify-center pointer-events-none"
      >
        <motion.div
          className="mx-4 px-6 py-3 rounded-full bg-card/90 backdrop-blur-sm border border-primary/30 shadow-lg"
          style={{
            boxShadow: "var(--event-glow)",
          }}
          animate={{
            boxShadow: [
              "var(--event-glow)",
              "0 0 35px hsl(var(--primary) / 0.5)",
              "var(--event-glow)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <p className="text-sm sm:text-base font-medium text-center gradient-text">
            {greeting}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventBanner;
