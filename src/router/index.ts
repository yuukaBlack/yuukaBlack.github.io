import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/HomePage.vue'

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
      component: () => import('../views/about/AboutPage.vue')
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/list/ListPage.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/blog/BlogPage.vue')
    }
  ]
})

export default router
