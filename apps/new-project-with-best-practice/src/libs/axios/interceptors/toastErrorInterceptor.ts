import { DEFAULT_ERROR_DATA } from './constants';
import type { AxiosResponse } from 'axios';

/**
 * 错误 toast，根据单个请求是否配置了 config.toastErrorMsg 参数来判断
 *
 * 使用方式：
 *   - request.interceptors.response.use(
 *       toastErrorInterceptor({ type: 'fulfilled'}),
 *       toastErrorInterceptor({ type: 'rejected' })
 *     )
 *   - 这意味着，该拦截器既可以作为 response 的成功拦截器，也可以作为 response 的失败拦截器.
 *   - 当作为 response 的失败拦截器时，若 response.data 不存在，将使用默认值
 * @param response
 */
type TErrorMsgFn = (data: typeof DEFAULT_ERROR_DATA) => string;
type TErrorMsgPropertyType = TErrorMsgFn | boolean | string;
export const toastErrorInterceptor = ({
  type = 'rejected',
  toastFun = () => { },
}: {
  type?: 'fulfilled' | 'rejected';
  toastFun: (msg: string) => void;
}) => {
  return async (response: AxiosResponse) => {
    const data = response?.data || DEFAULT_ERROR_DATA;
    const { successResultList = [1] } = response.config;
    const toastErrorMsg = response.config.toastErrorMsg as TErrorMsgPropertyType;

    console.log('+++ toastErrorMsg', toastErrorMsg)
    if (
      // 业务成功
      !successResultList.includes(data?.result) &&
      toastErrorMsg
    ) {
      const errorMsg =
        typeof toastErrorMsg === 'boolean'
          ? data.error_msg
          : typeof toastErrorMsg === 'string'
            ? toastErrorMsg
            : toastErrorMsg(data);
      errorMsg && toastFun(errorMsg);
    }

    return type === 'rejected' ? Promise.reject(response) : response;
  };
};
