import { siteConfig } from "@/config/site.config";
import { PixelButton } from "../PixelButton";
import { ArrowDown, Github, Mail } from "lucide-react";

export const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-pulse" style={{ animationDuration: "4s" }} />
      
      {/* Scan lines effect */}
      <div className="absolute inset-0 scan-lines opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-slide-in-left">
        {/* Pixel art style decoration */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 pixel-border bg-card flex items-center justify-center animate-pixel-float">
            <div className="text-6xl">👾</div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono mb-4">
          <span className="text-primary">&lt;</span>
          {siteConfig.name}
          <span className="text-primary">/&gt;</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl lg:text-3xl font-mono text-secondary mb-4">
          {siteConfig.tagline}
        </p>

        {/* Short bio */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {siteConfig.shortBio}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <PixelButton
            variant="primary"
            size="lg"
            onClick={() => scrollToSection("projects")}
            className="w-full sm:w-auto"
          >
            View Projects
          </PixelButton>
          <PixelButton
            variant="secondary"
            size="lg"
            onClick={() => scrollToSection("contact")}
            className="w-full sm:w-auto"
          >
            Contact Me
          </PixelButton>
        </div>

        {/* Quick contact links */}
        <div className="flex gap-4 justify-center pt-8">
          <a
            href={siteConfig.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 pixel-border bg-card hover:bg-muted transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-6 w-6 text-foreground" />
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="p-3 pixel-border bg-card hover:bg-muted transition-colors"
            aria-label="Email"
          >
            <Mail className="h-6 w-6 text-foreground" />
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-8 w-8 text-primary" />
        </div>
      </div>
    </section>
  );
};
