import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Home from './views/Home.vue'
import Select from './views/Select.vue'
import EditTable from './views/EdtTbl.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/custom-decoration/home'
  },
  {
    path: '/custom-decoration',
    redirect: '/custom-decoration/home'
  },
  {
    path: '/custom-decoration/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/custom-decoration/select',
    name: 'Select',
    component: Select
  },
  {
    path: '/custom-decoration/edttbl',
    name: 'EditTable',
    component: EditTable
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
