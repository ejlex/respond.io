import { createWebHistory, createRouter } from "vue-router";

import Canvas from "./components/Canvas.vue";

const routes = [{ path: "/", component: Canvas }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
