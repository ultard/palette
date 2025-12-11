import { createRouter, createWebHistory } from 'vue-router';
import GeneratorView from '../views/GeneratorView.vue';
import LibraryView from '../views/LibraryView.vue';
import AdvancedView from '../views/AdvancedView.vue';

const routes = [
  {
    path: '/',
    name: 'generator',
    component: GeneratorView,
  },
  {
    path: '/advanced',
    name: 'advanced',
    component: AdvancedView,
  },
  {
    path: '/library',
    name: 'library',
    component: LibraryView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Обработка редиректа из 404.html
router.beforeEach((to, from, next) => {
  // Если есть параметр _path в query, это редирект из 404.html
  const pathParam = to.query._path;
  if (pathParam && typeof pathParam === 'string') {
    // Удаляем _path из query и редиректим на правильный путь
    const targetPath = decodeURIComponent(pathParam);
    const newQuery = { ...to.query };
    delete newQuery._path;
    next({
      path: targetPath,
      query: newQuery,
      replace: true,
    });
  } else {
    next();
  }
});

export default router;

