import QueryString from 'query-string';

/**
 * 解析 querystring，返回查询参数对象
 * @param queryString，查询字符串
 * @returns 查询参数对象
 */
export const parseUrlQueryString = (queryString?: string): Record<string, any> => {
  queryString = queryString || location.search;

  return QueryString.parse(queryString.split('?')[1]);
};

/**
 * 将查询参数对象字符串化为查询字符串
 * @param queryObject 查询参数对象
 * @returns 查询字符串
 */
export const stringifyUrlQueryString = (queryObject: Record<string, any>) => {
  return QueryString.stringify(queryObject);
};

/**
 * 获取 url 上查询参数值
 * @param key 查询参数的 key
 * @returns 查询参数值
 */
export const getUrlQueryString = (key: string) => {
  const queryObject = parseUrlQueryString();
  return queryObject[key] || '';
};

/**
 * 往 url 上添加查询参数
 * @param param
 * @param param.url url
 * @param param.params 待添加的参数对象
 * @returns
 */
export const appendParamsToUrl = ({
  url,
  params,
}: {
  url: string;
  params: Record<string, any>;
}) => {
  if (!url || !params || !Object.keys(params).length) {
    return url;
  }

  const urlArray = url.split('#');
  const urlWithoutHash = urlArray[0];
  const hash = urlArray[1];

  const pathQueryArray = urlWithoutHash.split('?');
  const path = pathQueryArray[0];
  const query = pathQueryArray[1];

  const newParams = {
    ...parseUrlQueryString(query),
    ...params,
  };

  const newQuery = stringifyUrlQueryString(newParams);

  return `${path}${newQuery ? '?' + newQuery : ''}${hash ? '#' + hash : ''}`;
};
