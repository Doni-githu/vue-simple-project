import { createStore } from "vuex";
import post from "@/modules/post";
import album from "@/modules/album";
import todos from "@/modules/todos"
const store = createStore({
  modules: { post, album, todos }
})

export default store