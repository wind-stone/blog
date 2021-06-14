# 浏览器 API

[[toc]]

## URLSearchParams

URLSearchParams API 用于处理 URL 之中的查询字符串，即问号之后的部分。

没有部署不支持这个 API 的浏览器，可以用`url-search-params`这个垫片库。

URLSearchParams 有以下方法，用来操作某个参数。

- `has()`：返回一个布尔值，表示是否具有某个参数
- `get()`：返回指定参数的第一个值
- `getAll()`：返回一个数组，成员是指定参数的所有值
- `set()`：设置指定参数
- `delete()`：删除指定参数
- `append()`：在查询字符串之中，追加一个键值对
- `toString()`：返回整个查询字符串

以`get`为例：

```js
const paramsString = 'name=jawil&age=24';
const searchParams = new URLSearchParams(paramsString);
console.log(searchParams.get('name')); // jawil
```

详情请见[利用 URLSearchParams 对象获取URL之中的查询字符串，即问号之后的部分 #31](https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/issues/31#issuecomment-422712267)

## JS Base64 编码/解码

### Base64 编码

```js
window.btoa('zhangxinxu');
// 返回：'emhhbmd4aW54dQ=='
```

### Base64 解码

```js
window.atob('emhhbmd4aW54dQ==');
// 返回：'zhangxinxu'
```

### 中文报错

涉及到给中文编码时，会出现报错，解决方法是编码之前先`encode`编码。

```js
window.btoa(window.encodeURIComponent('嘻嘻哈哈哈哈啦啦啦啦'));
window.decodeURIComponent(window.atob('JUU1JTk4JUJCJUU1JTk4JUJCJUU1JTkzJTg4JUU1JTkzJTg4JUU1JTkzJTg4JUU1JTkzJTg4JUU1JTk1JUE2JUU1JTk1JUE2JUU1JTk1JUE2JUU1JTk1JUE2'));
```

Reference: [张鑫旭-原来浏览器原生支持JS Base64编码解码](https://www.zhangxinxu.com/wordpress/2018/08/js-base64-atob-btoa-encode-decode/)
