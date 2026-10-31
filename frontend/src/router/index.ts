import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/sign-in' },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('@/views/SignInView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('@/views/SignUpView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('@/views/WelcomeView.vue'),
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

let sessionRestored = false;

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (!sessionRestored) {
    await auth.restoreSession();
    sessionRestored = true;
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'sign-in' };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'app' };
  }
});

export default router;
