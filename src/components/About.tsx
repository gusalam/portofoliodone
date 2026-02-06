import { Code2, Zap, Users, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

const About = () => {
  const { t } = useLanguage();
  
  const values = [
    {
      icon: Code2,
      title: t("about.value.cleanCode"),
      description: t("about.value.cleanCodeDesc"),
    },
    {
      icon: Zap,
      title: t("about.value.innovation"),
      description: t("about.value.innovationDesc"),
    },
    {
      icon: Users,
      title: t("about.value.collaboration"),
      description: t("about.value.collaborationDesc"),
    },
    {
      icon: Target,
      title: t("about.value.goalOriented"),
      description: t("about.value.goalOrientedDesc"),
    },
  ];

  const timeline = [
    {
      year: "2024",
      title: t("about.timeline.2024.title"),
      description: t("about.timeline.2024.desc"),
    },
    {
      year: "2023",
      title: t("about.timeline.2023.title"),
      description: t("about.timeline.2023.desc"),
    },
    {
      year: "2022",
      title: t("about.timeline.2022.title"),
      description: t("about.timeline.2022.desc"),
    },
    {
      year: "2021",
      title: t("about.timeline.2021.title"),
      description: t("about.timeline.2021.desc"),
    },
  ];

  return (
     <section id="about" className="py-20 sm:py-24 lg:py-32 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold gradient-text mb-4">
            {t("about.title")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-poppins text-muted-foreground max-w-3xl mx-auto">
            {t("about.introText")}
          </p>
        </div>

        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
           <Card className="p-6 sm:p-8 md:p-10 bg-background border-border box-glow-hover">
            <p className="text-sm sm:text-base md:text-lg font-poppins text-foreground leading-relaxed mb-6">
              {t("about.bio1")}
            </p>
            <p className="text-sm sm:text-base md:text-lg font-poppins text-foreground leading-relaxed">
              {t("about.bio2")}
            </p>
          </Card>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {values.map((value, index) => (
            <Card
              key={index}
               className="p-6 bg-background border-border hover:border-primary/50 transition-all duration-300 box-glow-hover group text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex justify-center">
                 <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-orbitron font-semibold text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-sm font-poppins text-muted-foreground">
                {value.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-center gradient-text mb-10 sm:mb-12">
            {t("about.journey")}
          </h3>
          <div className="space-y-6 sm:space-y-8">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0">
                   <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-orbitron font-bold text-primary">
                      {item.year}
                    </span>
                  </div>
                </div>
                 <Card className="flex-1 p-4 sm:p-6 bg-background border-border hover:border-primary/50 transition-all duration-300 box-glow-hover">
                  <h4 className="text-lg sm:text-xl font-orbitron font-semibold text-foreground mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm sm:text-base font-poppins text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
