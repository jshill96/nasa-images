import Vue from 'vue';
import VueRouter from 'vue-router';
import Images from '../views/Images.vue';
import Image from '../views/Image.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'images',
    component: Images,
    props: (route) => ({
      q: route.query.q,
      page: parseInt(route.query.page, 10) || null,
    }),
  },
  {
    path: '/images/:id',
    name: 'image',
    component: Image,
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
