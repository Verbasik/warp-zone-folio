import { siteConfig } from "@/config/site.config";
import { PixelButton } from "../PixelButton";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-12 text-center">
          <span className="text-secondary">Get</span> In Touch
        </h2>

        <div className="pixel-border bg-card p-8 md:p-12">
          <p className="text-center text-lg text-muted-foreground mb-8 leading-relaxed">
            I'm always interested in hearing about new projects and opportunities.
            Whether you have a question or just want to say hi, feel free to reach out!
          </p>

          {/* Contact methods */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Email */}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="pixel-border bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-150 p-6 flex items-center gap-4 group"
            >
              <Mail className="h-8 w-8 text-primary group-hover:text-primary-foreground flex-shrink-0" />
              <div>
                <div className="font-mono font-bold mb-1">Email</div>
                <div className="text-sm break-all">{siteConfig.contact.email}</div>
              </div>
            </a>

            {/* GitHub */}
            <a
              href={siteConfig.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-border bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-150 p-6 flex items-center gap-4 group"
            >
              <Github className="h-8 w-8 text-primary group-hover:text-primary-foreground flex-shrink-0" />
              <div>
                <div className="font-mono font-bold mb-1">GitHub</div>
                <div className="text-sm">View my repositories</div>
              </div>
            </a>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-center gap-4">
            <p className="font-mono text-sm text-muted-foreground">Connect on social:</p>
            <div className="flex gap-4">
              {siteConfig.contact.linkedin && (
                <a
                  href={siteConfig.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 pixel-border bg-muted hover:bg-secondary hover:text-secondary-foreground transition-all duration-150"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {siteConfig.contact.twitter && (
                <a
                  href={siteConfig.contact.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 pixel-border bg-muted hover:bg-secondary hover:text-secondary-foreground transition-all duration-150"
                  aria-label="Twitter"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>

          {/* Simple mailto button */}
          <div className="text-center mt-8">
            <a href={`mailto:${siteConfig.contact.email}`}>
              <PixelButton variant="primary" size="lg" className="gap-2">
                <Mail className="h-5 w-5" />
                Send Email
              </PixelButton>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
