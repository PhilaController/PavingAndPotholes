import "es6-promise/auto";
import Vue from "vue";
import App from "@/App";
import store from "@/store";
import router from "@/router";
import VueScrollTo from "vue-scrollto";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// allow scrolling to anchors on the same page
Vue.use(VueScrollTo);

// make FA does not watch SVG elements
if (window.FontAwesome) window.FontAwesome.config.observeMutations = false;
Vue.config.productionTip = false;

// Vue2Leaflet setup
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

// load and set the HTML template we are using
let audit_content = $(".audit-content");
audit_content.html(`<div id="app"></div>`);

// remove the report button
$(".entry-header .btn")
  .first()
  .remove();

// add help message
let helpMessage = `<p class='help-message'>
  Comments or feedback? Please contact
  <a href="mailto:controller.policy@phila.gov">controller.policy@phila.gov</a>.
  </p>`;
$(".back-link").after(helpMessage);

// mount the app
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
