import { Download, Award, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import certDicoding from "@/assets/cert-dicoding.jpg";
import certGoogleCloud from "@/assets/cert-google-cloud.jpg";
import certTensorflow from "@/assets/cert-tensorflow.jpg";
import certBlockchain from "@/assets/cert-blockchain.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Resume = () => {
  const { t } = useLanguage();
  
  const certificates = [
    {
      title: "Dicoding - Fullstack Web Developer",
      issuer: "Dicoding Indonesia",
      year: "2023",
      image: certDicoding,
    },
    {
      title: "Google Cloud - Associate Developer",
      issuer: "Google",
      year: "2023",
      image: certGoogleCloud,
    },
    {
      title: "TensorFlow Developer Certificate",
      issuer: "Google",
      year: "2024",
      image: certTensorflow,
    },
    {
      title: "Blockchain Developer",
      issuer: "Coursera",
      year: "2024",
      image: certBlockchain,
    },
  ];

  return (
    <section id="resume" className="py-20 bg-background relative overflow-hidden">
      {/* Background Effects */}
       <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-secondary/3 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
            {t("resume.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("resume.credentials")}
          </p>
        </div>

        {/* Download Resume Section */}
        <div className="max-w-4xl mx-auto mb-16">
           <Card className="bg-card border-border box-glow-hover overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="mb-6">
                 <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                   <Download className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold text-foreground mb-2">
                  {t("resume.download")}
                </h3>
                <p className="text-muted-foreground">
                  {t("resume.downloadDesc")}
                </p>
              </div>
              <Button
                size="lg"
                className="font-poppins bg-primary hover:bg-primary/90 box-glow-hover"
                onClick={() => window.open('#', '_blank')}
              >
                <Download className="mr-2 h-5 w-5" />
                {t("resume.downloadPDF")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        <div>
          <h3 className="text-3xl font-orbitron font-bold text-center gradient-text mb-12">
            {t("resume.professionalCert")}
          </h3>
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
              {certificates.map((cert, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <Card
                     className="bg-card border-border hover:border-primary/50 overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] box-glow-hover"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                       <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-50"></div>
                       <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full text-xs font-poppins font-semibold text-primary-foreground">
                        {cert.year}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-orbitron font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {cert.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Award className="w-4 h-4 mr-2 text-primary" />
                          {cert.issuer}
                        </div>
                        <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Resume;
