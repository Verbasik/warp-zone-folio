/**
 * Blog Configuration
 *
 * Add new posts here. The `slug` must match the folder name in public/blog/{slug}/
 * and the markdown file must be at public/blog/{slug}/{slug}.md
 */

export interface BlogPost {
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  date: string;       // ISO format: YYYY-MM-DD
  tags: string[];
  readingTime?: number; // minutes
  featured?: boolean;
  status?: "draft" | "published";
  hasEnglish?: boolean;
}

export const blogConfig: BlogPost[] = [
  {
    slug: "turboquant",
    title: "TurboQuant: Data-Oblivious квантование векторов",
    titleEn: "TurboQuant: Data-Oblivious Vector Quantization",
    description:
      "Разбор paper TurboQuant — схемы квантования высокоразмерных векторов, которая одновременно оптимальна для реконструкции и для задач inner product. Случайное вращение, scalar quantization и QJL-коррекция в одном pipeline.",
    descriptionEn:
      "A deep dive into TurboQuant — a quantization scheme for high-dimensional vectors that is simultaneously optimal for reconstruction and inner product tasks. Random rotation, scalar quantization, and QJL correction in one pipeline.",
    date: "2026-04-08",
    tags: ["ML", "Quantization", "LLM", "Vector Search", "KV Cache"],
    readingTime: 18,
    featured: true,
    status: "published",
    hasEnglish: true,
  },
];

export const getFeaturedPosts = () => blogConfig.filter((p) => p.featured);
export const getAllPosts = () => blogConfig;
export const getPostBySlug = (slug: string) =>
  blogConfig.find((p) => p.slug === slug);
