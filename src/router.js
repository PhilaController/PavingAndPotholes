import Vue from "vue";
import Router from "vue-router";
import Potholes from "./views/Potholes.vue";
import Paving from "./views/Paving.vue";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/paving",
      component: Paving
    },
    {
      path: "/potholes",
      component: Potholes
    }
  ]
});
