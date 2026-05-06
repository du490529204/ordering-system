import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import Goods from '../pages/Goods.vue'
import Supplier from '../pages/Supplier.vue'
import Order from '../pages/Order.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/goods',
    children: [
      { path: '/goods', component: Goods },
      { path: '/supplier', component: Supplier },
      { path: '/order', component: Order }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken')
  if (to.path === '/login') return next()
  if (!token) return next('/login')
  next()
})

export default router