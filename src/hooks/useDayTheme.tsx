 import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from "react";

 export type DayTheme = 
  | "monday" 
  | "tuesday" 
  | "wednesday" 
  | "thursday" 
  | "friday" 
  | "saturday" 
  | "sunday";

 export const dayThemes: Record<number, DayTheme> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export const themeNames: Record<DayTheme, string> = {
  monday: "Merah",
  tuesday: "Jingga",
  wednesday: "Kuning",
  thursday: "Hijau",
  friday: "Biru",
  saturday: "Nila",
  sunday: "Ungu",
};

 const THEME_STORAGE_KEY = "user-theme-preference";
 const AUTO_THEME_KEY = "auto";
 
 const getCurrentDayTheme = (): DayTheme => {
   const today = new Date().getDay();
   return dayThemes[today] || "wednesday";
 };
 
 const applyThemeClass = (theme: DayTheme) => {
   // Add transition class for dramatic fade effect
   document.documentElement.classList.add('theme-transitioning');
   
   // Remove all day theme classes
   document.documentElement.classList.remove(
     "theme-monday",
     "theme-tuesday",
     "theme-wednesday",
     "theme-thursday",
     "theme-friday",
     "theme-saturday",
     "theme-sunday"
   );
   
   // Add current theme class
   document.documentElement.classList.add(`theme-${theme}`);
   
   // Remove transition class after animation
   setTimeout(() => {
     document.documentElement.classList.remove('theme-transitioning');
   }, 350);
 };
 
 // Context types
 interface ThemeContextType {
   currentTheme: DayTheme;
   themeName: string;
   isAutoMode: boolean;
   setManualTheme: (theme: DayTheme | null) => void;
   allThemes: DayTheme[];
   themeNames: Record<DayTheme, string>;
 }

 const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
 
 // Provider component
 export const DayThemeProvider = ({ children }: { children: ReactNode }) => {
   const [currentTheme, setCurrentTheme] = useState<DayTheme>(() => {
     try {
       const saved = localStorage.getItem(THEME_STORAGE_KEY);
       if (saved && saved !== AUTO_THEME_KEY && Object.values(dayThemes).includes(saved as DayTheme)) {
         return saved as DayTheme;
       }
     } catch {}
     return getCurrentDayTheme();
   });
   
   const [isAutoMode, setIsAutoMode] = useState<boolean>(() => {
     try {
       const saved = localStorage.getItem(THEME_STORAGE_KEY);
       return !saved || saved === AUTO_THEME_KEY;
     } catch {
       return true;
     }
   });
   
   const [lastCheckedDay, setLastCheckedDay] = useState<number>(() => new Date().getDay());
 
   // Apply theme on mount and when it changes
   useEffect(() => {
     try {
       applyThemeClass(currentTheme);
     } catch (error) {
       console.error("Error applying theme:", error);
       applyThemeClass("wednesday");
     }
   }, [currentTheme]);

   // Check for day change periodically (every 30 seconds)
   useEffect(() => {
     if (!isAutoMode) return;
 
    const interval = setInterval(() => {
       try {
         const currentDay = new Date().getDay();
         
         // Only update if day has actually changed
         if (currentDay !== lastCheckedDay) {
           setLastCheckedDay(currentDay);
           const newTheme = dayThemes[currentDay] || "wednesday";
           setCurrentTheme(newTheme);
         }
       } catch (error) {
         console.error("Error checking day change:", error);
      }
     }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
   }, [isAutoMode, lastCheckedDay]);

   // Set manual theme override
   const setManualTheme = useCallback((theme: DayTheme | null) => {
     try {
       if (theme === null) {
         // Switch back to auto mode
         localStorage.setItem(THEME_STORAGE_KEY, AUTO_THEME_KEY);
         setIsAutoMode(true);
         const dayTheme = getCurrentDayTheme();
         setCurrentTheme(dayTheme);
       } else {
         // Set manual override
         localStorage.setItem(THEME_STORAGE_KEY, theme);
         setIsAutoMode(false);
         setCurrentTheme(theme);
       }
     } catch (error) {
       console.error("Error saving theme preference:", error);
     }
   }, []);
 
   const value: ThemeContextType = {
     currentTheme,
     themeName: themeNames[currentTheme],
     isAutoMode,
     setManualTheme,
     allThemes: Object.values(dayThemes) as DayTheme[],
     themeNames,
   };
 
   return (
     <ThemeContext.Provider value={value}>
       {children}
     </ThemeContext.Provider>
   );
};

 // Hook to use theme context
 export const useDayTheme = (): ThemeContextType => {
   const context = useContext(ThemeContext);
   if (context === undefined) {
     throw new Error("useDayTheme must be used within a DayThemeProvider");
   }
   return context;
 };
 
export default useDayTheme;
