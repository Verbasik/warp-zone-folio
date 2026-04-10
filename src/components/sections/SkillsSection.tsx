import { skillsConfig } from "@/config/skills.config";
import { cn } from "@/lib/utils";

export const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-12 text-center">
          <span className="text-secondary">Tech</span> Stack
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {skillsConfig.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="pixel-border bg-card p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150"
            >
              <h3 className="text-2xl font-bold font-mono mb-6">
                <span
                  className={cn(
                    category.color === "primary" && "text-primary",
                    category.color === "secondary" && "text-secondary",
                    category.color === "accent" && "text-accent"
                  )}
                >
                  {">"} {category.title}
                </span>
              </h3>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm sm:text-base flex items-center gap-2">
                        {skill.icon && <span className="text-lg">{skill.icon}</span>}
                        {skill.name}
                      </span>
                      {skill.level && (
                        <span className="text-sm text-muted-foreground font-mono">
                          {skill.level}%
                        </span>
                      )}
                    </div>
                    
                    {skill.level && (
                      <div className="h-2 bg-muted border-2 border-border overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-1000 ease-out",
                            category.color === "primary" && "bg-primary",
                            category.color === "secondary" && "bg-secondary",
                            category.color === "accent" && "bg-accent"
                          )}
                          style={{
                            width: `${skill.level}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
