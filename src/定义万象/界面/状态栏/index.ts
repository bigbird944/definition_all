import { createApp } from 'vue';
import App from './App.vue';
import { waitForMvuReady } from '@util/mvu';
import './global.css';

waitForMvuReady().then(() => {
  createApp(App).mount('#app');
});
