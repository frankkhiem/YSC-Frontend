import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register')
  },
  {
    path: '/',
    component: () => import('../views/MainPage'),
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile')
      },
      {
        path: 'home-test',
        name: 'HomeTest',
        component: () => import('../views/HomeTest')
      }
    ]
  },
  {
    path: '/outlook/get-auth-code',
    name: 'Outlook Code',
    component: () => import('../views/OutlookCode')
  },
  {
    path: '/zalo/get-auth-code',
    name: 'Zalo Code',
    component: () => import('../views/ZaloCode')
  },
  {
    path: '/*',
    name: 'Not Found',
    component: () => import('../views/NotFoundPage')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
