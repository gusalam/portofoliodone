import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";

const Skills = () => {
  const { t } = useLanguage();
  
  const skillCategories = [
    {
      category: t("skills.cat.frontend"),
      skills: [
        { name: "React & Next.js", level: 95 },
        { name: "Vue.js", level: 85 },
        { name: "TypeScript", level: 90 },
        { name: "Tailwind CSS", level: 95 },
      ],
    },
    {
      category: t("skills.cat.backend"),
      skills: [
        { name: "Node.js & Express", level: 90 },
        { name: "Supabase", level: 92 },
        { name: "Firebase", level: 88 },
        { name: "PostgreSQL", level: 85 },
      ],
    },
    {
      category: t("skills.cat.ai"),
      skills: [
        { name: "Python", level: 90 },
        { name: "TensorFlow", level: 85 },
        { name: "OpenAI API", level: 92 },
        { name: "Scikit-learn", level: 80 },
      ],
    },
    {
      category: t("skills.cat.web3"),
      skills: [
        { name: "Solidity", level: 85 },
        { name: "MetaMask Integration", level: 90 },
        { name: "Smart Contracts", level: 82 },
        { name: "Web3.js", level: 85 },
      ],
    },
    {
      category: t("skills.cat.mobile"),
      skills: [
        { name: "Flutter", level: 88 },
        { name: "React Native", level: 85 },
        { name: "Dart", level: 87 },
        { name: "Mobile UI/UX", level: 90 },
      ],
    },
    {
      category: t("skills.cat.iot"),
      skills: [
        { name: "ESP8266/ESP32", level: 90 },
        { name: "Arduino", level: 92 },
        { name: "CTBot (Telegram)", level: 88 },
        { name: "Sensor Integration", level: 85 },
      ],
    },
    {
      category: t("skills.cat.design"),
      skills: [
        { name: "Figma", level: 92 },
        { name: "Adobe Photoshop", level: 85 },
        { name: "After Effects", level: 80 },
        { name: "UI/UX Design", level: 90 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 sm:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold gradient-text mb-4">
            {t("skills.title")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-poppins text-muted-foreground max-w-3xl mx-auto">
            {t("skills.comprehensive")}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <Card
              key={categoryIndex}
               className="p-6 sm:p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 box-glow-hover animate-fade-in"
              style={{ animationDelay: `${categoryIndex * 100}ms` }}
            >
               <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-primary mb-6">
                {category.category}
              </h3>
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-poppins font-medium text-foreground">
                        {skill.name}
                      </span>
                      <span className="text-sm font-poppins font-semibold text-primary">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress
                      value={skill.level}
                      className="h-2 bg-muted"
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Tech Stack Icons */}
        <div className="mt-16 sm:mt-20">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-center gradient-text mb-8 sm:mb-10">
            {t("skills.techWork")}
          </h3>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {[
              "React",
              "Next.js",
              "Vue.js",
              "Node.js",
              "Python",
              "TensorFlow",
              "Flutter",
              "Solidity",
              "Supabase",
              "Firebase",
              "PostgreSQL",
              "Arduino",
              "ESP8266",
              "Figma",
              "Tailwind",
            ].map((tech, index) => (
              <div
                key={index}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 border border-primary/30 rounded-lg font-poppins text-xs sm:text-sm font-medium text-primary hover:bg-primary/20 hover:scale-105 transition-all duration-300 box-glow-hover cursor-default"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
