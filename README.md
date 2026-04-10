# Warp Zone Folio

Retro pixel-art aesthetics, technical blog with LaTeX support, deployed on GitHub Pages.

**Live:** [verbasik.github.io/warp-zone-folio](https://verbasik.github.io/warp-zone-folio)

## Features

- Pixel-art design system — chunky borders, neon palette, monospace typography
- Animated starfield background
- Light / Dark theme toggle with localStorage persistence
- Smooth scroll navigation with active section detection
- Technical blog — Markdown posts with LaTeX formula rendering (KaTeX)
- Draft / Published status for blog posts
- Config-driven content — all text and data in `src/config/`
- Fully responsive, static build — no backend required

## Tech Stack

| Category        | Libraries                                                                                           |
|-----------------|-----------------------------------------------------------------------------------------------------|
| UI              | React 18, TypeScript                                                                                |
| Styles          | Tailwind CSS, Radix UI                                                                              |
| Build           | Vite + SWC                                                                                          |
| Routing         | React Router v6 (HashRouter)                                                                        |
| Blog rendering  | react-markdown, remark-math, rehype-katex, KaTeX                                                    |
| State           | TanStack Query                                                                                      |
| Icons           | Lucide React                                                                                        |
| Deploy          | gh-pages → GitHub Pages                                                                             |

## Project Structure

```
src/
├── config/
│   ├── site.config.ts          # Personal info, work experience, education, contacts
│   ├── skills.config.ts        # Skills by category with proficiency levels
│   ├── projects.config.ts      # Portfolio projects
│   └── blog.config.ts          # Blog post metadata (slug, title, tags, status)
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── BlogSection.tsx     # Featured posts preview on main page
│   │   ├── TimelineSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── Footer.tsx
│   ├── BlogPostRenderer.tsx    # Markdown + LaTeX renderer
│   ├── Navigation.tsx
│   ├── Starfield.tsx
│   └── ThemeToggle.tsx
├── pages/
│   ├── Index.tsx               # Main page
│   ├── Blog.tsx                # /blog — all posts list
│   ├── BlogPost.tsx            # /blog/:slug — single post
│   └── NotFound.tsx
└── index.css                   # Design system, CSS custom properties

public/
└── blog/
    └── {slug}/
        ├── {slug}.md           # Post content (Markdown with LaTeX)
        └── *.png               # Post images
```

## Quick Start

```bash
npm install
npm run dev       # http://localhost:8080
npm run build     # production build → dist/
npm run deploy    # build + push to gh-pages branch
```

## Adding a Blog Post

**1.** Register the post in `src/config/blog.config.ts`:

```typescript
{
  slug: "my-post",
  title: "Post Title",
  description: "Short description...",
  date: "2026-04-08",
  tags: ["ML", "Paper"],
  readingTime: 10,
  featured: true,
  status: "draft", // or "published"
}
```

**2.** Create the content folder:

```
public/blog/my-post/
├── my-post.md      # Post body in Markdown
└── figure-01.png   # Images referenced in the post
```

**3.** Write in standard Markdown. LaTeX is supported inline and block:

```markdown
Inline: $E = mc^2$

Block:
$$
D_{\mathrm{mse}} := \mathbb{E}_Q\|x - Q^{-1}(Q(x))\|_2^2
$$

Images:
![Caption](/warp-zone-folio/blog/my-post/figure-01.png)
```

Change `status` from `"draft"` to `"published"` when ready.

## Customization

| File                            | What to edit                                      |
|---------------------------------|---------------------------------------------------|
| `src/config/site.config.ts`     | Name, bio, contacts, work experience, education   |
| `src/config/skills.config.ts`   | Skills, categories, proficiency levels            |
| `src/config/projects.config.ts` | Portfolio projects                                |
| `src/config/blog.config.ts`     | Blog posts metadata                               |
| `src/index.css`                 | Color scheme (CSS custom properties)              |
| `public/avatar.jpg`             | Profile photo                                     |

## Deployment

The site is deployed to GitHub Pages via `gh-pages` branch.

```bash
npm run deploy
```

Base URL is configured in `vite.config.ts`:

```typescript
base: '/warp-zone-folio/',
```

Update this value if deploying under a different repository name.

## License

MIT