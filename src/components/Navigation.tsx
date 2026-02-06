import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSelector from "@/components/ThemeSelector";
import EventThemeSelector from "@/components/EventThemeSelector";
import LanguageToggle from "@/components/LanguageToggle";
import PerformanceIndicator from "@/components/PerformanceIndicator";
import { useLanguage } from "@/hooks/useLanguage";

const Navigation = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.portfolio"), href: "#portfolio" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.resume"), href: "#resume" },
    { label: t("nav.blog"), href: "#blog" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <nav
       className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background border-b border-border"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#home"
            className="text-xl sm:text-2xl font-orbitron font-bold gradient-text hover:scale-105 transition-transform"
          >
            Tretan Developer
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 lg:px-4 py-2 text-sm lg:text-base font-poppins text-foreground hover:text-primary transition-colors relative group"
              >
                {item.label}
                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <LanguageToggle />
            <PerformanceIndicator />
            <EventThemeSelector />
            <ThemeSelector />
            <Button
              variant="default"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="ml-4 font-poppins box-glow-hover bg-primary hover:bg-primary/90"
            >
              {t("nav.hireMe")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-sm font-poppins text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="px-4 pt-2">
              <Button
                variant="default"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full font-poppins box-glow-hover bg-primary hover:bg-primary/90"
              >
                {t("nav.hireMe")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
