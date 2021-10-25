# 异步加载 JS 文件

```js
export function loadScript(url, { crossOrigin = false } = {}) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = 'async';
    script.loaded = false;

    if (crossOrigin) {
      script.crossOrigin = 'anonymous';
    }

    /*
         * onload 在其他浏览器中有效
         * onreadystatechange 在 IE 中有效
         */
    script.onload = script.onreadystatechange = function() {
      if (
        !this.readyState || // 其他浏览器
                /^(loaded|complete)$/.test(this.readyState) // IE
      ) {
        resolve();

        // avoid mem leaks in IE.
        script.onload = script.onreadystatechange = null;
      }
    };

    script.onerror = function() {
      reject(new Error(`script load error: ${url}`));

      // avoid mem leaks in IE.
      script.onerror = null;
    };

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  });
}
```
