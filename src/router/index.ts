import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      children: [
        {
          path: '/',
          name: 'home',
          component: Home
        },
        {
          path: '/:id',
          name: 'inspector',
          component: () => import('../views/Inspector.vue')
        }

      ]
    }
  ]
})

export default router
