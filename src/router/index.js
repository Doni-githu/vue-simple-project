import { createRouter, createWebHistory } from "vue-router";
import { AlbumsView, TodosView, PostsView } from "@/views"
const routes = [
  {
    path: "/",
    name: "post",
    component: PostsView,
  },
  {
    path: "/albums",
    name: "albums",
    component: AlbumsView
  },
  {
    path: '/todos',
    name: 'todos',
    component: TodosView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
