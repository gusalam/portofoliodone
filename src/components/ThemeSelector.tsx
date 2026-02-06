 import { Check, Palette, RotateCcw } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { useDayTheme, DayTheme, themeNames } from "@/hooks/useDayTheme";
 
 const ThemeSelector = () => {
   const { currentTheme, isAutoMode, setManualTheme, allThemes } = useDayTheme();
 
  const themeColors: Record<DayTheme, string> = {
    monday: "bg-[#EF4444]",
    tuesday: "bg-[#F97316]",
    wednesday: "bg-[#EAB308]",
    thursday: "bg-[#22C55E]",
    friday: "bg-[#3B82F6]",
    saturday: "bg-[#6366F1]",
    sunday: "bg-[#A855F7]",
  };
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button
           variant="ghost"
           size="icon"
           className="relative overflow-hidden group box-glow-hover"
           aria-label="Select theme"
         >
           <Palette className="h-5 w-5" />
           <span
             className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${themeColors[currentTheme]} ring-1 ring-background`}
           />
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end" className="w-56">
         <DropdownMenuLabel className="flex items-center justify-between">
           <span>Pilih Tema</span>
           {isAutoMode && (
             <span className="text-xs text-muted-foreground font-normal">
               (Otomatis)
             </span>
           )}
         </DropdownMenuLabel>
         <DropdownMenuSeparator />
         
         {/* Auto Mode Option */}
         <DropdownMenuItem
           onClick={() => setManualTheme(null)}
           className="flex items-center justify-between cursor-pointer"
         >
           <div className="flex items-center gap-2">
             <RotateCcw className="h-4 w-4" />
             <span>Otomatis (Sesuai Hari)</span>
           </div>
           {isAutoMode && <Check className="h-4 w-4 text-primary" />}
         </DropdownMenuItem>
         
         <DropdownMenuSeparator />
         
         {/* Manual Theme Options */}
         {allThemes.map((theme) => (
           <DropdownMenuItem
             key={theme}
             onClick={() => setManualTheme(theme)}
             className="flex items-center justify-between cursor-pointer"
           >
             <div className="flex items-center gap-2">
               <span
                 className={`w-3 h-3 rounded-full ${themeColors[theme]}`}
               />
               <span className="capitalize">{theme}</span>
               <span className="text-xs text-muted-foreground">
                 ({themeNames[theme]})
               </span>
             </div>
             {!isAutoMode && currentTheme === theme && (
               <Check className="h-4 w-4 text-primary" />
             )}
           </DropdownMenuItem>
         ))}
       </DropdownMenuContent>
     </DropdownMenu>
   );
 };
 
 export default ThemeSelector;