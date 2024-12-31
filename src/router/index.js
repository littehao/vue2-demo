import Vue from "vue";
import VueRouter from "vue-router";
// import HomeView from "../views/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/gold",
  },
  {
    path: "/directive",
    name: "directive",
    component: () => import("../views/directive.vue"),
  },
  {
    path: "/gaodeGis",
    name: "gaodeGis",
    component: () => import("../views/gaodeGis.vue"),
  },
  {
    path: "/openlayers",
    name: "Openlayers",
    component: () => import("../views/openlayers.vue"),
  },
  {
    path: "/slider",
    name: "slider",
    component: () => import("../views/slider.vue"),
  },
  {
    path: "/loadmore",
    name: "loadmore",
    component: () => import("../views/IntersectionObserver.vue"),
  },
  {
    path: "/g6",
    name: "g6",
    component: () => import("../views/g6.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../views/test.vue"),
  },
  {
    path: "/web3dMap",
    name: "web3dMap",
    component: () => import("../views/web3dMap.vue"),
  },
  {
    path: "/web3dMapStation",
    name: "web3dMapStation",
    component: () => import("../views/web3dMapStation.vue"),
  },
  {
    path: "/gaode3d",
    name: "gaode3d",
    component: () => import("../views/gaode3d.vue"),
  },
  {
    path: "/iframe",
    name: "iframe",
    component: () => import("../views/iframe.vue"),
  },
  {
    path: "/addNum",
    name: "addNum",
    component: () => import("../views/addNum.vue"),
  },
  {
    path: "/numberanimate",
    name: "numberanimate",
    component: () => import("../views/numberanimate.vue"),
  },
  {
    path: "/gold",
    name: "gold",
    component: () => import("../views/gold.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
