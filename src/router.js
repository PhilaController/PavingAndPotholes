import Vue from "vue";
import Router from "vue-router";
import PotholesPage from "@/views/Potholes";
import PavingPage from "@/views/Paving";
import HomePage from "@/views/Home";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage
    },
    {
      path: "/paving",
      component: PavingPage
    },
    {
      path: "/potholes",
      component: PotholesPage
    }
  ],
  // always return to top
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});
