# System Patterns: Warp Zone Folio

## Архитектурные решения

### Общая архитектура
**Тип приложения:** Single Page Application (SPA)

**Архитектурный паттерн:** Component-Based Architecture

```
┌─────────────────────────────────────┐
│         Browser (Client)            │
│  ┌───────────────────────────────┐  │
│  │      React Application        │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │    Navigation (Fixed)   │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   Starfield (Canvas)    │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   Page Sections         │  │  │
│  │  │   - Hero                │  │  │
│  │  │   - About               │  │  │
│  │  │   - Skills              │  │  │
│  │  │   - Projects            │  │  │
│  │  │   - Timeline            │  │  │
│  │  │   - Contact             │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │       Footer            │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
         │
         │ (no API calls)
         ▼
   ┌────────────────┐
   │  localStorage  │ ← Theme persistence
   └────────────────┘
```

### Компонентная иерархия

```
App.tsx
├── BrowserRouter
│   └── Routes
│       ├── Index.tsx (/)
│       │   ├── Starfield (background, z-0)
│       │   ├── Navigation (fixed, z-50)
│       │   ├── HeroSection (#home)
│       │   ├── AboutSection (#about)
│       │   ├── SkillsSection (#skills)
│       │   ├── ProjectsSection (#projects)
│       │   ├── TimelineSection (#timeline)
│       │   ├── ContactSection (#contact)
│       │   └── Footer
│       └── NotFound.tsx (*)
├── QueryClientProvider
├── TooltipProvider
├── Toaster (shadcn)
└── Sonner (toast notifications)
```

### Паттерны проектирования

#### 1. Configuration as Data Pattern
**Цель:** Отделить контент от логики

**Реализация:**
```typescript
// src/config/site.config.ts
export const siteConfig = {
  name: "[YOUR_NAME]",
  tagline: "...",
  about: { ... },
  contact: { ... },
  timeline: [ ... ]
}

// Использование в компоненте
import { siteConfig } from "@/config/site.config";
<h1>{siteConfig.name}</h1>
```

**Преимущества:**
- Кастомизация без изменения компонентов
- Типобезопасность через TypeScript интерфейсы
- Централизованное управление контентом

**Файлы:**
- `src/config/site.config.ts` - персональные данные
- `src/config/projects.config.ts` - проекты
- `src/config/skills.config.ts` - навыки

#### 2. CSS Custom Properties Pattern
**Цель:** Гибкая темизация без JavaScript

**Реализация:**
```css
/* src/index.css */
:root {
  --primary: 189 97% 55%;
  --secondary: 328 86% 60%;
  --pixel-shadow: 4px 4px 0px hsl(222 47% 8%);
}

.light {
  --primary: 189 90% 45%;
  --pixel-shadow: 4px 4px 0px hsl(222 47% 70%);
}
```

**Преимущества:**
- Мгновенное переключение темы
- Каскадирование значений
- Легкая кастомизация цветов

#### 3. Compound Component Pattern (PixelButton)
**Цель:** Переиспользуемые, гибкие UI компоненты

**Реализация:**
```typescript
// src/components/PixelButton.tsx
interface PixelButtonProps {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
}

const PixelButton = ({ variant = "primary", size = "md", ... }) => {
  const variants = {
    primary: "bg-primary pixel-border-primary ...",
    secondary: "bg-secondary pixel-border-secondary ...",
    // ...
  };
  return <button className={cn(baseStyles, variants[variant], sizes[size])} />
}
```

**Использование:**
```tsx
<PixelButton variant="primary" size="lg">View Projects</PixelButton>
<PixelButton variant="ghost" size="sm">Theme Toggle</PixelButton>
```

**Преимущества:**
- Консистентность дизайна
- Переиспользование кода
- Типобезопасность пропсов

#### 4. Custom Hook Pattern
**Цель:** Переиспользование логики

**Примеры в проекте:**
```typescript
// src/hooks/use-mobile.tsx
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { /* logic */ }, []);
  return isMobile;
}

// src/hooks/use-toast.ts
export function useToast() { /* toast logic */ }
```

**Использование:**
```tsx
const isMobile = useIsMobile();
const { toast } = useToast();
```

#### 5. Layout Pattern (Composition)
**Цель:** Гибкая компоновка UI

**Реализация:**
```tsx
// src/pages/Index.tsx
const Index = () => (
  <div className="min-h-screen bg-background">
    <Starfield />  {/* Background layer */}
    <Navigation /> {/* Fixed header */}
    <main>        {/* Content */}
      <HeroSection />
      <AboutSection />
      {/* ... */}
    </main>
    <Footer />
  </div>
);
```

**Слои (z-index):**
- `z-0`: Starfield (background)
- `z-10`: Content sections
- `z-50`: Navigation (fixed header)

#### 6. Smooth Scroll Pattern
**Цель:** Плавная навигация между секциями

**Реализация:**
```typescript
const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    const offset = 80; // Header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};
```

**Использование:**
```tsx
<a href="#about" onClick={(e) => {
  e.preventDefault();
  scrollToSection("#about");
}}>About</a>
```

**Дополнительно:**
```css
/* src/index.css */
html {
  scroll-behavior: smooth;
}
```

#### 7. Active Section Detection Pattern
**Цель:** Подсветка текущей секции в навигации

**Реализация:**
```typescript
// src/components/Navigation.tsx
const [activeSection, setActiveSection] = useState("home");

useEffect(() => {
  const handleScroll = () => {
    const sections = navItems.map(item => item.href.slice(1));
    const current = sections.find(section => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });
    if (current) setActiveSection(current);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**Альтернатива (более производительная):**
Использовать Intersection Observer API

#### 8. Canvas Animation Pattern (Starfield)
**Цель:** Производительная анимация фона

**Реализация:**
```typescript
// src/components/Starfield.tsx
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  // Setup stars data
  const stars: Star[] = [ /* ... */ ];

  // Animation loop
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      // Update position
      star.y += star.speed;
      // Draw star
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  };

  animate();
  return () => cancelAnimationFrame(animationFrame);
}, []);
```

**Преимущества:**
- Использование GPU через Canvas API
- requestAnimationFrame для оптимизации
- Низкое потребление ресурсов

#### 9. Utility-First Styling Pattern
**Цель:** Быстрая разработка UI с Tailwind

**Реализация:**
```tsx
<div className="min-h-screen bg-background text-foreground relative">
  <section className="flex items-center justify-center px-4">
    <div className="pixel-border bg-card hover:bg-muted transition-colors">
      {/* ... */}
    </div>
  </section>
</div>
```

**Кастомные утилиты:**
```css
/* src/index.css */
.pixel-border {
  border: var(--pixel-border) solid hsl(var(--border));
  box-shadow: var(--pixel-shadow);
}

.pixel-glow {
  box-shadow: var(--pixel-glow);
}
```

#### 10. Theme Persistence Pattern
**Цель:** Сохранение выбора темы между сессиями

**Реализация:**
```typescript
// src/components/ThemeToggle.tsx
const [theme, setTheme] = useState<"dark" | "light">("dark");

useEffect(() => {
  const savedTheme = localStorage.getItem("theme") as "dark" | "light" || "dark";
  setTheme(savedTheme);
  document.documentElement.classList.toggle("light", savedTheme === "light");
}, []);

const toggleTheme = () => {
  const newTheme = theme === "dark" ? "light" : "dark";
  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);
  document.documentElement.classList.toggle("light", newTheme === "light");
};
```

**Преимущества:**
- Нет flash of unstyled content (FOUC)
- Сохранение предпочтения пользователя
- Простая реализация без библиотек

## Ключевые технические решения

### 1. Pixel-Art Design System

#### CSS Architecture
```css
:root {
  /* Colors (HSL format) */
  --primary: 189 97% 55%;      /* Cyan */
  --secondary: 328 86% 60%;    /* Pink */
  --accent: 142 76% 56%;       /* Green */

  /* Pixel effects */
  --pixel-shadow: 4px 4px 0px hsl(222 47% 8%);
  --pixel-glow: 0 0 20px hsl(var(--primary) / 0.5);
  --pixel-border: 3px;

  /* No rounded corners */
  --radius: 0px;
}
```

#### Design Principles
1. **Sharp edges** - `border-radius: 0`
2. **Chunky borders** - `3px solid`
3. **Blocky shadows** - `4px 4px 0px` (не blur)
4. **Limited palette** - 3 основных цвета (primary, secondary, accent)
5. **Monospace fonts** - `Courier New` для retro feel

#### Animations
```typescript
// tailwind.config.ts
animations: {
  "pixel-float": "pixel-float 3s ease-in-out infinite",
  "pixel-pulse": "pixel-pulse 2s ease-in-out infinite",
  "slide-in-left": "slide-in-left 0.5s ease-out",
}
```

### 2. Navigation & Scroll Management

#### Fixed Header with Scroll Detection
```typescript
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 20);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// Conditional styling
className={cn(
  "fixed top-0 z-50",
  isScrolled ? "bg-background/95 backdrop-blur-sm pixel-border" : "bg-transparent"
)}
```

#### Mobile Menu
```typescript
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Toggle button
<button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
  {isMobileMenuOpen ? <X /> : <Menu />}
</button>

// Conditional rendering
{isMobileMenuOpen && (
  <div className="md:hidden pixel-border">
    {/* Mobile nav items */}
  </div>
)}
```

### 3. Responsive Design Strategy

#### Breakpoints (Tailwind default)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px (custom)

#### Mobile-First Approach
```tsx
// Example: Hero Section
<h1 className="text-4xl sm:text-6xl lg:text-7xl">
<div className="flex flex-col sm:flex-row gap-4">
<span className="sm:hidden">{name.split(" ")[0]}</span>
<span className="hidden sm:inline">{name}</span>
```

#### Responsive Navigation
```tsx
{/* Desktop nav */}
<ul className="hidden md:flex">

{/* Mobile nav */}
<div className="md:hidden">
```

### 4. Performance Optimizations

#### Code Organization
- **Component splitting** - каждая секция в отдельном файле
- **Config separation** - данные отдельно от логики
- **Utility functions** - `lib/utils.ts` для `cn()` helper

#### Asset Optimization
- **No external fonts** (пока) - используем system fonts
- **SVG icons** через lucide-react (tree-shakeable)
- **Canvas animation** - более производительно чем CSS для множества элементов

#### Future Optimizations (рекомендации)
```typescript
// Lazy loading sections
const HeroSection = lazy(() => import("@/components/sections/HeroSection"));

// Image optimization
<img loading="lazy" src="..." />

// Route-based code splitting
const Index = lazy(() => import("./pages/Index"));
```

### 5. Type Safety Patterns

#### Config Interfaces
```typescript
// src/config/projects.config.ts
export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
  featured?: boolean;
}

export const projectsConfig: Project[] = [ /* ... */ ];
```

#### Component Props
```typescript
interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
}
```

#### Utility Types
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 6. State Management Strategy

#### Component-Level State
```typescript
// Local state для UI
const [activeSection, setActiveSection] = useState("home");
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [theme, setTheme] = useState<"dark" | "light">("dark");
```

#### Global State (пока не используется)
- Нет необходимости в Redux/Zustand
- Весь контент статичен (из конфигов)
- Для будущих интеграций: React Query готов

#### Persistent State
```typescript
// localStorage для темы
localStorage.setItem("theme", newTheme);
const savedTheme = localStorage.getItem("theme");
```

## Соглашения и Best Practices

### File Naming
- **Components:** PascalCase (`HeroSection.tsx`, `PixelButton.tsx`)
- **Config files:** camelCase (`site.config.ts`, `projects.config.ts`)
- **Utility files:** camelCase (`utils.ts`)
- **Styles:** kebab-case (`index.css`)

### Component Structure
```typescript
// 1. Imports
import { useState } from "react";
import { ComponentName } from "@/components/ComponentName";
import { config } from "@/config/config";

// 2. Types/Interfaces
interface Props { /* ... */ }

// 3. Component
export const ComponentName = ({ prop }: Props) => {
  // 3.1. Hooks
  const [state, setState] = useState();
  useEffect(() => { /* ... */ }, []);

  // 3.2. Handlers
  const handleClick = () => { /* ... */ };

  // 3.3. Render helpers
  const renderItem = () => { /* ... */ };

  // 3.4. Return JSX
  return (
    <div>
      {/* ... */}
    </div>
  );
};
```

### CSS Class Ordering
```tsx
<div className="
  /* Layout */
  flex items-center justify-center
  /* Spacing */
  px-4 py-8 gap-4
  /* Sizing */
  w-full h-screen
  /* Typography */
  text-xl font-bold
  /* Colors */
  bg-background text-foreground
  /* Effects */
  pixel-border hover:bg-muted transition-colors
"/>
```

### Import Aliases
```typescript
// Use @ alias for src imports
import { Navigation } from "@/components/Navigation";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
```

### Accessibility Practices
```tsx
// Semantic HTML
<header>, <nav>, <main>, <section>, <footer>

// ARIA labels
<button aria-label="Toggle menu">
<canvas aria-hidden="true">

// Keyboard navigation
onClick={(e) => { e.preventDefault(); /* ... */ }}

// Link security
<a target="_blank" rel="noopener noreferrer">
```

## Anti-Patterns (чего избегаем)

### ❌ Избегаем:
1. **Inline styles** - используем Tailwind/CSS классы
2. **Hardcoded content** - используем конфиги
3. **Глубокая вложенность** - максимум 3-4 уровня
4. **Any types** - используем конкретные типы
5. **Class names без cn()** - используем `cn()` для merge

### ✅ Предпочитаем:
1. **Functional components** над class components
2. **Hooks** над HOCs
3. **Composition** над inheritance
4. **TypeScript** над JavaScript
5. **Config-driven** над hardcoded

## Диаграммы архитектуры

### Component Communication Flow
```
User Interaction
       ↓
  Navigation
       ↓
  scrollToSection()
       ↓
  Section ID (#about, #projects)
       ↓
  Smooth scroll
       ↓
  Active section detection
       ↓
  Update navigation state
```

### Theme Toggle Flow
```
User clicks ThemeToggle
       ↓
  toggleTheme()
       ↓
  Update React state
       ↓
  Save to localStorage
       ↓
  Toggle .light class on <html>
       ↓
  CSS variables cascade
       ↓
  Entire UI updates
```

### Data Flow
```
Config Files (src/config/)
       ↓
  Import in Components
       ↓
  Render with data
       ↓
  User sees content

(No API, no server, fully static)
```
