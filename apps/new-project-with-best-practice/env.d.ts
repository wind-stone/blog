/// <reference types="vite/client" />
import { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    toastErrorMsg?: boolean
  }

  interface InternalAxiosRequestConfig {
    // 接口业务成功状态码数组
    successResultList: Array<number>;
    toastErrorMsg: boolean
  }
}
