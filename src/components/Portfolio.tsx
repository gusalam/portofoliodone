import { useState, useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Portfolio = () => {
  const { t, language } = useLanguage();
  
  const categories = [
    { key: "all", label: t("portfolio.cat.all") },
    { key: "web", label: t("portfolio.cat.web") },
    { key: "ai", label: t("portfolio.cat.ai") },
    { key: "mobile", label: t("portfolio.cat.mobile") },
    { key: "iot", label: t("portfolio.cat.iot") },
    { key: "web3", label: t("portfolio.cat.web3") },
    { key: "design", label: t("portfolio.cat.design") },
  ];
  
  const [activeCategory, setActiveCategory] = useState("all");

  const projects = language === "id"
    ? [
      {
        title: "Manajer Tugas Berbasis AI",
        description: "Pengelolaan tugas cerdas dengan saran AI dan optimasi prioritas",
        category: "ai",
        tech: ["React", "Python", "TensorFlow", "Supabase"],
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      },
      {
        title: "Dasbor DeFi",
        description: "Platform analitik keuangan terdesentralisasi dengan data real-time",
        category: "web3",
        tech: ["Next.js", "Solidity", "Web3.js", "MetaMask"],
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
      },
      {
        title: "Aplikasi Mobile E-Commerce",
        description: "Aplikasi belanja lengkap dengan integrasi pembayaran",
        category: "mobile",
        tech: ["Flutter", "Firebase", "Stripe", "Dart"],
        image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb",
      },
      {
        title: "Sistem IoT Smart Home",
        description: "Otomasi rumah dengan kontrol suara dan aplikasi mobile",
        category: "iot",
        tech: ["ESP8266", "Arduino", "MQTT", "React Native"],
        image: "https://images.unsplash.com/photo-1558002038-1055907df827",
      },
      {
        title: "Platform Analitik SaaS",
        description: "Dasbor business intelligence dengan metrik real-time",
        category: "web",
        tech: ["React", "Node.js", "PostgreSQL", "D3.js"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      },
      {
        title: "Sistem Identitas Merek",
        description: "Sistem desain lengkap untuk startup teknologi modern",
        category: "design",
        tech: ["Figma", "Adobe XD", "Photoshop", "After Effects"],
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
      },
    ]
    : [
      {
        title: "AI-Powered Task Manager",
        description: "Smart task management with AI suggestions and priority optimization",
        category: "ai",
        tech: ["React", "Python", "TensorFlow", "Supabase"],
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      },
      {
        title: "DeFi Dashboard",
        description: "Decentralized finance analytics platform with real-time data",
        category: "web3",
        tech: ["Next.js", "Solidity", "Web3.js", "MetaMask"],
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
      },
      {
        title: "E-Commerce Mobile App",
        description: "Full-featured shopping app with payment integration",
        category: "mobile",
        tech: ["Flutter", "Firebase", "Stripe", "Dart"],
        image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb",
      },
      {
        title: "Smart Home IoT System",
        description: "Home automation with voice control and mobile app",
        category: "iot",
        tech: ["ESP8266", "Arduino", "MQTT", "React Native"],
        image: "https://images.unsplash.com/photo-1558002038-1055907df827",
      },
      {
        title: "SaaS Analytics Platform",
        description: "Business intelligence dashboard with real-time metrics",
        category: "web",
        tech: ["React", "Node.js", "PostgreSQL", "D3.js"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      },
      {
        title: "Brand Identity System",
        description: "Complete design system for modern tech startup",
        category: "design",
        tech: ["Figma", "Adobe XD", "Photoshop", "After Effects"],
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
      },
    ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
     <section id="portfolio" className="py-20 sm:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold gradient-text mb-4">
            {t("portfolio.title")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-poppins text-muted-foreground max-w-3xl mx-auto">
            {t("portfolio.showcase")}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={activeCategory === category.key ? "default" : "outline"}
              className={`font-poppins text-xs sm:text-sm px-3 sm:px-4 py-2 transition-all duration-300 ${
                activeCategory === category.key
                   ? "bg-primary hover:bg-primary/90"
                  : "border-primary/30 text-foreground hover:border-primary/50 hover:bg-primary/10"
              }`}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Projects Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {filteredProjects.map((project, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card
                   className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 box-glow-hover animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Project Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <Button
                        size="icon"
                         className="bg-primary hover:bg-primary/90"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                         className="border-primary text-primary hover:bg-primary/10"
                      >
                        <Github className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-5 sm:p-6">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-poppins font-medium bg-primary/10 text-primary rounded-full border border-primary/30">
                        {t(`portfolio.cat.${project.category}`)}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-orbitron font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm font-poppins text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-xs font-poppins text-primary/80 bg-primary/5 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default Portfolio;
