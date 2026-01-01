import { createWebHistory, createRouter } from "vue-router";

import Canvas from "./components/Canvas.vue";

import NodeDrawer from "./components/NodeDrawer.vue";

const routes = [
  {
    path: "/",
    component: Canvas,
    children: [
      {
        path: "node/:id",
        name: "node-details",
        component: NodeDrawer,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
