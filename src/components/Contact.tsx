import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.phone"),
      value: "+62 813-3557-8916",
      link: "https://wa.me/6281335578916",
    },
    {
      icon: Mail,
      title: t("contact.email"),
      value: "fikihcullez17@gmail.com",
      link: "mailto:fikihcullez17@gmail.com",
    },
    {
      icon: MapPin,
      title: t("contact.location"),
      value: "Bangkalan, Indonesia",
      link: "https://www.google.com/maps/place/Bangkalan",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format message for WhatsApp
    const waMessage = `*Pesan dari Website Portfolio*%0A%0A*Nama:* ${encodeURIComponent(formData.name)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*Subjek:* ${encodeURIComponent(formData.subject)}%0A%0A*Pesan:*%0A${encodeURIComponent(formData.message)}`;
    
    // Open WhatsApp with the message
    const waUrl = `https://wa.me/6281335578916?text=${waMessage}`;
    window.open(waUrl, '_blank');
    
    toast.success(language === 'id' ? "Membuka WhatsApp..." : "Opening WhatsApp...");
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
     <section id="contact" className="py-20 sm:py-24 lg:py-32 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold gradient-text mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-poppins text-muted-foreground max-w-3xl mx-auto">
            {t("contact.haveProject")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
           <Card className="p-6 sm:p-8 bg-background border-border box-glow-hover">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-poppins font-medium text-foreground mb-2">
                  {t("contact.yourName")}
                </label>
                <Input
                  type="text"
                  placeholder={t("contact.yourName")}
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   className="bg-muted border-border focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-foreground mb-2">
                  {t("contact.emailAddress")}
                </label>
                <Input
                  type="email"
                  placeholder={t("contact.emailAddress")}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                   className="bg-muted border-border focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-foreground mb-2">
                  {t("contact.subject")}
                </label>
                <Input
                  type="text"
                  placeholder={t("contact.subject")}
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                   className="bg-muted border-border focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-poppins font-medium text-foreground mb-2">
                  {t("contact.message")}
                </label>
                <Textarea
                  placeholder={t("contact.tellProject")}
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                   className="bg-muted border-border focus:border-primary transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-poppins bg-primary hover:bg-primary/90 box-glow-hover group"
              >
                <Send className="mr-2 group-hover:translate-x-1 transition-transform" />
                {t("contact.send")}
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                   className="p-5 sm:p-6 bg-background border-border hover:border-primary/50 transition-all duration-300 box-glow-hover group"
                >
                  <a
                    href={info.link}
                    className="flex items-center gap-4"
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                     <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-poppins font-semibold text-muted-foreground mb-1">
                        {info.title}
                      </h3>
                      <p className="text-base sm:text-lg font-poppins font-medium text-foreground group-hover:text-primary transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </a>
                </Card>
              ))}
            </div>

            {/* Map */}
             <Card className="overflow-hidden bg-background border-border box-glow-hover">
              <div className="relative h-64 sm:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3957.8449645788805!2d112.76051207499805!3d-7.259219692757477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMTUnMzMuMiJTIDExMsKwNDUnNDcuNiJF!5e0!3m2!1sen!2sid!4v1736789012345!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
              </div>
            </Card>

            {/* Social Links */}
             <Card className="p-6 bg-background border-border box-glow-hover text-center">
              <h3 className="text-xl font-orbitron font-bold text-foreground mb-4">
                {t("contact.followMe")}
              </h3>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="font-poppins border-primary/30 text-foreground hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all"
                >
                  <a href="https://profile.indeed.com/p/fiqkihsulaimanp-wfzn1xg" target="_blank" rel="noopener noreferrer">
                    Indeed
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="font-poppins border-primary/30 text-foreground hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all"
                >
                  <a href="https://www.instagram.com/kih_s.kom?igsh=MW0wZTJ5M3VwbWJxcg==" target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="font-poppins border-primary/30 text-foreground hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all"
                >
                  <a href="https://github.com/fikih-hyperfanny" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="font-poppins border-primary/30 text-foreground hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all"
                >
                  <a href="https://x.com/FiqkihP20602" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
