import { createStore } from "vuex";
import post from "@/modules/post";

const store = createStore({
  modules: { post }
})

export default store