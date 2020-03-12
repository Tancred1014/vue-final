import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import "bootstrap";
// import VeeValidate from "vee-validate";
// import zhTWValidate from "vee-validate/dist/locale/zh_TW";
// import Validator from "validator";
// import VueI18n from 'vue-i18n';
// import {
//   ValidationProvider
// } from 'vee-validate';

import App from "./App.vue";
import router from "./router";
import "./bus";
import currencyFilter from "./filters/currency";
import date from "./filters/date";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
// Vue.use(VueI18n);
// Vue.component('ValidationProvider', ValidationProvider);

// VeeValidate.Validator.localize("zh_TW", zhTWValidate);
// Vue.use(VeeValidate);

Vue.component("Loading", Loading);
Vue.filter("currency", currencyFilter);
Vue.filter("date", date);

axios.defaults.withCredentials = true;

// const i18n = new VueI18n({
//   locale: 'zhTW'
// });

// Vue.use(VeeValidate, {
//   i18n,
//   dictionary: {
//     zh_TW
//   }
// });

new Vue({
  render: h => h(App),
  router
}).$mount("#app");