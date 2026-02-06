import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.portfolio": "Portfolio",
    "nav.skills": "Skills",
    "nav.resume": "Resume",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.hireMe": "Hire Me",
    
    // Hero
    "hero.greeting": "Hi, I'm",
    "hero.role": "Full Stack Developer & UI/UX Designer",
    "hero.description": "Passionate about creating beautiful and functional web applications with modern technologies.",
    "hero.downloadCV": "Download CV",
    "hero.contactMe": "Contact Me",
    
    // About
    "about.title": "About Me",
    "about.subtitle": "Get to know me better",
    "about.intro": "Hello! I'm Fikih Sulaiman Pratama, a passionate Full Stack Developer and UI/UX Designer based in Indonesia.",
    "about.description": "I specialize in creating beautiful, functional, and user-centered digital experiences. With expertise in modern web technologies and a keen eye for design, I bring ideas to life through code and creativity.",
    "about.experience": "Years Experience",
    "about.projects": "Projects Completed",
    "about.clients": "Happy Clients",
    
    // Portfolio
    "portfolio.title": "Portfolio",
    "portfolio.subtitle": "My recent works",
    "portfolio.all": "All",
    "portfolio.web": "Web Development",
    "portfolio.mobile": "Mobile Apps",
    "portfolio.design": "UI/UX Design",
    "portfolio.viewProject": "View Project",
    
    // Skills
    "skills.title": "Skills",
    "skills.subtitle": "Technologies I work with",
    "skills.frontend": "Frontend Development",
    "skills.backend": "Backend Development",
    "skills.design": "Design Tools",
    "skills.other": "Other Skills",
    
    // Resume
    "resume.title": "Resume",
    "resume.subtitle": "My professional journey",
    "resume.education": "Education",
    "resume.experience": "Work Experience",
    "resume.certifications": "Certifications",
    
    // Blog
    "blog.title": "Blog",
    "blog.subtitle": "Latest articles and insights",
    "blog.readMore": "Read More",
    
    // Contact
    "contact.title": "Get In Touch",
    "contact.subtitle": "Let's work together",
    "contact.name": "Your Name",
    "contact.email": "Your Email",
    "contact.subject": "Subject",
    "contact.message": "Your Message",
    "contact.send": "Send Message",
    "contact.followMe": "Follow Me",
    "contact.info": "Contact Information",
    "contact.address": "Address",
    "contact.addressValue": "Jakarta, Indonesia",
    "contact.phone": "Phone",
    "contact.phoneValue": "+62 123 4567 8900",
    
    // Footer
    "footer.rights": "All rights reserved.",
    "footer.quickLinks": "Quick Links",
    
    // AI Chat
    "ai.assistant": "AI Assistant",
    
    // About - Values
    "about.value.cleanCode": "Clean Code",
    "about.value.cleanCodeDesc": "Writing maintainable, scalable, and efficient code",
    "about.value.innovation": "Innovation",
    "about.value.innovationDesc": "Embracing cutting-edge technologies and methodologies",
    "about.value.collaboration": "Collaboration",
    "about.value.collaborationDesc": "Working together to achieve exceptional results",
    "about.value.goalOriented": "Goal-Oriented",
    "about.value.goalOrientedDesc": "Focused on delivering impactful solutions",
    "about.journey": "Professional Journey",
    "about.introText": "A passionate developer with expertise across multiple cutting-edge technologies",
    "about.bio1": "I'm Fikih Sulaiman Pratama, a versatile developer based in Bangkalan, Indonesia. My journey in technology spans across full-stack development, artificial intelligence, blockchain, mobile applications, IoT systems, and user experience design.",
    "about.bio2": "With a deep commitment to innovation and excellence, I specialize in building scalable, efficient, and user-centric solutions that push the boundaries of what's possible in modern technology. Let's create something extraordinary together.",
    
    // Portfolio
    "portfolio.showcase": "A showcase of my recent projects across various technologies",
    
    // Skills
    "skills.comprehensive": "A comprehensive toolkit spanning multiple technological domains",
    "skills.techWork": "Technologies I Work With",
    
    // Resume
    "resume.credentials": "Professional credentials and achievements in technology",
    "resume.download": "Download My Resume",
    "resume.downloadDesc": "Get the complete overview of my experience, skills, and projects",
    "resume.downloadPDF": "Download PDF Resume",
    "resume.professionalCert": "Professional Certifications",
    
    // Blog
    "blog.insights": "Insights, tutorials, and thoughts on technology and development",
    "blog.viewAll": "View All Articles",
    
    // Contact
    "contact.haveProject": "Have a project in mind? Let's work together to bring your ideas to life",
    "contact.yourName": "Your Name",
    "contact.emailAddress": "Email Address",
    "contact.tellProject": "Tell me about your project...",
    "contact.sending": "Sending...",
    "contact.location": "Location",
    
    // About Timeline
    "about.timeline.2024.title": "Senior Fullstack Developer",
    "about.timeline.2024.desc": "Leading multiple cross-platform projects with AI integration",
    "about.timeline.2023.title": "Web3 & Blockchain Development",
    "about.timeline.2023.desc": "Built decentralized applications and smart contracts",
    "about.timeline.2022.title": "AI & Machine Learning",
    "about.timeline.2022.desc": "Developed AI-powered solutions using TensorFlow and Python",
    "about.timeline.2021.title": "IoT Engineering",
    "about.timeline.2021.desc": "Created smart devices and automation systems",
    
    // Portfolio Categories
    "portfolio.cat.all": "All",
    "portfolio.cat.web": "Web Development",
    "portfolio.cat.ai": "AI",
    "portfolio.cat.mobile": "Mobile App",
    "portfolio.cat.iot": "IoT",
    "portfolio.cat.web3": "Web3",
    "portfolio.cat.design": "Design",
    
    // Skills Categories
    "skills.cat.frontend": "Frontend Development",
    "skills.cat.backend": "Backend Development",
    "skills.cat.ai": "AI & Machine Learning",
    "skills.cat.web3": "Web3 & Blockchain",
    "skills.cat.mobile": "Mobile Development",
    "skills.cat.iot": "IoT & Hardware",
    "skills.cat.design": "Design & Tools",
  },
  id: {
    // Navigation
    "nav.home": "Beranda",
    "nav.about": "Tentang",
    "nav.portfolio": "Portfolio",
    "nav.skills": "Keahlian",
    "nav.resume": "Resume",
    "nav.blog": "Blog",
    "nav.contact": "Kontak",
    "nav.hireMe": "Hubungi Saya",
    
    // Hero
    "hero.greeting": "Hai, Saya",
    "hero.role": "Full Stack Developer & UI/UX Designer",
    "hero.description": "Bersemangat dalam menciptakan aplikasi web yang indah dan fungsional dengan teknologi modern.",
    "hero.downloadCV": "Unduh CV",
    "hero.contactMe": "Hubungi Saya",
    
    // About
    "about.title": "Tentang Saya",
    "about.subtitle": "Mari berkenalan lebih dekat",
    "about.intro": "Halo! Saya Fikih Sulaiman Pratama, seorang Full Stack Developer dan UI/UX Designer yang bersemangat, berbasis di Indonesia.",
    "about.description": "Saya spesialisasi dalam menciptakan pengalaman digital yang indah, fungsional, dan berpusat pada pengguna. Dengan keahlian di teknologi web modern dan mata yang tajam untuk desain, saya menghidupkan ide melalui kode dan kreativitas.",
    "about.experience": "Tahun Pengalaman",
    "about.projects": "Proyek Selesai",
    "about.clients": "Klien Puas",
    
    // Portfolio
    "portfolio.title": "Portfolio",
    "portfolio.subtitle": "Karya terbaru saya",
    "portfolio.all": "Semua",
    "portfolio.web": "Pengembangan Web",
    "portfolio.mobile": "Aplikasi Mobile",
    "portfolio.design": "Desain UI/UX",
    "portfolio.viewProject": "Lihat Proyek",
    
    // Skills
    "skills.title": "Keahlian",
    "skills.subtitle": "Teknologi yang saya kuasai",
    "skills.frontend": "Pengembangan Frontend",
    "skills.backend": "Pengembangan Backend",
    "skills.design": "Alat Desain",
    "skills.other": "Keahlian Lain",
    
    // Resume
    "resume.title": "Resume",
    "resume.subtitle": "Perjalanan profesional saya",
    "resume.education": "Pendidikan",
    "resume.experience": "Pengalaman Kerja",
    "resume.certifications": "Sertifikasi",
    
    // Blog
    "blog.title": "Blog",
    "blog.subtitle": "Artikel dan wawasan terbaru",
    "blog.readMore": "Baca Selengkapnya",
    
    // Contact
    "contact.title": "Hubungi Saya",
    "contact.subtitle": "Mari bekerja sama",
    "contact.name": "Nama Anda",
    "contact.email": "Email Anda",
    "contact.subject": "Subjek",
    "contact.message": "Pesan Anda",
    "contact.send": "Kirim Pesan",
    "contact.followMe": "Ikuti Saya",
    "contact.info": "Informasi Kontak",
    "contact.address": "Alamat",
    "contact.addressValue": "Jakarta, Indonesia",
    "contact.phone": "Telepon",
    "contact.phoneValue": "+62 123 4567 8900",
    
    // Footer
    "footer.rights": "Hak cipta dilindungi.",
    "footer.quickLinks": "Tautan Cepat",
    
    // AI Chat
    "ai.assistant": "Ai asisten",
    
    // About - Values
    "about.value.cleanCode": "Kode Bersih",
    "about.value.cleanCodeDesc": "Menulis kode yang dapat dipelihara, skalabel, dan efisien",
    "about.value.innovation": "Inovasi",
    "about.value.innovationDesc": "Mengadopsi teknologi dan metodologi terdepan",
    "about.value.collaboration": "Kolaborasi",
    "about.value.collaborationDesc": "Bekerja sama untuk mencapai hasil yang luar biasa",
    "about.value.goalOriented": "Berorientasi Tujuan",
    "about.value.goalOrientedDesc": "Fokus memberikan solusi yang berdampak",
    "about.journey": "Perjalanan Profesional",
    "about.introText": "Pengembang yang bersemangat dengan keahlian di berbagai teknologi mutakhir",
    "about.bio1": "Saya Fikih Sulaiman Pratama, seorang pengembang serbaguna yang berbasis di Bangkalan, Indonesia. Perjalanan saya dalam teknologi meliputi pengembangan full-stack, kecerdasan buatan, blockchain, aplikasi mobile, sistem IoT, dan desain pengalaman pengguna.",
    "about.bio2": "Dengan komitmen mendalam terhadap inovasi dan keunggulan, saya berspesialisasi dalam membangun solusi yang skalabel, efisien, dan berpusat pada pengguna yang mendorong batas kemungkinan dalam teknologi modern. Mari ciptakan sesuatu yang luar biasa bersama.",
    
    // Portfolio
    "portfolio.showcase": "Pameran proyek terbaru saya di berbagai teknologi",
    
    // Skills
    "skills.comprehensive": "Perangkat komprehensif yang mencakup berbagai domain teknologi",
    "skills.techWork": "Teknologi yang Saya Kuasai",
    
    // Resume
    "resume.credentials": "Kredensial profesional dan pencapaian dalam teknologi",
    "resume.download": "Unduh Resume Saya",
    "resume.downloadDesc": "Dapatkan gambaran lengkap pengalaman, keahlian, dan proyek saya",
    "resume.downloadPDF": "Unduh Resume PDF",
    "resume.professionalCert": "Sertifikasi Profesional",
    
    // Blog
    "blog.insights": "Wawasan, tutorial, dan pemikiran tentang teknologi dan pengembangan",
    "blog.viewAll": "Lihat Semua Artikel",
    
    // Contact
    "contact.haveProject": "Punya proyek dalam pikiran? Mari bekerja sama untuk mewujudkan ide Anda",
    "contact.yourName": "Nama Anda",
    "contact.emailAddress": "Alamat Email",
    "contact.tellProject": "Ceritakan tentang proyek Anda...",
    "contact.sending": "Mengirim...",
    "contact.location": "Lokasi",
    
    // About Timeline
    "about.timeline.2024.title": "Senior Fullstack Developer",
    "about.timeline.2024.desc": "Memimpin berbagai proyek lintas platform dengan integrasi AI",
    "about.timeline.2023.title": "Pengembangan Web3 & Blockchain",
    "about.timeline.2023.desc": "Membangun aplikasi terdesentralisasi dan smart contract",
    "about.timeline.2022.title": "AI & Machine Learning",
    "about.timeline.2022.desc": "Mengembangkan solusi berbasis AI menggunakan TensorFlow dan Python",
    "about.timeline.2021.title": "Rekayasa IoT",
    "about.timeline.2021.desc": "Menciptakan perangkat pintar dan sistem otomasi",
    
    // Portfolio Categories
    "portfolio.cat.all": "Semua",
    "portfolio.cat.web": "Pengembangan Web",
    "portfolio.cat.ai": "AI",
    "portfolio.cat.mobile": "Aplikasi Mobile",
    "portfolio.cat.iot": "IoT",
    "portfolio.cat.web3": "Web3",
    "portfolio.cat.design": "Desain",
    
    // Skills Categories
    "skills.cat.frontend": "Pengembangan Frontend",
    "skills.cat.backend": "Pengembangan Backend",
    "skills.cat.ai": "AI & Machine Learning",
    "skills.cat.web3": "Web3 & Blockchain",
    "skills.cat.mobile": "Pengembangan Mobile",
    "skills.cat.iot": "IoT & Hardware",
    "skills.cat.design": "Alat Desain",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "id" || saved === "en") ? saved : "id";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
