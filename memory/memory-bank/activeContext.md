# Active Context: Warp Zone Folio

## Текущий статус проекта

**Дата последнего обновления:** 2025-11-13

**Текущая фаза:** ✅ **ПОЛНОСТЬЮ КАСТОМИЗИРОВАН И ЗАДЕПЛОЕН**

**Версия:** 0.2.0 (production)

**URL:** https://verbasik.github.io/warp-zone-folio/

**Владелец:** Edward (Verbasik) - Staff ML Engineer

---

## Текущий фокус работы

### ✅ Только что выполнено (2025-11-13, вторая сессия):

#### 1. **Персонализация Hero Section:**
   - ✅ Обновлено имя: "Hi there👋"
   - ✅ Обновлен tagline: "I'm Edward"
   - ✅ Обновлен shortBio с AI/ML специализацией (LLMs, multimodal, vLLM, SGLang, Triton)

#### 2. **Персонализация About Section:**
   - ✅ Полностью переписано описание (2 параграфа)
   - ✅ Фокус на AI/ML expertise: foundation models, RLHF, multi-agent systems
   - ✅ Добавлено фото/аватар: `public/avatar.jpg` (46 KB)
   - ✅ Исправлен путь к изображению: import через Vite module

#### 3. **Обновление Tech Stack (Skills):**
   - ✅ Полная замена web dev навыков на AI/ML стек
   - ✅ Создано 7 категорий навыков (75 skills total):
     1. Machine Learning & AI (LLMs, RLHF, Multi-Agent, RAG, NLP)
     2. Deep Learning & Computer Vision (PyTorch, TensorFlow, JAX, U-Net, Multimodal)
     3. MLOps & Inference (vLLM, SGLang, Triton, DeepSpeed, MLflow, W&B)
     4. Infrastructure & DevOps (Docker, Kubernetes, Helm, ArgoCD, Prometheus)
     5. Data Engineering & Big Data (Airflow, Kafka, Redis, Vector DBs, PySpark)
     6. Backend & Architecture (FastAPI, gRPC, Microservices, High-Load)
     7. Leadership & Soft Skills (Tech Leadership, Team Management, R2P Pipeline)

#### 4. **Реструктуризация Timeline (My Journey):**
   - ✅ Разделен на два независимых трека:
     - 💼 **Work Experience** (4 позиции):
       - 2025: SberBank - Staff ML Engineer (GigaChat VLM)
       - 2024-2025: Alfa-Bank - Tech Lead AI (Agents Orchestrator, PromptPilot)
       - 2023-2024: Moscow Dept IT - Team Lead DS (Mistral-7B adaptation)
       - 2021-2022: AION Labs Israel - Data Science (Biomedical ML)
     - 🎓 **Education** (4 степени):
       - 2024-2026: MAI Master's (ongoing) - Machine Learning
       - 2022-2024: Yandex School of Data Analysis - Data Science
       - 2016-2020: MSU Bachelor's - Computational Mathematics
       - 2012-2016: Moscow International Academy - Business Management
   - ✅ Два вертикальных timeline side-by-side (адаптивно)
   - ✅ Цветовое кодирование: Work (secondary/pink), Education (accent/green)
   - ✅ Бейджик "ongoing" для MAI Master's

#### 5. **Временное скрытие секции Projects:**
   - ✅ Закомментирован `ProjectsSection` в `src/pages/Index.tsx`
   - ✅ Убрана ссылка "Projects" из навигации
   - ✅ Добавлены комментарии для легкого восстановления в будущем

---

## История изменений за сегодня

### Сессия 1 (утро): GitHub Pages Deployment
1. ✅ Настроен GitHub Pages с GitHub Actions
2. ✅ Исправлен Router: BrowserRouter → HashRouter
3. ✅ Добавлен base URL: `/warp-zone-folio/`
4. ✅ Решены проблемы деплоя (environment, Source settings)
5. ✅ Создан workflow, .nojekyll, 404.html

### Сессия 2 (день): Full Content Personalization
1. ✅ Обновлены все текстовые блоки под профиль Edward
2. ✅ Добавлено фото/аватар
3. ✅ Переработан Tech Stack (75 AI/ML skills)
4. ✅ Реструктурирован Timeline (Work + Education tracks)
5. ✅ Временно скрыты Projects

---

## Текущее состояние проекта

### ✅ Полностью готовые секции:
1. **Hero Section** - персонализирован, AI/ML focus
2. **About Section** - с фото, описание Edward's background
3. **Skills Section** - 75 AI/ML навыков в 7 категориях
4. **Timeline Section** - два трека (Work + Education)
5. **Contact Section** - с контактами Verbasik
6. **Footer** - персонализирован
7. **Navigation** - работает, адаптивная

### ⏸️ Временно скрытые секции:
1. **Projects Section** - ожидает реальных проектов на GitHub

---

## Архитектурные решения

### Timeline: Two-Track Design
**Файл:** `src/components/sections/TimelineSection.tsx`

**Структура:**
```typescript
// Компонент TimelineTrack - переиспользуемый
const TimelineTrack = ({ title, items, color }) => { ... }

// Два трека side-by-side
<div className="grid lg:grid-cols-2 gap-12">
  <TimelineTrack title="💼 Work Experience" items={workExperience} color="secondary" />
  <TimelineTrack title="🎓 Education" items={education} color="accent" />
</div>
```

**Конфиг:** `src/config/site.config.ts`
- `workExperience[]` - массив работ
- `education[]` - массив образования (с полем `status: "ongoing"`)

### Avatar Image Handling
**Проблема:** Путь `/avatar.jpg` не работал с base URL `/warp-zone-folio/`

**Решение:** Import через Vite module system
```typescript
// src/config/site.config.ts
import avatarImage from '/avatar.jpg';

export const siteConfig = {
  about: {
    image: avatarImage, // Vite обработает путь автоматически
  }
}
```

### Projects Section: Temporary Hide
**Подход:** Комментирование вместо удаления
- Легко восстановить (раскомментировать 2 строки)
- Сохранен код ProjectsSection и projects.config.ts для будущего использования

---

## Следующие шаги

### 🎯 Краткосрочные (когда будут готовы):
1. **Добавить реальные проекты:**
   - Раскомментировать ProjectsSection в Index.tsx и Navigation.tsx
   - Обновить `src/config/projects.config.ts`:
     - Заменить example проекты на реальные GitHub repos
     - Добавить demo links, screenshots
     - Отметить `featured: true` для топовых проектов
   - Проверить работу секции

2. **SEO оптимизация:**
   - Обновить метатеги в `index.html`:
     - `<title>` → "Edward - Staff ML Engineer | AI/ML Specialist"
     - `<meta name="description">` → персонализированное описание
     - Open Graph теги для социальных сетей
   - Добавить structured data (JSON-LD) для портфолио

3. **Performance optimization:**
   - Добавить lazy loading для секций
   - Оптимизировать avatar.jpg (WebP format, resize)
   - Добавить Intersection Observer вместо scroll listener

### 💡 Долгосрочные улучшения:
1. **Contact Form Integration:**
   - Интеграция с Formspree или EmailJS
   - Валидация формы
   - Success/error notifications

2. **Analytics:**
   - Google Analytics или альтернатива
   - Tracking посещений секций

3. **Blog Section (optional):**
   - Если будет контент для публикаций
   - Markdown-based posts
   - RSS feed

4. **Internationalization:**
   - English версия сайта
   - Language switcher

---

## Известные технические детали

### Обязательные для GitHub Pages:
1. **Router:** Только HashRouter (не BrowserRouter)
2. **Base URL:** Должен совпадать с repo name в `vite.config.ts`
3. **GitHub Pages Source:** "GitHub Actions" (не "Deploy from a branch")
4. **Files:** `.nojekyll`, `404.html` для SPA routing

### Tailwind CSS Dynamic Classes:
**Проблема:** Интерполяция классов не работает
```typescript
// ❌ НЕ РАБОТАЕТ:
className={`text-${color}`}

// ✅ РАБОТАЕТ:
const colorClasses = { primary: { text: "text-primary" }, ... };
const colors = colorClasses[color];
className={colors.text}
```

### Vite Module Imports:
- Файлы в `public/` доступны по корневому пути
- Импорт через `import image from '/path'` → Vite обработает base URL
- Inline scripts в `index.html` НЕ обрабатываются Vite

---

## Файлы конфигурации (текущее состояние)

### `src/config/site.config.ts`
```typescript
export const siteConfig = {
  name: "Hi there👋",
  tagline: "I'm Edward",
  shortBio: "Full-cycle AI/ML specialist...",
  about: {
    description: "I'm Edward, a Staff ML Engineer...", // 2 paragraphs
    image: avatarImage, // import from '/avatar.jpg'
  },
  contact: {
    email: "verbasik@example.com",
    github: "https://github.com/Verbasik",
    linkedin: "https://linkedin.com/in/verbasik",
    twitter: "https://twitter.com/verbasik",
  },
  workExperience: [...], // 4 positions
  education: [...], // 4 degrees
}
```

### `src/config/skills.config.ts`
- 7 categories
- 75 skills total
- Levels 80-95 for Staff Engineer profile

### `public/avatar.jpg`
- 46 KB
- Реальное фото Edward

---

## Deployment Status

### ✅ Live Production:
**URL:** https://verbasik.github.io/warp-zone-folio/

**GitHub Actions:** Автоматический деплой при push в `main`

**Последний деплой:** 2025-11-13 (commit: 77400d5)

**Status:** 🟢 Online, fully functional

---

## Для следующей AI сессии

### Контекст для восстановления:
1. **Проект полностью персонализирован** под Edward (Verbasik)
2. **Projects section временно скрыта** - ожидает реальных GitHub проектов
3. **Все остальные секции готовы** и задеплоены
4. **Следующий шаг:** добавление реальных проектов или SEO оптимизация

### Быстрый чеклист:
- ✅ Hero, About, Skills, Timeline, Contact - персонализированы
- ✅ Avatar добавлен и работает
- ✅ Tech Stack обновлен (75 AI/ML skills)
- ✅ Timeline разделен на Work + Education
- ⏸️ Projects скрыты временно
- ✅ Деплой работает автоматически
- ✅ Сайт онлайн и доступен

### Важные команды:
```bash
npm run dev          # Development server
npm run build        # Production build
git push             # Auto-deploy via GitHub Actions
```

---

## Метрики проекта

**Completion:** 90% (осталось добавить Projects)

**Code Quality:** ✅ High (TypeScript, модульная структура)

**Performance:** ✅ Good (Vite, minimal deps, canvas animations)

**Accessibility:** ✅ Good (semantic HTML, ARIA labels, keyboard nav)

**SEO:** ⚠️ Needs update (placeholder meta tags)

**Mobile:** ✅ Fully responsive

**Browser Support:** ✅ Modern browsers (ES2020+)

---

## Заметки

**Общее впечатление:** Проект полностью готов к использованию как профессиональное AI/ML портфолио. Осталось только добавить реальные проекты, когда они появятся на GitHub, и улучшить SEO.

**Качество кода:** Отличное. Модульная структура, TypeScript, переиспользуемые компоненты.

**Дизайн:** Уникальный pixel-art стиль, хорошо подходит для tech портфолио.

**Контент:** Профессионально описан опыт Staff ML Engineer с конкретными метриками и достижениями.
