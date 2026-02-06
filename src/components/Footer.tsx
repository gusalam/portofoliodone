import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsUpdating(true);
      setCurrentTime(new Date());
      setTimeout(() => setIsUpdating(false), 300);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', options);
  };

  return (
     <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright with Real-time Date */}
          <div className="text-sm font-poppins text-muted-foreground text-center md:text-left space-y-1">
            <p>© {currentTime.getFullYear()} Fikih Sulaiman Pratama. {t("footer.rights")}</p>
            <p className={`text-xs text-primary/80 transition-all duration-300 ${isUpdating ? 'scale-105 text-primary' : ''}`}>
              {formatDate(currentTime)}
            </p>
          </div>


          {/* Quick Links */}
          <div className="flex gap-6">
            <a
              href="#home"
              className="text-sm font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.home")}
            </a>
            <a
              href="#portfolio"
              className="text-sm font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.portfolio")}
            </a>
            <a
              href="#contact"
              className="text-sm font-poppins text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.contact")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
