import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire';
import './db';

Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
