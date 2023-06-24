import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import uiComponents from "./uiComponents";

const app = createApp(App)
app.use(store)
app.use(router)

uiComponents.map((component) => app.component(component.name, component))


app.mount('#app')