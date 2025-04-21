import Player from '@/components/Player.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Player,
    },
    {
      path: '/auth/callback',
      name: 'authCallback',
      component: Player,
    },
  ],
})

export default router
