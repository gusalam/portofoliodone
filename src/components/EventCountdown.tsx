import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X } from "lucide-react";
import { useEventTheme, EventThemeType, EVENT_THEMES } from "@/hooks/useEventTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { gregorianToHijriah } from "@/lib/hijriah";

// Events that should show countdown
const COUNTDOWN_EVENTS: EventThemeType[] = [
  "new-year",
  "ramadan",
  "eid-fitr",
  "eid-adha",
  "independence-day",
  "christmas",
];

// Days before event to show countdown
const COUNTDOWN_DAYS_BEFORE = 7;

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Get next occurrence of an event
function getNextEventDate(eventType: EventThemeType): Date | null {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Fixed date events
  const fixedDates: Partial<Record<EventThemeType, string>> = {
    "new-year": `${currentYear + 1}-01-01`,
    "independence-day": `${currentYear}-08-17`,
    "christmas": `${currentYear}-12-25`,
  };

  if (fixedDates[eventType]) {
    const eventDate = new Date(fixedDates[eventType]!);
    if (eventDate < now) {
      // Event has passed this year, get next year's date
      eventDate.setFullYear(currentYear + 1);
    }
    return eventDate;
  }

  // Islamic events - approximate based on current Hijri date
  // These would ideally use a proper Hijri calendar library for accuracy
  const hijri = gregorianToHijriah(now);
  
  // Approximate dates for Islamic events in 2025
  const islamicDates: Partial<Record<EventThemeType, string>> = {
    "ramadan": "2025-02-28", // Approximate start of Ramadan 1446H
    "eid-fitr": "2025-03-30", // Approximate Eid al-Fitr 1446H
    "eid-adha": "2025-06-06", // Approximate Eid al-Adha 1446H
  };

  if (islamicDates[eventType]) {
    const eventDate = new Date(islamicDates[eventType]!);
    if (eventDate < now) {
      // Event has passed, add approximately 354 days for next Islamic year
      eventDate.setDate(eventDate.getDate() + 354);
    }
    return eventDate;
  }

  return null;
}

// Calculate time remaining
function calculateTimeRemaining(targetDate: Date): CountdownTime {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

// Find upcoming event within countdown window
function getUpcomingEvent(): { eventType: EventThemeType; date: Date } | null {
  const now = new Date();

  for (const eventType of COUNTDOWN_EVENTS) {
    const eventDate = getNextEventDate(eventType);
    if (!eventDate) continue;

    const daysUntil = Math.floor(
      (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil >= 0 && daysUntil <= COUNTDOWN_DAYS_BEFORE) {
      return { eventType, date: eventDate };
    }
  }

  return null;
}

const CountdownUnit = ({
  value,
  label,
  isLast,
}: {
  value: number;
  label: string;
  isLast?: boolean;
}) => (
  <div className="flex flex-col items-center">
    <motion.div
      key={value}
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-background/80 backdrop-blur-sm border border-primary/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[50px] sm:min-w-[70px]"
    >
      <span className="text-xl sm:text-3xl font-orbitron font-bold text-primary">
        {String(value).padStart(2, "0")}
      </span>
    </motion.div>
    <span className="text-xs sm:text-sm text-muted-foreground mt-1 font-poppins">
      {label}
    </span>
    {!isLast && (
      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl sm:text-2xl text-primary/50 hidden sm:block">
        :
      </span>
    )}
  </div>
);

const EventCountdown = () => {
  const { language } = useLanguage();
  const { currentEventTheme } = useEventTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [countdown, setCountdown] = useState<CountdownTime | null>(null);
  const [upcomingEvent, setUpcomingEvent] = useState<{
    eventType: EventThemeType;
    date: Date;
  } | null>(null);

  // Check for upcoming event on mount and periodically
  useEffect(() => {
    const checkEvent = () => {
      const event = getUpcomingEvent();
      setUpcomingEvent(event);

      // Check if user has dismissed this specific event
      if (event) {
        const dismissedKey = `countdown-dismissed-${event.eventType}-${event.date.toISOString().split("T")[0]}`;
        const wasDismissed = localStorage.getItem(dismissedKey) === "true";
        setIsDismissed(wasDismissed);
      }
    };

    checkEvent();
    const interval = setInterval(checkEvent, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Update countdown every second
  useEffect(() => {
    if (!upcomingEvent) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const time = calculateTimeRemaining(upcomingEvent.date);
      setCountdown(time);

      // Hide countdown when event starts
      if (
        time.days === 0 &&
        time.hours === 0 &&
        time.minutes === 0 &&
        time.seconds === 0
      ) {
        setIsVisible(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [upcomingEvent]);

  // Get event info
  const eventInfo = useMemo(() => {
    if (!upcomingEvent) return null;
    return EVENT_THEMES.find((e) => e.id === upcomingEvent.eventType);
  }, [upcomingEvent]);

  // Handle dismiss
  const handleDismiss = () => {
    if (upcomingEvent) {
      const dismissedKey = `countdown-dismissed-${upcomingEvent.eventType}-${upcomingEvent.date.toISOString().split("T")[0]}`;
      localStorage.setItem(dismissedKey, "true");
    }
    setIsDismissed(true);
  };

  // Don't show if no upcoming event, dismissed, or already in event theme
  if (
    !upcomingEvent ||
    !countdown ||
    isDismissed ||
    !isVisible ||
    currentEventTheme === upcomingEvent.eventType
  ) {
    return null;
  }

  const labels = language === "id" 
    ? { days: "Hari", hours: "Jam", minutes: "Menit", seconds: "Detik" }
    : { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4"
      >
        <div className="bg-background/95 backdrop-blur-md border border-primary/30 rounded-2xl p-4 sm:p-6 shadow-lg shadow-primary/10">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss countdown"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Event name */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-sm sm:text-base font-poppins font-medium text-foreground">
              {language === "id"
                ? `Menuju ${eventInfo?.nameId || eventInfo?.name}`
                : `Counting down to ${eventInfo?.name}`}
            </span>
          </div>

          {/* Countdown units */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <CountdownUnit value={countdown.days} label={labels.days} />
            <span className="text-xl sm:text-2xl text-primary/50 mt-[-20px]">:</span>
            <CountdownUnit value={countdown.hours} label={labels.hours} />
            <span className="text-xl sm:text-2xl text-primary/50 mt-[-20px]">:</span>
            <CountdownUnit value={countdown.minutes} label={labels.minutes} />
            <span className="text-xl sm:text-2xl text-primary/50 mt-[-20px]">:</span>
            <CountdownUnit value={countdown.seconds} label={labels.seconds} isLast />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventCountdown;
