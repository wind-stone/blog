import 'url-polyfill';

export function getUrlSearchParams(url = window.location.href) {
  url = new URL(url);
  const res = {};
  for(var pair of url.searchParams.entries()) {
    res[pair[0]] = pair[1];
  }
  return res;
}

export function appendSearchParamsToUrl(url = window.location.href, params) {
  url = new URL(url);
  Object.keys(params).forEach(function (key) {
    url.searchParams.delete(key);
    url.searchParams.append(key, params[key]);
  });
  return url.toString();
}
