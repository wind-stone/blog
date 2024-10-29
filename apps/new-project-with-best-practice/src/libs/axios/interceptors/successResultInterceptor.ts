import type { AxiosResponse } from 'axios';

/**
 * 根据 successResultList 处理 AxiosResponse
 * @param res
 * @returns
 */
export async function successResultInterceptor(res: AxiosResponse) {
  const { successResultList = [1] } = res.config;
  const { data } = res;
  if (!successResultList.includes(data?.result)) {
    return Promise.reject(res);
  }
  return res;
}
