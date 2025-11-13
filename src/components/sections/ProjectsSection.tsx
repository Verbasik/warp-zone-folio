import { getAllProjects } from "@/config/projects.config";
import { PixelButton } from "../PixelButton";
import { ExternalLink, Github } from "lucide-react";

export const ProjectsSection = () => {
  const projects = getAllProjects();

  return (
    <section id="projects" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-12 text-center">
          <span className="text-accent">Featured</span> Projects
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <article
              key={index}
              className="pixel-border bg-card p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 flex flex-col"
            >
              {/* Project header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold font-mono mb-2 text-primary">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 text-xs font-mono bg-muted border-2 border-border text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-2 mt-auto pt-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <PixelButton variant="ghost" size="sm" className="w-full gap-2">
                      <Github className="h-4 w-4" />
                      <span className="text-xs">Code</span>
                    </PixelButton>
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <PixelButton variant="primary" size="sm" className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-xs">Demo</span>
                    </PixelButton>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* View more on GitHub */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/[GITHUB_USERNAME]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <PixelButton variant="secondary" size="lg" className="gap-2">
              <Github className="h-5 w-5" />
              View More on GitHub
            </PixelButton>
          </a>
        </div>
      </div>
    </section>
  );
};
