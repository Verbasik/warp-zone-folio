/**
 * Site Configuration
 *
 * Edit this file to customize your portfolio content.
 * All the text, links, and personal information are defined here.
 */

import avatarImage from '/public/avatar.jpg';

export const siteConfig = {
  // Personal Information
  name: "Hi there👋",
  tagline: "I'm Edward",
  shortBio: "Full-cycle AI/ML specialist—Pre-training, SFT, RLHF, deployment of LLMs, multimodal & computer vision systems. Staff Engineer with 5+ years building high-load AI systems using vLLM, SGLang, and Triton Inference Server. Architect of scalable multi-agent systems solving complex problems at enterprise scale.",
  
  // About Section
  about: {
    description: `I'm Edward, a Staff ML Engineer and Tech Lead with 5+ years building production-grade AI systems at enterprise scale. My expertise spans the complete ML lifecycle—from foundation model pre-training and fine-tuning to RLHF optimization, deployment, and monitoring across LLMs, multimodal AI, and computer vision. I'm obsessed with end-to-end ownership, rigorous engineering, and building systems that work flawlessly under real-world constraints while maintaining scalability, maintainability, and compliance.

What drives me is the intersection of ambitious research and practical impact. I've led cross-functional R&D and engineering teams architecting solutions that bridge cutting-edge research and production reality. Equally comfortable optimizing foundation models or architecting distributed multi-agent systems, I thrive tackling hard problems where innovation meets reliability. My background spans fintech, public sector, and biomedical AI, giving me perspective across domains and regulatory landscapes. Let's collaborate on next-generation intelligent systems—I'm excited to build solutions that inspire, scale, and endure.`,
    image: "/avatar.jpg", // Замените на путь к вашему фото (поместите его в папку public/)
  },

  // Contact Information
  contact: {
    email: "verbasik@example.com",
    github: "https://github.com/Verbasik",
    linkedin: "https://linkedin.com/in/verbasik", // Optional
    twitter: "https://twitter.com/verbasik", // Optional
    // Add more social links as needed
  },

  // Timeline / Experience
  timeline: [
    {
      year: "2024",
      title: "Senior Full-Stack Developer",
      company: "Tech Company",
      description: "Leading development of scalable web applications using React, TypeScript, and Node.js.",
    },
    {
      year: "2022",
      title: "Full-Stack Developer",
      company: "Startup Inc",
      description: "Built and maintained multiple client projects from design to deployment.",
    },
    {
      year: "2020",
      title: "Frontend Developer",
      company: "Digital Agency",
      description: "Specialized in React development and UI/UX implementation.",
    },
    {
      year: "2019",
      title: "Computer Science Degree",
      company: "University Name",
      description: "Graduated with honors, focused on software engineering and web technologies.",
    },
  ],

  // Footer
  footer: {
    copyright: `© ${new Date().getFullYear()} Verbasik. All rights reserved.`,
    builtWith: "Built with React, TypeScript, and Tailwind CSS",
  },
};
