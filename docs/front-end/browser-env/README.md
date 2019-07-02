---
sidebarDepth: 0
---

# 总览

[[toc]]

## 精选文章

- [深入理解浏览器的缓存机制](https://www.jianshu.com/p/54cc04190252)

## 浏览器 API

### 判断页面是否可见

[页面可见性 API](https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API)

## 异步脚本

### defer VS async

```js
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```

`script`标签打开`defer`或`async`属性，脚本就会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

`defer`与`async`的区别是：`defer`要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；`async`一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，`defer`是“渲染完再执行”，`async`是“下载完就执行”。另外，如果有多个`defer`脚本，会按照它们在页面出现的顺序加载，而多个`async`脚本是不能保证加载顺序的。

### ES6 模块

```js
<script type="module" src="./foo.js"></script>
```

浏览器对于带有`type="module"`的`script`，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了`script`标签的`defer`属性。

如果网页有多个`<script type="module">`，它们会按照在页面出现的顺序依次执行。

`script`标签的`async`属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。

```js
<script type="module" src="./foo.js" async></script>
```

一旦使用了`async`属性，`<script type="module">`就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。

### URLSearchParams

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
