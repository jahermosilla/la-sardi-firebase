import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import firebase from 'firebase';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import( /* webpackChunkName: "login" */ '../views/Login'),
  },

  {
    path: '/game/:gameId',
    name: 'Game',
    props: true,
    component: () => import( /* webpackChunkName: "game" */ '../views/Game'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({ routes });

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(route => route.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (currentUser && to.path === '/login') {
    return next({ name: 'Home' });
  }

  if (currentUser || !requiresAuth) {
    return next();
  }

  if (!(await isAuthenticated())) {
    return next({ path: 'login' });
  }

  next();
});

export default router;

async function isAuthenticated() {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(resolve);
  });
}
