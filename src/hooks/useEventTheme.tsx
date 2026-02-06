import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import {
  isRamadan,
  isEidAlFitr,
  isEidAlAdha,
  isMaulidNabi,
  isIsraMiraj,
  isIslamicNewYear,
} from "@/lib/hijriah";

// All event theme types
export type EventThemeType =
  // Default
  | "default"
  // Islamic Events
  | "ramadan"
  | "eid-fitr"
  | "eid-adha"
  | "maulid-nabi"
  | "isra-miraj"
  | "islamic-new-year"
  // Indonesian National Events
  | "independence-day"
  | "heroes-day"
  | "kartini-day"
  | "youth-pledge"
  | "education-day"
  | "pancasila-day"
  | "batik-day"
  // Global Events
  | "new-year"
  | "labor-day"
  | "environment-day"
  | "valentine"
  | "halloween"
  | "christmas"
  | "earth-day"
  | "mothers-day"
  | "fathers-day";

// Priority levels (higher = more important)
export const EVENT_PRIORITY: Record<EventThemeType, number> = {
  // Event Besar (highest priority)
  "new-year": 100,
  "independence-day": 100,
  "ramadan": 95,
  "eid-fitr": 100,
  "eid-adha": 95,
  "christmas": 90,
  
  // Event Nasional / Islam
  "heroes-day": 80,
  "maulid-nabi": 85,
  "isra-miraj": 85,
  "islamic-new-year": 80,
  "kartini-day": 75,
  "youth-pledge": 75,
  "education-day": 70,
  "pancasila-day": 75,
  "batik-day": 70,
  
  // Global Events
  "labor-day": 60,
  "environment-day": 60,
  "valentine": 85,
  "halloween": 85,
  "earth-day": 65,
  "mothers-day": 70,
  "fathers-day": 70,
  
  // Default (lowest)
  "default": 0,
};

// Theme metadata
export interface EventThemeInfo {
  id: EventThemeType;
  name: string;
  nameId: string;
  description: string;
  greeting?: string;
  greetingId?: string;
  startDate?: string; // MM-DD format for fixed dates
  endDate?: string;   // MM-DD format for fixed dates
  isIslamicEvent?: boolean;
  priority: number;
}

// All event definitions
export const EVENT_THEMES: EventThemeInfo[] = [
  // Islamic Events (dynamic dates)
  {
    id: "ramadan",
    name: "Ramadan",
    nameId: "Ramadhan",
    description: "Holy month of fasting",
    greeting: "Ramadan Kareem",
    greetingId: "Selamat Menunaikan Ibadah Puasa",
    isIslamicEvent: true,
    priority: EVENT_PRIORITY["ramadan"],
  },
  {
    id: "eid-fitr",
    name: "Eid al-Fitr",
    nameId: "Idul Fitri",
    description: "Festival of breaking fast",
    greeting: "Eid Mubarak",
    greetingId: "Selamat Hari Raya Idul Fitri",
    isIslamicEvent: true,
    priority: EVENT_PRIORITY["eid-fitr"],
  },
  {
    id: "eid-adha",
    name: "Eid al-Adha",
    nameId: "Idul Adha",
    description: "Festival of sacrifice",
    greeting: "Eid al-Adha Mubarak",
    greetingId: "Selamat Hari Raya Idul Adha",
    isIslamicEvent: true,
    priority: EVENT_PRIORITY["eid-adha"],
  },
  {
    id: "maulid-nabi",
    name: "Maulid Nabi",
    nameId: "Maulid Nabi Muhammad SAW",
    description: "Prophet's birthday",
    greeting: "Maulid Nabi Mubarak",
    greetingId: "Selamat Memperingati Maulid Nabi",
    isIslamicEvent: true,
    priority: EVENT_PRIORITY["maulid-nabi"],
  },
  {
    id: "isra-miraj",
    name: "Isra Mi'raj",
    nameId: "Isra Mi'raj",
    description: "Night journey",
    greeting: "Commemorating Isra Mi'raj",
    greetingId: "Selamat Memperingati Isra Mi'raj",
    isIslamicEvent: true,
    priority: EVENT_PRIORITY["isra-miraj"],
  },
  {
    id: "islamic-new-year",
    name: "Islamic New Year",
    nameId: "Tahun Baru Hijriyah",
    description: "1 Muharram",
    greeting: "Happy Islamic New Year",
    greetingId: "Selamat Tahun Baru Hijriyah",
    isIslamicEvent: true,
    priority: EVENT_PRIORITY["islamic-new-year"],
  },
  
  // Indonesian National Events (fixed dates)
  {
    id: "independence-day",
    name: "Independence Day",
    nameId: "Hari Kemerdekaan RI",
    description: "17 August",
    greeting: "Happy Independence Day!",
    greetingId: "Dirgahayu Republik Indonesia!",
    startDate: "08-14",
    endDate: "08-20",
    priority: EVENT_PRIORITY["independence-day"],
  },
  {
    id: "heroes-day",
    name: "Heroes Day",
    nameId: "Hari Pahlawan",
    description: "10 November",
    greeting: "Commemorating Heroes Day",
    greetingId: "Selamat Hari Pahlawan",
    startDate: "11-09",
    endDate: "11-11",
    priority: EVENT_PRIORITY["heroes-day"],
  },
  {
    id: "kartini-day",
    name: "Kartini Day",
    nameId: "Hari Kartini",
    description: "21 April",
    greeting: "Happy Kartini Day",
    greetingId: "Selamat Hari Kartini",
    startDate: "04-20",
    endDate: "04-22",
    priority: EVENT_PRIORITY["kartini-day"],
  },
  {
    id: "youth-pledge",
    name: "Youth Pledge Day",
    nameId: "Hari Sumpah Pemuda",
    description: "28 October",
    greeting: "Happy Youth Pledge Day",
    greetingId: "Selamat Hari Sumpah Pemuda",
    startDate: "10-27",
    endDate: "10-29",
    priority: EVENT_PRIORITY["youth-pledge"],
  },
  {
    id: "education-day",
    name: "National Education Day",
    nameId: "Hari Pendidikan Nasional",
    description: "2 May",
    greeting: "Happy Education Day",
    greetingId: "Selamat Hari Pendidikan Nasional",
    startDate: "05-01",
    endDate: "05-03",
    priority: EVENT_PRIORITY["education-day"],
  },
  {
    id: "pancasila-day",
    name: "Pancasila Day",
    nameId: "Hari Lahir Pancasila",
    description: "1 June",
    greeting: "Happy Pancasila Day",
    greetingId: "Selamat Hari Lahir Pancasila",
    startDate: "05-31",
    endDate: "06-02",
    priority: EVENT_PRIORITY["pancasila-day"],
  },
  {
    id: "batik-day",
    name: "National Batik Day",
    nameId: "Hari Batik Nasional",
    description: "2 October",
    greeting: "Happy Batik Day",
    greetingId: "Selamat Hari Batik Nasional",
    startDate: "10-01",
    endDate: "10-03",
    priority: EVENT_PRIORITY["batik-day"],
  },
  
  // Global Events
  {
    id: "new-year",
    name: "New Year",
    nameId: "Tahun Baru",
    description: "1 January",
    greeting: "Happy New Year!",
    greetingId: "Selamat Tahun Baru!",
    startDate: "12-30",
    endDate: "01-03",
    priority: EVENT_PRIORITY["new-year"],
  },
  {
    id: "valentine",
    name: "Valentine's Day",
    nameId: "Hari Valentine",
    description: "14 February",
    greeting: "Happy Valentine's Day!",
    greetingId: "Selamat Hari Kasih Sayang!",
    startDate: "02-13",
    endDate: "02-15",
    priority: EVENT_PRIORITY["valentine"],
  },
  {
    id: "earth-day",
    name: "Earth Day",
    nameId: "Hari Bumi",
    description: "22 April",
    greeting: "Happy Earth Day",
    greetingId: "Selamat Hari Bumi",
    startDate: "04-21",
    endDate: "04-23",
    priority: EVENT_PRIORITY["earth-day"],
  },
  {
    id: "labor-day",
    name: "Labor Day",
    nameId: "Hari Buruh",
    description: "1 May",
    greeting: "Happy Labor Day",
    greetingId: "Selamat Hari Buruh",
    startDate: "04-30",
    endDate: "05-02",
    priority: EVENT_PRIORITY["labor-day"],
  },
  {
    id: "mothers-day",
    name: "Mother's Day",
    nameId: "Hari Ibu",
    description: "22 December (Indonesia)",
    greeting: "Happy Mother's Day!",
    greetingId: "Selamat Hari Ibu!",
    startDate: "12-21",
    endDate: "12-23",
    priority: EVENT_PRIORITY["mothers-day"],
  },
  {
    id: "fathers-day",
    name: "Father's Day",
    nameId: "Hari Ayah",
    description: "12 November (Indonesia)",
    greeting: "Happy Father's Day!",
    greetingId: "Selamat Hari Ayah!",
    startDate: "11-11",
    endDate: "11-13",
    priority: EVENT_PRIORITY["fathers-day"],
  },
  {
    id: "environment-day",
    name: "World Environment Day",
    nameId: "Hari Lingkungan Hidup",
    description: "5 June",
    greeting: "World Environment Day",
    greetingId: "Selamat Hari Lingkungan Hidup Sedunia",
    startDate: "06-04",
    endDate: "06-06",
    priority: EVENT_PRIORITY["environment-day"],
  },
  {
    id: "halloween",
    name: "Halloween",
    nameId: "Halloween",
    description: "31 October",
    greeting: "Happy Halloween!",
    greetingId: "Selamat Halloween!",
    startDate: "10-30",
    endDate: "11-01",
    priority: EVENT_PRIORITY["halloween"],
  },
  {
    id: "christmas",
    name: "Christmas",
    nameId: "Natal",
    description: "25 December",
    greeting: "Merry Christmas!",
    greetingId: "Selamat Hari Natal!",
    startDate: "12-23",
    endDate: "12-26",
    priority: EVENT_PRIORITY["christmas"],
  },
  
  // Default
  {
    id: "default",
    name: "Default",
    nameId: "Default",
    description: "Daily rainbow theme",
    priority: EVENT_PRIORITY["default"],
  },
];

// Check if date falls within event range
function isDateInRange(date: Date, startDate?: string, endDate?: string): boolean {
  if (!startDate || !endDate) return false;
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const currentDate = `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  
  // Handle year wrap-around (e.g., New Year: 12-30 to 01-03)
  if (startDate > endDate) {
    return currentDate >= startDate || currentDate <= endDate;
  }
  
  return currentDate >= startDate && currentDate <= endDate;
}

// Detect current active event
function detectCurrentEvent(date: Date = new Date()): EventThemeType {
  const activeEvents: { id: EventThemeType; priority: number }[] = [];
  
  // Check Islamic events
  if (isRamadan(date)) {
    activeEvents.push({ id: "ramadan", priority: EVENT_PRIORITY["ramadan"] });
  }
  if (isEidAlFitr(date)) {
    activeEvents.push({ id: "eid-fitr", priority: EVENT_PRIORITY["eid-fitr"] });
  }
  if (isEidAlAdha(date)) {
    activeEvents.push({ id: "eid-adha", priority: EVENT_PRIORITY["eid-adha"] });
  }
  if (isMaulidNabi(date)) {
    activeEvents.push({ id: "maulid-nabi", priority: EVENT_PRIORITY["maulid-nabi"] });
  }
  if (isIsraMiraj(date)) {
    activeEvents.push({ id: "isra-miraj", priority: EVENT_PRIORITY["isra-miraj"] });
  }
  if (isIslamicNewYear(date)) {
    activeEvents.push({ id: "islamic-new-year", priority: EVENT_PRIORITY["islamic-new-year"] });
  }
  
  // Check fixed date events
  for (const event of EVENT_THEMES) {
    if (event.startDate && event.endDate && isDateInRange(date, event.startDate, event.endDate)) {
      activeEvents.push({ id: event.id, priority: event.priority });
    }
  }
  
  // Return highest priority event or default
  if (activeEvents.length === 0) {
    return "default";
  }
  
  activeEvents.sort((a, b) => b.priority - a.priority);
  return activeEvents[0].id;
}

// Storage key
const EVENT_THEME_STORAGE_KEY = "event-theme-preference";
const AUTO_EVENT_KEY = "auto";

// Context type
interface EventThemeContextType {
  currentEventTheme: EventThemeType;
  eventInfo: EventThemeInfo | undefined;
  isAutoMode: boolean;
  setManualEventTheme: (theme: EventThemeType | null) => void;
  allEventThemes: EventThemeInfo[];
  detectedEvent: EventThemeType;
}

const EventThemeContext = createContext<EventThemeContextType | undefined>(undefined);

// Apply event theme CSS class
function applyEventThemeClass(theme: EventThemeType) {
  // Add transition class
  document.documentElement.classList.add("event-theme-transitioning");
  
  // Remove all event theme classes
  EVENT_THEMES.forEach((t) => {
    document.documentElement.classList.remove(`event-${t.id}`);
  });
  
  // Add current event theme class
  document.documentElement.classList.add(`event-${theme}`);
  
  // Remove transition class after animation
  setTimeout(() => {
    document.documentElement.classList.remove("event-theme-transitioning");
  }, 500);
}

// Provider component
export const EventThemeProvider = ({ children }: { children: ReactNode }) => {
  const [detectedEvent, setDetectedEvent] = useState<EventThemeType>(() => 
    detectCurrentEvent()
  );
  
  const [currentEventTheme, setCurrentEventTheme] = useState<EventThemeType>(() => {
    try {
      const saved = localStorage.getItem(EVENT_THEME_STORAGE_KEY);
      if (saved && saved !== AUTO_EVENT_KEY) {
        return saved as EventThemeType;
      }
    } catch {}
    return detectCurrentEvent();
  });
  
  const [isAutoMode, setIsAutoMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(EVENT_THEME_STORAGE_KEY);
      return !saved || saved === AUTO_EVENT_KEY;
    } catch {
      return true;
    }
  });
  
  // Get event info
  const eventInfo = useMemo(() => 
    EVENT_THEMES.find((e) => e.id === currentEventTheme),
    [currentEventTheme]
  );
  
  // Apply theme on mount and change
  useEffect(() => {
    applyEventThemeClass(currentEventTheme);
  }, [currentEventTheme]);
  
  // Check for event changes periodically (every minute)
  useEffect(() => {
    const checkEvents = () => {
      const detected = detectCurrentEvent();
      setDetectedEvent(detected);
      
      if (isAutoMode) {
        setCurrentEventTheme(detected);
      }
    };
    
    const interval = setInterval(checkEvents, 60000);
    return () => clearInterval(interval);
  }, [isAutoMode]);
  
  // Set manual theme override
  const setManualEventTheme = useCallback((theme: EventThemeType | null) => {
    try {
      if (theme === null) {
        localStorage.setItem(EVENT_THEME_STORAGE_KEY, AUTO_EVENT_KEY);
        setIsAutoMode(true);
        setCurrentEventTheme(detectCurrentEvent());
      } else {
        localStorage.setItem(EVENT_THEME_STORAGE_KEY, theme);
        setIsAutoMode(false);
        setCurrentEventTheme(theme);
      }
    } catch (error) {
      console.error("Error saving event theme preference:", error);
    }
  }, []);
  
  const value: EventThemeContextType = {
    currentEventTheme,
    eventInfo,
    isAutoMode,
    setManualEventTheme,
    allEventThemes: EVENT_THEMES,
    detectedEvent,
  };
  
  return (
    <EventThemeContext.Provider value={value}>
      {children}
    </EventThemeContext.Provider>
  );
};

// Hook to use event theme context
export const useEventTheme = (): EventThemeContextType => {
  const context = useContext(EventThemeContext);
  if (context === undefined) {
    throw new Error("useEventTheme must be used within an EventThemeProvider");
  }
  return context;
};

export default useEventTheme;
