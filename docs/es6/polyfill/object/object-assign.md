# Object.assign

```js
/**
 * Reference: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

// 如果想拷贝访问器（accessor）,可使用如下方法
function completeAssign(target, ...sources) {
    sources.forEach(source => {
        let descriptors = Object.keys(source).reduce((descriptors, key) => {
            descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
            return descriptors;
        }, {});

        // Object.assign 默认也会拷贝可枚举的Symbols
        Object.getOwnPropertySymbols(source).forEach(sym => {
            let descriptor = Object.getOwnPropertyDescriptor(source, sym);
            if (descriptor.enumerable) {
                descriptors[sym] = descriptor;
            }
        });
        Object.defineProperties(target, descriptors);
    });
    return target;
}
```

拷贝源对象自身的并且可枚举的属性到目标对象身上，注意以下几点：

- 该方法使用源对象的`[[Get]]`和目标对象的`[[Set]]`，所以它会调用相关`getter`和`setter`。因此，它分配属性而不是复制或定义新的属性。如果合并源包含了`getter`，那么该方法就不适合将新属性合并到原型里
- 继承属性和不可枚举属性是不能拷贝的
- 浅拷贝，非深度拷贝
- 如果`source`是原始类型，会被包装成`Object`类型
