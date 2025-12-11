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

export default router;

