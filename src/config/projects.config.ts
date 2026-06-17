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
    title: "TurboQuant-True-or-False",
    description:
      "Experimental review of TurboQuant-style KV-cache compression, vector quantization behavior, retrieval quality, and throughput implications on a single 96 GB Blackwell GPU.",
    tags: ["Python", "LLM", "KV Cache", "Quantization", "Qwen"],
    github: "https://github.com/Verbasik/TurboQuant-True-or-False",
    demo: "https://verbasik.github.io/warp-zone-folio/#/blog/turboquant",
    featured: true,
  },
  {
    title: "Riemannian-Token-Transformer-Multi-Scale",
    description:
      "Imagined-speech EEG decoder that combines Riemannian SPD tokens, multi-scale temporal windows, subject embeddings, and a compact Transformer for 8-class semantic classification.",
    tags: ["Python", "PyTorch", "EEG", "BCI", "Transformer"],
    github: "https://github.com/Verbasik/Riemannian-Token-Transformer-Multi-Scale",
    demo: "https://verbasik.github.io/warp-zone-folio/#/blog/rttmultiscale",
    featured: true,
  },
];

// Get only featured projects
export const getFeaturedProjects = () => 
  projectsConfig.filter(project => project.featured);

// Get all projects
export const getAllProjects = () => projectsConfig;
