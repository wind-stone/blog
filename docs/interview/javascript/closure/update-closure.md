# 修改闭包对象

## 题目描述

```js
const object = (function () {
  const obj = {
    a: 1,
    b: 2,
  };

  return {
    get: function (key) {
      return obj[key];
    },
  };
})();

object.get('a'); // 1

// 在这里实现代码
```

如何在不改变上面代码的情况下，修改`obj`对象，比如给`obj`添加一个属性`c: 3`？

## 实现误区

试图通过`valueOf`方法获取到`obj`对象自身，但是`valueOf`要通过`obj.valueOf`才能调用，先取出`valueOf`函数无法绑定`this`。

```js
object.get('valueOf')();
```

## 解题思路

```js
Object.defineProperty(Object.prototype, 'abc', {
    get() {
        return this;
    }
})

const obj = object.get('abc');
obj.c = 3;
```

## 如何不让外部修改闭包对象？

```js
const object = (function () {
    const obj = {
        a: 1,
        b: 2,
    };

    return {
        get: function (key) {
            if (obj.hasOwnProperty(key)) {
                return obj[key]
            }
            return undefined
        },
    };
})();
```
