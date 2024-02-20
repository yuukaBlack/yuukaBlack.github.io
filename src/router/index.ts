import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      name: '/',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/about/About.vue')
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/list/List.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/blog/Blog.vue')
    }
  ]
})

export default router
