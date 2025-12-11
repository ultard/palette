# Palette Generator 🎨

Генератор цветовых палитр с продвинутыми возможностями. Создавайте гармоничные цветовые схемы, анализируйте контрастность, экспортируйте в различные форматы и делитесь палитрами.

## Возможности

- 🎨 Генерация случайных гармоничных палитр
- 🔧 Продвинутая генерация (аналогичная, монохромная, триада, комплементарная)
- 🎯 Генерация по настроению (спокойные, энергичные, профессиональные)
- ♿ Проверка контрастности по стандарту WCAG
- 💾 Сохранение палитр в библиотеку
- 📤 Экспорт в CSS, SCSS, Tailwind config
- 🔗 Шаринговые ссылки на палитры
- 🎨 Цветовой круг для выбора базового цвета

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Деплой на GitHub Pages

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

### Настройка

1. В настройках репозитория GitHub перейдите в **Settings → Pages**
2. В разделе **Source** выберите **GitHub Actions**
3. При пуше в ветку `main` или `master` автоматически запустится workflow деплоя
4. После успешного деплоя приложение будет доступно по адресу:
   - `https://<username>.github.io/<repository-name>/` (для обычных репозиториев)
   - `https://<username>.github.io/` (для репозиториев вида `username.github.io`)

### Ручной запуск деплоя

Вы также можете запустить деплой вручную:
1. Перейдите в **Actions** в вашем репозитории
2. Выберите workflow **Deploy to GitHub Pages**
3. Нажмите **Run workflow**

### Локальная проверка production сборки

Для проверки production сборки локально:

```sh
npm run build
npm run preview
```

Приложение будет доступно на `http://localhost:4173`
