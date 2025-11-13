# Pixel-Art Developer Portfolio

A beautiful, retro-themed developer portfolio website with pixel-art aesthetics inspired by classic 8-bit/16-bit game UIs. Built with React, TypeScript, and Tailwind CSS, optimized for static hosting on GitHub Pages.

## ✨ Features

- 🎮 **Retro pixel-art design** with chunky borders, neon colors, and game-inspired UI
- 🌟 **Animated starfield background** for that cyberpunk feel
- 🌓 **Light/Dark theme toggle** with pixel-perfect color schemes
- 📱 **Fully responsive** design that works on all devices
- ⚡ **Static site** - no backend required, perfect for GitHub Pages
- 🎯 **Smooth scroll navigation** with active section highlighting
- 🎨 **Easy customization** via config files
- ♿ **Accessible** with semantic HTML and ARIA labels

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[GITHUB_USERNAME]/[REPO_NAME].git
cd [REPO_NAME]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:8080`

## 🎨 Customization

### Personal Information

Edit `src/config/site.config.ts` to customize:
- Your name, tagline, and bio
- Contact information (email, GitHub, LinkedIn, etc.)
- About section description
- Timeline/experience entries
- Footer text

```typescript
// Example:
export const siteConfig = {
  name: "Your Name",
  tagline: "Your tagline here",
  shortBio: "Your short bio...",
  // ... more settings
};
```

### Projects

Edit `src/config/projects.config.ts` to add or modify your projects:

```typescript
{
  title: "Project Name",
  description: "Short description...",
  tags: ["React", "TypeScript", "etc"],
  github: "https://github.com/username/repo",
  demo: "https://demo-url.com",
  featured: true, // Show on homepage
}
```

### Skills

Edit `src/config/skills.config.ts` to customize your skills:

```typescript
{
  title: "Category Name",
  color: "primary", // or "secondary", "accent"
  skills: [
    { name: "Skill Name", level: 90, icon: "🚀" },
    // ... more skills
  ],
}
```

### Theme Colors

Edit `src/index.css` to customize the color scheme:

```css
:root {
  --primary: 189 97% 55%;    /* Cyan */
  --secondary: 328 86% 60%;  /* Pink */
  --accent: 142 76% 56%;     /* Green */
  /* ... more colors */
}
```

### Meta Tags (SEO)

Edit `index.html` to update meta tags:
- Page title
- Description
- Author
- Social media preview images

## 📦 Building for Production

Build the project for production:

```bash
npm run build
```

This creates a `dist/` folder with your static files ready for deployment.

## 🌐 Deploying to GitHub Pages

### Method 1: Using gh-pages package (Recommended)

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://[GITHUB_USERNAME].github.io"
}
```

3. Deploy:
```bash
npm run deploy
```

4. Go to your GitHub repository → Settings → Pages
5. Set source to `gh-pages` branch
6. Your site will be live at `https://[GITHUB_USERNAME].github.io`

### Method 2: Using GitHub Actions

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Push to your main branch - the action will automatically build and deploy

3. Go to Settings → Pages and set source to `gh-pages` branch

### Important: Base URL Configuration

If deploying to a project page (not username.github.io), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/[REPO_NAME]/', // Add your repo name
  // ... rest of config
});
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Lucide React** - Icon library
- **React Router** - Client-side routing (using hash mode for GitHub Pages)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── sections/       # Page sections (Hero, About, etc.)
│   ├── Navigation.tsx
│   ├── PixelButton.tsx
│   ├── Starfield.tsx
│   └── ThemeToggle.tsx
├── config/             # Configuration files
│   ├── site.config.ts  # Personal info, contact, timeline
│   ├── projects.config.ts
│   └── skills.config.ts
├── pages/
│   ├── Index.tsx       # Main page
│   └── NotFound.tsx
├── lib/
│   └── utils.ts
├── index.css           # Global styles and design system
└── main.tsx
```

## 🎯 Key Features Explained

### Pixel-Art Design System

The design system is built with CSS custom properties in `src/index.css`:
- Chunky borders with `pixel-border` utilities
- Blocky shadows via `--pixel-shadow`
- Sharp corners (no border-radius)
- Limited color palette for authentic retro feel

### Smooth Scroll Navigation

Navigation links use smooth scrolling with offset to account for fixed header:

```typescript
const element = document.querySelector(href);
const offset = 80;
const elementPosition = element.getBoundingClientRect().top;
const offsetPosition = elementPosition + window.pageYOffset - offset;
window.scrollTo({ top: offsetPosition, behavior: "smooth" });
```

### Active Section Detection

The navigation automatically highlights the active section based on scroll position using Intersection Observer API.

### Theme Toggle

Light/dark themes are implemented with CSS classes and localStorage persistence:
- Theme preference saved to localStorage
- Instant theme switching without flash
- Both themes use pixel-art aesthetics

## 🐛 Troubleshooting

### Blank page after deployment

- Check that `base` in `vite.config.ts` matches your deployment URL
- Ensure GitHub Pages is set to the correct branch
- Clear browser cache

### Navigation not working

- Verify section IDs match navigation hrefs
- Check that smooth scroll is enabled in `index.css`

### Build errors

- Delete `node_modules/` and `dist/` folders
- Run `npm install` again
- Check that all imports are correct

## 📝 License

MIT License - feel free to use this template for your own portfolio!

## 🤝 Contributing

Feel free to open issues or submit pull requests with improvements!

## 📧 Questions?

If you have any questions or need help customizing the portfolio, feel free to reach out at [EMAIL_ADDRESS] or open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

⭐ If you like this project, give it a star on GitHub!
