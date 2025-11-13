import { siteConfig } from "@/config/site.config";

export const TimelineSection = () => {
  const TimelineTrack = ({
    title,
    items,
    color
  }: {
    title: string;
    items: typeof siteConfig.workExperience;
    color: "primary" | "secondary" | "accent";
  }) => {
    const colorClasses = {
      primary: {
        text: "text-primary",
        bg: "bg-primary",
      },
      secondary: {
        text: "text-secondary",
        bg: "bg-secondary",
      },
      accent: {
        text: "text-accent",
        bg: "bg-accent",
      },
    };

    const colors = colorClasses[color];

    return (
      <div className="flex-1">
        <h3 className={`text-2xl sm:text-3xl font-bold font-mono mb-8 text-center ${colors.text}`}>
          {title}
        </h3>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-border" />

          {/* Timeline items */}
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={index} className="relative pl-12">
                {/* Timeline marker */}
                <div className={`absolute left-0 top-0 w-8 h-8 pixel-border ${colors.bg} flex items-center justify-center z-10`}>
                  <div className="w-3 h-3 bg-background" />
                </div>

                {/* Content */}
                <div className="pixel-border bg-card p-4 sm:p-6">
                  <div className={`${colors.text} font-mono font-bold text-base sm:text-lg mb-2 flex items-center gap-2`}>
                    {item.year}
                    {"status" in item && item.status === "ongoing" && (
                      <span className="text-xs px-2 py-1 pixel-border bg-accent text-accent-foreground">
                        ongoing
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold font-mono mb-1 text-primary">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-mono">
                    {item.company}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="timeline" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-16 text-center">
          <span className="text-primary">My</span> Journey
        </h2>

        {/* Two-column layout on desktop, stacked on mobile */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <TimelineTrack
            title="💼 Work Experience"
            items={siteConfig.workExperience}
            color="secondary"
          />
          <TimelineTrack
            title="🎓 Education"
            items={siteConfig.education}
            color="accent"
          />
        </div>
      </div>
    </section>
  );
};
