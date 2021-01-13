import Vue from 'vue';
import fs from 'fs';
import path from 'path';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store';

const __dirname = path.resolve();

// import ipcMain from 'electron';

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg) // "ping" 출력
//   event.reply('asynchronous-reply', 'pong');
// })

// const app = require('electron').remote.app;

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');
