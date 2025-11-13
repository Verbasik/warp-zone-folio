import { Navigation } from "@/components/Navigation";
import { Starfield } from "@/components/Starfield";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
// import { ProjectsSection } from "@/components/sections/ProjectsSection"; // Temporarily hidden until real projects are added
import { TimelineSection } from "@/components/sections/TimelineSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Starfield background */}
      <Starfield />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        {/* <ProjectsSection /> */} {/* Temporarily hidden until real projects are added */}
        <TimelineSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
