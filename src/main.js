import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify'; // 여기에서 Vuetify 플러그인을 가져옵니다.
import router from './router';  // 위에서 만든 라우터 설정을 import
import store from './store'; // Make sure this import is correct



new Vue({
  el: '#app',
  render: h => h(App),
  router,
  vuetify, // Vuetify 인스턴스를 Vue 인스턴스에 추가합니다.
  store,
})

export let eventBus = new Vue;


