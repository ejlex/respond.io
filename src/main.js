import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import App from "./App.vue";
import router from "./router";
import "./style.css";

const pinia = createPinia();
const app = createApp(App);

const vueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        networkMode: "always",
        staleTime: Infinity,
        gcTime: 60 * 60 * 1000,
      },
    },
  },
};

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.use(pinia);
app.use(router);
app.mount("#app");
