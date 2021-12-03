# Object.create

`Object.create()`方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

```js
if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject !== 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

        function F() {}
        F.prototype = proto;

        return new F();
    };
}
```

由`polyfill`可以发现：

- 尽管`Object.create`支持第二个参数，但`Object.create`的`polyfill`不支持第二个参数
- 因为那些 ECMAScript5 以前版本限制，`polyfill`不支持第一个参数传入`null`

Reference: [MDN - Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
