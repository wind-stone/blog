import Cookies from 'js-cookie';
import type { CookieAttributes } from 'js-cookie';

export const getCookie = (key: string) => {
  return Cookies.get(key) || '';
};

export const setCookie = (key: string, value: string, options: CookieAttributes = {}) => {
  Cookies.set(key, value, options);
};
