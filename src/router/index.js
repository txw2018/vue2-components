import Vue from 'vue'
import VueRouter from 'vue-router'
import Menu from '@/views/menu'

const childrenRoutes = []
const pages = require.context('../components', true, /\.vue$/)
pages.keys().forEach(page => {
  if (page.includes('/demo/')) {
    const pageModule = pages(page)
    const module = (pageModule.default || pageModule)
    const path = module.__file
    const pageName = path.slice(15, -15)
    childrenRoutes.push({
      path: `/${pageName}`,
      name: pageName,
      component: () => import(`@/components/${pageName}/demo/index.vue`)
    })
    console.log(module)
  }
})

Vue.use(VueRouter)
let flag = true
const routes = [
  {
    path: '/menu',
    name: 'menu',
    component: Menu
  },
  {
    path: '/tab',
    name: 'tab',
    component: () => import(/* webpackChunkName: "about" */ '../views/tab.vue')
  },
  {
    path: '*',
    redirect: '/menu'
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (flag) {
    flag = false
    childrenRoutes.forEach(route => {
      router.addRoute(route)
    })
    console.log(router)
    next({ ...to, replace: true })
  } else {
    next()
  }
})

export default router
