import {
  baseInstance as request,
  toastErrorInterceptor,
  transformAxiosErrorInterceptor,
  unwrapAxiosInterceptor,
  successResultInterceptor,
} from './axios';

request.defaults.toastErrorMsg = true;
request.defaults.headers['Content-Type'] = 'application/json';

request.interceptors.response.use(successResultInterceptor, transformAxiosErrorInterceptor);

request.interceptors.response.use(
  toastErrorInterceptor({ type: 'fulfilled', toastFun: console.warn }),
  toastErrorInterceptor({ type: 'rejected', toastFun: console.warn }),
);
request.interceptors.response.use(unwrapAxiosInterceptor, unwrapAxiosInterceptor);

export default request;
