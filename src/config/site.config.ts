/**
 * Site Configuration
 *
 * Edit this file to customize your portfolio content.
 * All the text, links, and personal information are defined here.
 */

import avatarImage from '/avatar.jpg';

export const siteConfig = {
  // Personal Information
  name: "Hi there👋",
  tagline: "I'm Edward",
  shortBio: "Full-cycle AI/ML specialist—Pre-training, SFT, RLHF, deployment of LLMs, multimodal & computer vision systems. Staff Engineer with 5+ years building high-load AI systems using vLLM, SGLang, and Triton Inference Server. Architect of scalable multi-agent systems solving complex problems at enterprise scale.",
  
  // About Section
  about: {
    description: `I'm Edward, a Staff ML Engineer and Tech Lead with 5+ years building production-grade AI systems at enterprise scale. My expertise spans the complete ML lifecycle—from foundation model pre-training and fine-tuning to RLHF optimization, deployment, and monitoring across LLMs, multimodal AI, and computer vision. I'm obsessed with end-to-end ownership, rigorous engineering, and building systems that work flawlessly under real-world constraints while maintaining scalability, maintainability, and compliance.

What drives me is the intersection of ambitious research and practical impact. I've led cross-functional R&D and engineering teams architecting solutions that bridge cutting-edge research and production reality. Equally comfortable optimizing foundation models or architecting distributed multi-agent systems, I thrive tackling hard problems where innovation meets reliability. My background spans fintech, public sector, and biomedical AI, giving me perspective across domains and regulatory landscapes. Let's collaborate on next-generation intelligent systems—I'm excited to build solutions that inspire, scale, and endure.`,
    image: avatarImage,
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
  workExperience: [
    {
      year: "2025",
      title: "Staff ML Engineer",
      company: "SberBank",
      description: "Post-training adaptation of GigaChat 12B Vision-Language Model for banking domain. Achieved +28% improvement in domain-specific benchmarks with <300ms p95 latency in production.",
    },
    {
      year: "2024–2025",
      title: "Tech Lead Artificial Intelligence",
      company: "Alfa-Bank",
      description: "Led cross-functional AI teams (R&D, Agents, MLOps). Architected AI Agents Orchestrator (100+ TPS, 10+ enterprise integrations) and PromptPilot Store (+35% quality improvement). Built distributed multi-agent systems with fault tolerance and transactional state management.",
    },
    {
      year: "2023–2024",
      title: "Team Lead Data Science",
      company: "Moscow Department of IT",
      description: "Led Data Science, Analytics, and Engineering teams. Adapted Mistral-7B for Russian language (78.3 Russian SuperGLUE, +4.2 vs SOTA). Built self-hosted LLM platform with RAG integration replacing Foundation Models.",
    },
    {
      year: "2021–2022",
      title: "Data Science / Analytics",
      company: "AION Labs Israel",
      description: "Developed ML solutions for biomedical research. Built Flow Cytometry Analytics Platform (12× faster analysis, 94.3% accuracy), DNA Pattern Recognition Engine (89.7% AUC-ROC), and Cell Microscopy Segmentation AI (91.4% Dice Score).",
    },
  ],

  education: [
    {
      year: "2024–2026",
      title: "Master's Degree",
      company: "Moscow Aviation Institute",
      description: "Computational Mathematics and Programming, specializing in Machine Learning and Data Analysis.",
      status: "ongoing",
    },
    {
      year: "2022–2024",
      title: "Professional Retraining",
      company: "Yandex School of Data Analysis",
      description: "Data Science and Mathematics for machine learning. Completed advanced program covering ML theory, deep learning, and production engineering.",
    },
    {
      year: "2016–2020",
      title: "Bachelor's Degree",
      company: "Lomonosov Moscow State University",
      description: "Computational Mathematics and Cybernetics, specializing in Applied Mathematics and Informatics.",
    },
    {
      year: "2012–2016",
      title: "Bachelor's Degree",
      company: "Moscow International Academy",
      description: "Business Management. Foundational business education providing perspective on product development and organizational management.",
    },
  ],

  // Footer
  footer: {
    copyright: `© ${new Date().getFullYear()} Verbasik. All rights reserved.`,
    builtWith: "Built with React, TypeScript, and Tailwind CSS",
  },
};
