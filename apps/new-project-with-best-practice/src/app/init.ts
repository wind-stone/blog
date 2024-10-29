import type { App } from 'vue';
import initStyle from './style';
import initVueSetting from './vue-setting';

export default (options: { app: App, baseRem: number }) => {
  const { app, baseRem } = options;
  initVueSetting(app);
  initStyle(baseRem);
};
