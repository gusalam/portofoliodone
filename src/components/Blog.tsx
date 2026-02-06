import { Calendar, Clock, ArrowRight } from "lucide-react";
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

const Blog = () => {
  const { t } = useLanguage();
  
  const posts = [
    {
      title: "Building Scalable Microservices with Node.js",
      excerpt: "Learn how to architect and deploy microservices that can handle millions of requests",
      date: "March 15, 2024",
      readTime: "8 min read",
      category: "Backend",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    },
    {
      title: "AI-Driven Development: The Future of Coding",
      excerpt: "Exploring how artificial intelligence is transforming the software development landscape",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "AI",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    },
    {
      title: "Web3 Security Best Practices for Smart Contracts",
      excerpt: "Essential security guidelines for developing secure decentralized applications",
      date: "March 5, 2024",
      readTime: "10 min read",
      category: "Web3",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    },
    {
      title: "Creating Responsive Mobile Apps with Flutter",
      excerpt: "Tips and tricks for building beautiful cross-platform mobile applications",
      date: "February 28, 2024",
      readTime: "7 min read",
      category: "Mobile",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    },
    {
      title: "IoT Security: Protecting Connected Devices",
      excerpt: "Understanding the security challenges in IoT and how to mitigate them",
      date: "February 20, 2024",
      readTime: "9 min read",
      category: "IoT",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827",
    },
    {
      title: "Modern UI/UX Design Principles for 2024",
      excerpt: "The latest trends and best practices in user interface and experience design",
      date: "February 15, 2024",
      readTime: "5 min read",
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    },
  ];

  return (
    <section id="blog" className="py-20 sm:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
           <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold gradient-text mb-4">
            {t("blog.title")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-poppins text-muted-foreground max-w-3xl mx-auto">
            {t("blog.insights")}
          </p>
        </div>

        {/* Blog Carousel */}
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
            {posts.map((post, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card
                   className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 box-glow-hover animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Post Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                       <span className="inline-block px-3 py-1 text-xs font-poppins font-medium bg-primary text-primary-foreground rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-4 text-xs font-poppins text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime.replace('min read', 'menit baca')}</span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-orbitron font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm font-poppins text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Button
                      variant="ghost"
                      className="group/btn p-0 h-auto font-poppins text-primary hover:text-primary/80 hover:bg-transparent"
                    >
                      {t("blog.readMore")}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* View All Button */}
        <div className="text-center mt-12 sm:mt-16">
          <Button
            size="lg"
            className="font-poppins px-8 py-6 bg-primary hover:bg-primary/90 box-glow-hover"
          >
            {t("blog.viewAll")}
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
