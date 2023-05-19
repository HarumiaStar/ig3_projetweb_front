import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { User } from "../utils/user"

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
      path: '/films',
      name: 'filmsHome',
      children: [
        {
          path: '',
          name: 'filmIndex',
          component: () => import('../views/film/Index.vue')
        },
        {
          path: 'create',
          name: 'filmCreate',
          component: () => import('../views/film/Crud.vue'),
          props: {
            default: true,
            mode: 'create'
          }
        },
        {
          path: ':id',
          name: 'filmRead',
          component: () => import('../views/film/Crud.vue'),
          props: {
            default: true,
            mode: 'read'
          }
        },
        {
          path: ':id/edit',
          name: 'filmEdit',
          component: () => import('../views/film/Crud.vue'),
          props: {
            default: true,
            mode: 'edit'
          }
        }
      ]
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
      },{
          path: 'login',
        name: 'userLogin',
        component: () => import('../views/user/Login.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from) => {
  if (
    // make sure the user is authenticated
    !User.isAuthenticated() &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'userLogin' && to.name !== 'userCreate' && to.name !== 'home'
    ) {
    // redirect the user to the login page
    return { name: 'userLogin' }
  }
})

export default router
