import "es6-promise/auto";
import App from "./App";
import Vue from "vue";
import store from "./store";
import router from "./router";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// make FA does not watch SVG elements
if (window.FontAwesome) window.FontAwesome.config.observeMutations = false;
Vue.config.productionTip = false;

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

// load and set the HTML template we are using
let audit_content = $(".audit-content");
audit_content.html(require("@/template.html"));

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#viz");
