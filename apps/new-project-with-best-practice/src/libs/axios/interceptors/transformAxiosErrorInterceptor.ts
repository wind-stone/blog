import { AxiosError } from 'axios';
import { DEFAULT_ERROR_DATA } from './constants';

/**
 * 将 Axios 的网络错误、超时错误转换成业务错误
 */
export const transformAxiosErrorInterceptor = (error: AxiosError & {
  data: {
    result: number,
    error_msg: string
  }
}) => {
  // 兜底错误，若能识别出来，则进行替换
  let resultError = DEFAULT_ERROR_DATA;

  if (error?.code === AxiosError.ERR_NETWORK) {
    resultError = {
      result: -99998,
      error_msg: '网络请求失败，请检查本机网络是否正常',
    };
  } else if (error?.code === AxiosError.ETIMEDOUT) {
    // 注意，仅设置了 transitional.clarifyTimeoutError = true 才可用
    resultError = {
      result: -99997,
      error_msg: '网络请求超时，请检查本机网络信号',
    };
  }
  // else if (error?.code === AxiosError.ERR_CANCELED) {
  // // 项目里暂未使用到
  // // 通过 AbortController 手动取消请求，详见 https://github.com/axios/axios#abortcontroller
  // }
  error.data = resultError;
  return Promise.reject(error);
};
