import Vue from "vue";
import "./styles/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Directives from "./directives";
import I18N from "@/utils/I18N";

Vue.prototype.I18N = I18N;

Vue.use(Directives);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
