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
    title: "E-Commerce Platform",
    description: "Full-stack online store with cart, checkout, and admin dashboard. Built with React, Node.js, and Stripe integration.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    github: "https://github.com/[GITHUB_USERNAME]/ecommerce-platform",
    demo: "https://demo-ecommerce.example.com",
    featured: true,
  },
  {
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates, drag-and-drop boards, and team chat.",
    tags: ["TypeScript", "React", "Socket.io", "MongoDB"],
    github: "https://github.com/[GITHUB_USERNAME]/task-manager",
    demo: "https://tasks.example.com",
    featured: true,
  },
  {
    title: "Weather Dashboard",
    description: "Beautiful weather app with location search, 7-day forecast, and interactive maps using OpenWeather API.",
    tags: ["React", "Tailwind CSS", "API Integration"],
    github: "https://github.com/[GITHUB_USERNAME]/weather-dashboard",
    demo: "https://weather.example.com",
    featured: true,
  },
  {
    title: "Portfolio Generator",
    description: "CLI tool that generates customizable developer portfolios from a JSON config file. Open source with 500+ stars.",
    tags: ["Node.js", "CLI", "Templates"],
    github: "https://github.com/[GITHUB_USERNAME]/portfolio-generator",
    featured: true,
  },
  {
    title: "AI Chat Assistant",
    description: "Conversational AI interface with natural language processing and context-aware responses.",
    tags: ["React", "OpenAI", "TypeScript", "TailwindCSS"],
    github: "https://github.com/[GITHUB_USERNAME]/ai-chat",
    demo: "https://chat.example.com",
  },
  {
    title: "Social Media Analytics",
    description: "Dashboard for tracking social media metrics across platforms with data visualization and export features.",
    tags: ["Vue.js", "D3.js", "Express", "MySQL"],
    github: "https://github.com/[GITHUB_USERNAME]/social-analytics",
    demo: "https://analytics.example.com",
  },
  {
    title: "Fitness Tracker",
    description: "Mobile-responsive workout logging app with progress charts, goal setting, and exercise library.",
    tags: ["React Native", "Firebase", "Charts"],
    github: "https://github.com/[GITHUB_USERNAME]/fitness-tracker",
  },
  {
    title: "Code Snippet Manager",
    description: "Developer tool for organizing and sharing code snippets with syntax highlighting and tagging system.",
    tags: ["TypeScript", "Next.js", "Prisma", "PostgreSQL"],
    github: "https://github.com/[GITHUB_USERNAME]/snippet-manager",
    demo: "https://snippets.example.com",
  },
];

// Get only featured projects
export const getFeaturedProjects = () => 
  projectsConfig.filter(project => project.featured);

// Get all projects
export const getAllProjects = () => projectsConfig;
