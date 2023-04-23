import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/users',
      name: 'usersHome',
      children: [
        {
          path: '',
          name: 'userIndex',
          component: () => import('../views/user/Index.vue')
        },{
          path: 'register',
          name: 'userCreate',
          component: () => import('../views/user/Create.vue')
      },{
          path: ':id',
        name: 'userRead',
        component: () => import('../views/user/Read.vue')
      },{
          path: ':id/edit',
        name: 'userEdit',
        component: () => import('../views/user/Edit.vue')
      }
      ]
    }
  ]
})

export default router
