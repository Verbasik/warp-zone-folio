# Tech Context: Warp Zone Folio

## Технологический стек

### Core Technologies

#### Frontend Framework
- **React 18.3.1**
  - Библиотека для построения UI
  - Hooks-based архитектура
  - Functional components
  - Причина выбора: индустриальный стандарт, большая экосистема, отличная производительность

#### Language
- **TypeScript 5.8.3**
  - Типобезопасность на этапе разработки
  - Автокомплит и IntelliSense
  - Интерфейсы для конфигураций
  - Причина выбора: предотвращение ошибок, лучший DX, maintainability

#### Build Tool
- **Vite 5.4.19**
  - Быстрый dev server с HMR
  - Оптимизированная production сборка
  - Plugin: @vitejs/plugin-react-swc (SWC для быстрой компиляции)
  - Причина выбора: скорость разработки, оптимизация bundle, современный tooling

### Styling

#### CSS Framework
- **Tailwind CSS 3.4.17**
  - Utility-first подход
  - Кастомная конфигурация для pixel-art дизайна
  - Plugins: tailwindcss-animate, @tailwindcss/typography
  - Причина выбора: быстрая разработка, консистентность, малый bundle size

#### CSS Architecture
- **CSS Custom Properties (CSS Variables)**
  - Design tokens для цветов, shadows, borders
  - Темизация через CSS классы (`:root`, `.light`)
  - Pixel-art specific utilities (pixel-border, pixel-glow)
  - Причина выбора: гибкость темизации, отсутствие JS для theme toggle

#### Animations
- **Tailwind animations** + **Custom keyframes**
  - pixel-float, pixel-pulse, slide-in-left/right
  - twinkle для звезд
  - Причина выбора: performance, декларативность

### UI Components

#### Component Library
- **shadcn/ui** + **Radix UI**
  - Unstyled, accessible компоненты из Radix UI
  - Кастомизированные через shadcn/ui CLI
  - Компоненты: Button, Card, Toast, Dialog, и др.
  - Причина выбора: accessibility из коробки, полная кастомизация, копирование в проект (не зависимость)

#### Icons
- **Lucide React 0.462.0**
  - Tree-shakeable icon library
  - Используемые иконы: Github, Mail, ArrowDown, Menu, X, Moon, Sun
  - Причина выбора: консистентный стиль, малый размер, React-friendly

### Routing

#### Router
- **React Router DOM 6.30.1**
  - Client-side routing
  - **BrowserRouter** в коде (но для GitHub Pages нужен HashRouter)
  - Routes: `/` (Index), `/*` (NotFound)
  - Причина выбора: стандарт для SPA, хорошая документация

### State Management

#### Global State
- **React Context** (не используется в текущей версии)
- **localStorage** для сохранения темы
- **React hooks** (useState, useEffect) для локального стейта

#### Server State
- **@tanstack/react-query 5.83.0**
  - Настроен в App.tsx, но пока не используется
  - Готов для будущих API интеграций
  - Причина добавления: подготовка к возможным асинхронным операциям

### Form Handling

- **React Hook Form 7.61.1** - управление формами
- **Zod 3.25.76** - валидация схем
- **@hookform/resolvers 3.10.0** - интеграция RHF + Zod
- Использование: Contact секция (потенциально)

### Development Tools

#### Linting
- **ESLint 9.32.0**
  - @eslint/js
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh
  - typescript-eslint 8.38.0
  - Конфигурация: eslint.config.js

#### Type Checking
- **TypeScript**
  - Конфигурации: tsconfig.json, tsconfig.app.json, tsconfig.node.json
  - Строгий режим включен

#### Dev Dependencies
- **@types/node** - типы для Node.js API
- **@types/react** - типы для React
- **@types/react-dom** - типы для ReactDOM

### Build & Bundling

#### Production Build
```bash
npm run build
# Output: dist/ folder
# Assets: hashed filenames для кэширования
# Optimization: minification, tree-shaking
```

#### Build Configuration
- **Vite config** (vite.config.ts):
  - Base URL: `/` (нужно изменить для project pages)
  - Alias: `@` → `./src`
  - Server: порт 8080, host `::`
  - Plugins: react-swc, lovable-tagger (только dev mode)

#### Preview
```bash
npm run preview
# Локальный сервер для проверки production build
```

### Deployment

#### Target Platform
- **GitHub Pages**
  - Статический хостинг
  - Бесплатный для публичных репозиториев
  - HTTPS из коробки
  - Custom domain support

#### Deployment Methods

**Метод 1: gh-pages package**
```bash
npm install --save-dev gh-pages
# package.json scripts:
# "predeploy": "npm run build"
# "deploy": "gh-pages -d dist"
```

**Метод 2: GitHub Actions**
- Workflow файл: `.github/workflows/deploy.yml`
- Триггер: push to main
- Steps: checkout, setup-node, install, build, deploy

#### Base URL Configuration
- Для `username.github.io`: `base: '/'`
- Для `username.github.io/repo`: `base: '/repo/'`

### Project Structure

```
warp-zone-folio/
├── src/
│   ├── components/          # UI компоненты
│   │   ├── sections/       # Секции страницы
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── TimelineSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── ui/             # shadcn/ui компоненты
│   │   ├── Navigation.tsx
│   │   ├── NavLink.tsx
│   │   ├── PixelButton.tsx
│   │   ├── Starfield.tsx
│   │   └── ThemeToggle.tsx
│   ├── config/             # Конфигурационные файлы
│   │   ├── site.config.ts  # Персональная информация
│   │   ├── projects.config.ts
│   │   └── skills.config.ts
│   ├── hooks/              # Кастомные хуки
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts        # Утилиты (cn helper)
│   ├── pages/
│   │   ├── Index.tsx       # Главная страница
│   │   └── NotFound.tsx    # 404 страница
│   ├── App.tsx             # Root компонент
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles + design system
│   └── vite-env.d.ts
├── public/                 # Статические ресурсы
├── dist/                   # Production build (генерируется)
├── memory/                 # Банк памяти (документация)
│   ├── memory-bank/
│   └── rules/
├── index.html              # HTML template
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.js
├── postcss.config.js
└── components.json         # shadcn/ui config
```

### Configuration Files

#### package.json
- **name**: `vite_react_shadcn_ts`
- **version**: `0.0.0`
- **type**: `"module"` (ESM)
- **scripts**: dev, build, build:dev, lint, preview

#### vite.config.ts
```typescript
{
  server: { host: "::", port: 8080 },
  plugins: [react(), componentTagger()],
  resolve: { alias: { "@": "./src" } }
}
```

#### tailwind.config.ts
- **darkMode**: `["class"]`
- **content**: все TypeScript/TSX файлы
- **theme.extend**:
  - colors: от CSS custom properties
  - fontFamily: mono (Courier New), pixel (Press Start 2P - не загружен)
  - animations: pixel-float, pixel-pulse, slide-in-*

#### tsconfig.json
- **target**: ES2020
- **lib**: ES2020, DOM, DOM.Iterable
- **module**: ESNext
- **moduleResolution**: bundler
- **strict**: true
- **paths**: { "@/*": ["./src/*"] }

### Third-Party Integrations

#### Analytics (не настроены)
- Рекомендация: Google Analytics, Vercel Analytics, или Plausible
- Добавление: script в index.html или React компонент

#### Forms (не настроены)
- Рекомендация: Formspree, Getform, или EmailJS для contact формы
- Альтернатива: mailto: ссылка (текущее решение)

#### CMS (опционально)
- Возможность интеграции: Contentful, Sanity, или Strapi
- Для нетехнических пользователей

### Performance Considerations

#### Bundle Size Optimization
- **Tree-shaking** через Vite
- **Code splitting** через dynamic imports
- **Lazy loading** компонентов (пока не реализовано)

#### Runtime Performance
- **Canvas animation** для Starfield (requestAnimationFrame)
- **Intersection Observer** для определения активной секции
- **CSS animations** вместо JS где возможно

#### Loading Performance
- **Static assets** - предкомпилированные
- **Font loading** - system fonts (Courier New) для быстрой загрузки
- **Image optimization** - рекомендуется WebP формат

### Browser Support

#### Target Browsers
- Chrome/Edge (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Mobile browsers (iOS Safari, Chrome Mobile)

#### Polyfills
- Не требуются для современных браузеров
- Vite автоматически добавляет необходимые при сборке

### Environment Variables (не используются)

Для будущего использования:
```
VITE_API_URL=...
VITE_ANALYTICS_ID=...
```

### Known Issues & Limitations

#### Текущие ограничения:
1. **BrowserRouter vs HashRouter**
   - В коде используется BrowserRouter
   - Для GitHub Pages нужен HashRouter
   - Решение: изменить в App.tsx

2. **Base URL**
   - Нужно настроить для project pages
   - В vite.config.ts: `base: '/repo-name/'`

3. **Font "Press Start 2P"**
   - Упоминается в tailwind.config.ts
   - Не загружается (нет в index.html)
   - Fallback: Courier New

4. **Placeholders**
   - Весь контент - плейсхолдеры
   - Требует кастомизации перед использованием

### Dependencies Overview

#### Production Dependencies (основные)
- **react**, **react-dom** - Core framework
- **react-router-dom** - Routing
- **@tanstack/react-query** - Server state (подготовка)
- **lucide-react** - Icons
- **@radix-ui/** packages - UI primitives
- **tailwind-merge**, **clsx**, **class-variance-authority** - Styling utilities
- **react-hook-form**, **zod** - Forms & validation
- **next-themes** - Theme management (не используется, можно удалить)

#### Dev Dependencies
- **vite**, **@vitejs/plugin-react-swc** - Build tool
- **typescript**, **typescript-eslint** - Type checking & linting
- **tailwindcss**, **autoprefixer**, **postcss** - CSS processing
- **eslint**, **@eslint/js**, plugins - Code quality
- **lovable-tagger** - Dev mode tagging

### Security Considerations

#### Dependencies Security
- Регулярное обновление через `npm audit`
- Проверка уязвимостей через GitHub Dependabot

#### Content Security
- Нет пользовательского ввода (статический контент)
- Нет XSS рисков
- Внешние ссылки: `rel="noopener noreferrer"`

#### Deployment Security
- HTTPS через GitHub Pages
- No server-side vulnerabilities (статический сайт)
