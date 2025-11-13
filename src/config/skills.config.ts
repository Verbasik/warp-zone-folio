/**
 * Skills Configuration
 * 
 * Edit this file to add, remove, or modify your skills.
 * Skills are grouped by category for better organization.
 */

export interface Skill {
  name: string;
  level?: number; // Optional: 1-100 for progress bar visualization
  icon?: string; // Optional: emoji or icon name
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
  color?: "primary" | "secondary" | "accent"; // Optional: color theme
}

export const skillsConfig: SkillCategory[] = [
  {
    title: "Frontend",
    color: "primary",
    skills: [
      { name: "React", level: 95, icon: "⚛️" },
      { name: "TypeScript", level: 90, icon: "📘" },
      { name: "JavaScript", level: 95, icon: "💛" },
      { name: "HTML5", level: 98, icon: "🌐" },
      { name: "CSS3/Tailwind", level: 92, icon: "🎨" },
      { name: "Next.js", level: 85, icon: "▲" },
      { name: "Vue.js", level: 75, icon: "💚" },
    ],
  },
  {
    title: "Backend",
    color: "secondary",
    skills: [
      { name: "Node.js", level: 88, icon: "🟢" },
      { name: "Express", level: 85, icon: "🚂" },
      { name: "PostgreSQL", level: 80, icon: "🐘" },
      { name: "MongoDB", level: 75, icon: "🍃" },
      { name: "REST APIs", level: 90, icon: "🔌" },
      { name: "GraphQL", level: 70, icon: "📊" },
    ],
  },
  {
    title: "Tools & DevOps",
    color: "accent",
    skills: [
      { name: "Git", level: 95, icon: "📦" },
      { name: "GitHub Actions", level: 80, icon: "⚙️" },
      { name: "Docker", level: 75, icon: "🐳" },
      { name: "AWS", level: 70, icon: "☁️" },
      { name: "Vercel", level: 90, icon: "▲" },
      { name: "Jest/Vitest", level: 85, icon: "🧪" },
    ],
  },
  {
    title: "Design & Other",
    color: "primary",
    skills: [
      { name: "Figma", level: 80, icon: "🎨" },
      { name: "UI/UX Design", level: 75, icon: "✨" },
      { name: "Responsive Design", level: 95, icon: "📱" },
      { name: "Accessibility", level: 85, icon: "♿" },
      { name: "Agile/Scrum", level: 90, icon: "🏃" },
    ],
  },
];
