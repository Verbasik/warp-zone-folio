import { siteConfig } from "@/config/site.config";
import { Github, Mail, Heart } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export const Footer = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
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
    <footer className="py-12 px-4 border-t-[3px] border-border bg-card relative">
      <div className="container mx-auto max-w-6xl">
        {/* Top section */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold font-mono text-primary mb-4">
              {siteConfig.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-mono font-bold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
                  >
                    {">"} {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono font-bold mb-4 text-foreground">Contact</h4>
            <div className="space-y-3">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.contact.email}
              </a>
              <a
                href={siteConfig.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub Profile
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-1 bg-border mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p className="font-mono text-center sm:text-left">
            {siteConfig.footer.copyright}
          </p>
          <p className="font-mono flex items-center gap-2 text-center sm:text-right">
            {siteConfig.footer.builtWith}
            <Heart className="h-4 w-4 text-secondary inline animate-pixel-pulse" />
          </p>
        </div>

        {/* Pixel decoration */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-3 h-3 bg-primary" />
          <div className="w-3 h-3 bg-secondary" />
          <div className="w-3 h-3 bg-accent" />
        </div>
      </div>
    </footer>
  );
};
