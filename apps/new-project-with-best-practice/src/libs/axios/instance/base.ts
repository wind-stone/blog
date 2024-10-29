import axios from 'axios';

const instance = axios.create({
  timeout: 10000,
  transitional: {
    clarifyTimeoutError: true, // 请求超时时，抛出 ETIMEDOUT 错误，而不是通用的 ECONNABORTED
  },
});

export default instance;
