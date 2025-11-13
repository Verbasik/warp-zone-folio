/**
 * Site Configuration
 * 
 * Edit this file to customize your portfolio content.
 * All the text, links, and personal information are defined here.
 */

export const siteConfig = {
  // Personal Information
  name: "Hi there👋",
  tagline: "I'm Edward",
  shortBio: "Full-cycle AI/ML specialist—Pre-training, SFT, RLHF, deployment of LLMs, multimodal & computer vision systems. Staff Engineer with 5+ years building high-load AI systems using vLLM, SGLang, and Triton Inference Server. Architect of scalable multi-agent systems solving complex problems at enterprise scale.",
  
  // About Section
  about: {
    description: `I'm Edward, a Staff ML Engineer and Tech Lead with 5+ years of intensive experience building production-grade AI systems at enterprise scale. My expertise spans the complete machine learning lifecycle—from foundation model pre-training and domain-specific fine-tuning to RLHF optimization, deployment, and monitoring. I specialize in large language models, multimodal AI, and computer vision, with a proven track record of delivering measurable impact: 28% quality improvements on domain benchmarks, 99.95% uptime on high-load systems, and sub-200ms latency serving 100+ TPS in fintech and banking environments.

Throughout my career, I've led cross-functional R&D and engineering teams, architecting complex AI solutions that bridge the gap between cutting-edge research and production reality. My philosophy: great AI isn't just about state-of-the-art models—it's about rigorous engineering, thoughtful optimization, and building systems that work flawlessly under real-world constraints. I'm obsessed with end-to-end ownership, from hypothesis to production, ensuring every system is scalable, maintainable, and compliant.

What drives me is the intersection of ambitious research and practical impact. I'm equally comfortable optimizing foundation models or architecting distributed multi-agent systems, debugging latency issues or mentoring teams through complex ML pipelines. I thrive in environments where we tackle hard problems—where innovation meets reliability, and where AI solutions genuinely move the needle on business outcomes. My background spans fintech, public sector, and biomedical AI, giving me perspective on how to build systems that work across different domains and regulatory landscapes.

I'm always looking for new challenges where cutting-edge AI research meets real-world application. Whether you're building the next generation of intelligent systems, scaling AI operations, or pushing the boundaries of what's possible with LLMs and multi-agent architectures—I'm excited to collaborate. Let's create AI solutions that don't just work—they inspire, scale, and endure.`,
    image: "/placeholder.svg", // Path to your avatar image
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
