function getCookies() {
  const cookiesHash = {};
  const cookies = document.cookie;
  if (cookies === '') {
    return cookiesHash;
  }
  const cookieArray = cookies.split('; ');
  cookieArray.forEach(cookie => {
    const index = cookie.indexOf('=');
    const key = cookie.substring(0, index);
    const value = cookie.substring(index + 1);
    cookiesHash[key] = decodeURIComponent(value);
  });
  return cookiesHash;
}
