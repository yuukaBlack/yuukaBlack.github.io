import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/HomePage.vue'
import About from '../views/about/AboutPage.vue'
import List from '../views/list/ListPage.vue'
import Blog from '../views/blog/BlogPage.vue'

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
      component: About
    },
    {
      path: '/list',
      name: 'list',
      component: List
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog
    }
  ]
})

export default router
