# Диагностика проблемы деплоя

## Проблема
На GitHub Pages загружается исходный index.html вместо собранного из dist/

## Возможные причины:

### 1. GitHub Pages настроен на деплой из ветки вместо Actions
**Как проверить:**
- Откройте: https://github.com/Verbasik/warp-zone-folio/settings/pages
- Проверьте секцию "Source"
- Если там выбрано "Deploy from a branch" → НЕПРАВИЛЬНО
- Должно быть: "GitHub Actions"

**Как исправить:**
1. В Source выберите "GitHub Actions"
2. Сохраните
3. Подождите новый деплой

### 2. Деплоится ветка gh-pages вместо Actions
**Симптомы:**
- Старая версия index.html
- Нет правильных путей к assets

**Решение:**
- Удалите ветку gh-pages если она есть
- Переключитесь на деплой через GitHub Actions

### 3. Кеширование CDN
**Решение:**
- Hard refresh: Ctrl+Shift+R
- Или подождите 5-10 минут

