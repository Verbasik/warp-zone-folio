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
    title: "TurboQuant от Google: прорыв в ИИ или мастерский маркетинговый трюк?",
    titleEn: "TurboQuant from Google: AI Breakthrough or Masterful Marketing Trick?",
    description:
      "Разбор paper TurboQuant — схемы квантования высокоразмерных векторов, которая одновременно оптимальна для реконструкции и для задач inner product. Случайное вращение, scalar quantization и QJL-коррекция в одном pipeline.",
    descriptionEn:
      "A deep dive into TurboQuant — a quantization scheme for high-dimensional vectors that is simultaneously optimal for reconstruction and inner product tasks. Random rotation, scalar quantization, and QJL correction in one pipeline.",
    date: "2026-04-12",
    tags: ["ML", "Quantization", "LLM", "Vector Search", "KV Cache"],
    readingTime: 60,
    featured: true,
    status: "published",
    hasEnglish: true,
  },
  {
    slug: "leworldmodel",
    title: "LeWorldModel: как обучить world model из пикселей без коллапса представлений",
    titleEn: "LeWorldModel: Learning Stable World Models from Pixels without Representation Collapse",
    description:
      "Глубокий разбор LeWorldModel — минималистичной JEPA-архитектуры для обучения world models напрямую из пикселей. Всего два loss-компонента: предсказание следующего latent и SIGReg-регуляризация, обеспечивающая гауссовскую геометрию и предотвращающая collapse.",
    descriptionEn:
      "A deep dive into LeWorldModel — a minimalist JEPA-based architecture for learning world models directly from pixels. Only two loss terms: next-latent prediction and SIGReg regularization enforcing Gaussian geometry and preventing collapse.",
    date: "2026-04-26",
    tags: ["ML", "World Models", "JEPA", "Self-Supervised Learning", "Control"],
    readingTime: 60,
    featured: true,
    status: "published",
    hasEnglish: true,
  },
  {
    slug: "deepseek-v4",
    title: "DeepSeek-V4: Как обработать миллион токенов без квадратичной катастрофы",
    description:
      "Технический разбор архитектурных инноваций DeepSeek-V4: гибридное внимание CSA+HCA, переработанные остаточные связи, специализированный оптимизатор и многоэтапный пайплайн пост-тренировки. Как достичь контекста в 1M токенов при 27% FLOPs от предыдущего поколения.",
    date: "2026-05-05",
    tags: ["ML", "LLM", "Attention", "Architecture", "Long Context", "Inference"],
    readingTime: 60,
    featured: true,
    status: "published",
    hasEnglish: false,
  },

];

export const getFeaturedPosts = () => blogConfig.filter((p) => p.featured);
export const getAllPosts = () => blogConfig;
export const getPostBySlug = (slug: string) =>
  blogConfig.find((p) => p.slug === slug);
