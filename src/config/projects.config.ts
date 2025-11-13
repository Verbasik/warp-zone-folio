/**
 * Projects Configuration
 * 
 * Edit this file to add, remove, or modify your portfolio projects.
 * Each project will be displayed as a card in the Projects section.
 */

export interface Project {
  title: string;
  description: string;
  tags: string[]; // Technologies used
  github?: string; // GitHub repository URL (optional)
  demo?: string; // Live demo URL (optional)
  image?: string; // Project thumbnail (optional)
  featured?: boolean; // Show on homepage
}

export const projectsConfig: Project[] = [
  {
    title: "Warp Zone Folio",
    description: "Retro pixel-art portfolio template with modern React stack. Features smooth animations, theme switching, and easy customization.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    github: "https://github.com/Verbasik/warp-zone-folio",
    demo: "https://verbasik.github.io/warp-zone-folio",
    featured: true,
  },
  {
    title: "E-Commerce Platform",
    description: "Full-stack online store with cart, checkout, and admin dashboard. Built with React, Node.js, and Stripe integration.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    github: "https://github.com/Verbasik/ecommerce-platform",
    featured: true,
  },
  {
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates, drag-and-drop boards, and team chat.",
    tags: ["TypeScript", "React", "Socket.io", "MongoDB"],
    github: "https://github.com/Verbasik/task-manager",
    featured: true,
  },
  {
    title: "Weather Dashboard",
    description: "Beautiful weather app with location search, 7-day forecast, and interactive maps using OpenWeather API.",
    tags: ["React", "Tailwind CSS", "API Integration"],
    github: "https://github.com/Verbasik/weather-dashboard",
    featured: true,
  },
  {
    title: "Portfolio Generator",
    description: "CLI tool that generates customizable developer portfolios from a JSON config file. Open source project.",
    tags: ["Node.js", "CLI", "Templates"],
    github: "https://github.com/Verbasik/portfolio-generator",
  },
  {
    title: "AI Chat Assistant",
    description: "Conversational AI interface with natural language processing and context-aware responses.",
    tags: ["React", "OpenAI", "TypeScript", "TailwindCSS"],
    github: "https://github.com/Verbasik/ai-chat",
  },
  {
    title: "Social Media Analytics",
    description: "Dashboard for tracking social media metrics across platforms with data visualization and export features.",
    tags: ["Vue.js", "D3.js", "Express", "MySQL"],
    github: "https://github.com/Verbasik/social-analytics",
  },
  {
    title: "Code Snippet Manager",
    description: "Developer tool for organizing and sharing code snippets with syntax highlighting and tagging system.",
    tags: ["TypeScript", "Next.js", "Prisma", "PostgreSQL"],
    github: "https://github.com/Verbasik/snippet-manager",
  },
];

// Get only featured projects
export const getFeaturedProjects = () => 
  projectsConfig.filter(project => project.featured);

// Get all projects
export const getAllProjects = () => projectsConfig;
