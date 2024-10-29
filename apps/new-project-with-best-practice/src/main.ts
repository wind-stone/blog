import './styles/global.less'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import initApp from './app/init';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

initApp({
  app,
  baseRem: 414,
});
