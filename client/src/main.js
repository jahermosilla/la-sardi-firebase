import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import sardiDraggable from './directives/sardi-draggable';
import vuetify from './plugins/vuetify';
import { rtdbPlugin } from 'vuefire';
import './db';

import './registerServiceWorker';

Vue.directive('sardi-draggable', sardiDraggable);

Vue.use(rtdbPlugin);

Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
