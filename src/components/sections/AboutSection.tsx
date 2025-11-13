import { siteConfig } from "@/config/site.config";

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-12 text-center">
          <span className="text-primary">About</span> Me
        </h2>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Avatar */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="w-64 h-64 pixel-border-primary bg-card p-4 animate-pixel-float">
                <div className="w-full h-full bg-muted flex items-center justify-center text-8xl">
                  🧑‍💻
                </div>
              </div>
              {/* Decorative pixels */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary pixel-border" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-accent pixel-border" />
            </div>
          </div>

          {/* About text */}
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {siteConfig.about.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-base sm:text-lg">
                {paragraph.trim()}
              </p>
            ))}

            {/* Stats or highlights */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="pixel-border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-primary font-mono">5+</div>
                <div className="text-xs uppercase font-mono text-muted-foreground mt-1">Years Exp</div>
              </div>
              <div className="pixel-border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-secondary font-mono">50+</div>
                <div className="text-xs uppercase font-mono text-muted-foreground mt-1">Projects</div>
              </div>
              <div className="pixel-border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-accent font-mono">100%</div>
                <div className="text-xs uppercase font-mono text-muted-foreground mt-1">Passion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
