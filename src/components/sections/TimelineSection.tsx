import { siteConfig } from "@/config/site.config";

export const TimelineSection = () => {
  return (
    <section id="timeline" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-12 text-center">
          <span className="text-primary">My</span> Journey
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-border" />

          {/* Timeline items */}
          <div className="space-y-12">
            {siteConfig.timeline.map((item, index) => (
              <div
                key={index}
                className={`relative flex ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-8`}
              >
                {/* Timeline marker */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 -ml-4 pixel-border bg-primary flex items-center justify-center z-10">
                  <div className="w-3 h-3 bg-background" />
                </div>

                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left text-left"} ml-16 md:ml-0`}>
                  <div
                    className={`pixel-border bg-card p-6 inline-block ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <div className="text-secondary font-mono font-bold text-lg mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold font-mono mb-1 text-primary">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 font-mono">
                      {item.company}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
