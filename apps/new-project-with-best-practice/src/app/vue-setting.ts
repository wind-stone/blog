import type { App } from 'vue';

const initVueSetting = (app: App) => {
  app.config.errorHandler = function (err, instance, info) {
    // 捕获组件的渲染和观察期间未捕获错误
    // TODO: 通常使用公司内的 SDK 进行上报
    console.log(err, instance, info)
  };
};

export default initVueSetting;
