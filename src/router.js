import { createWebHistory, createRouter } from 'vue-router'

import Plane from './components/Plane.vue'

const routes = [
  { path: '/', component: Plane },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router