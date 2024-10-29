import type { AxiosResponse } from 'axios';
/**
 * Axios 返回的相应结果被封装了一层，此处解构封装，只返回业务数据，即 { result, error_msg, ...}
 */
export const unwrapAxiosInterceptor = async (response: AxiosResponse) => {
  const { successResultList = [1] } = response.config;
  if (successResultList.includes(response.data?.result)) {
    return response.data;
  } else {
    return Promise.reject(response.data);
  }
};
