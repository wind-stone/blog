# Proxy 实践

## 遍历 Proxy 实例上的属性/属性值的方法

```js
const origin = {
    a: 1,
    b: 2
};
const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        console.log('get', key, result);
        return result;
    },
    set(target, key, value, receiver) {
        console.log('set', key, value);
        return Reflect.set(target, key, value, receiver);
    },
    ownKeys(target) {
        const result = Reflect.ownKeys(target);
        console.log('ownKeys', result);
        return result;
    }
});

Object.keys(proxy);
// ownKeys [ 'a', 'b' ]

Object.values(proxy);
// ownKeys [ 'a', 'b' ]
// get a 1
// get b 2

Object.entries(proxy);
// ownKeys [ 'a', 'b' ]
// get a 1
// get b 2
```

## Proxy 实例上的数组方法

当为数组创建代理时，调用代理上的数组方法时，可能会触发数组下标、`length`等属性的`set`和`get`。

（TODO: 这里会触发的原因应该是 C++ 源码里在实现这些方法时会访问/设置这些属性）

### push

```js
const origin = ['a', 'b'];
const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        console.log('get', key, result);
        return result;
    },
    set(target, key, value, receiver) {
        console.log('set', key, value);
        return Reflect.set(target, key, value, receiver);
    }
})
proxy.push('c');

// 结果
// get push function push() { [native code] }
// get length 2
// set 2 c
// set length 3
```

### pop

```js
const origin = ['a', 'b'];
const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        console.log('get', key, result);
        return result;
    },
    set(target, key, value, receiver) {
        console.log('set', key, value);
        return Reflect.set(target, key, value, receiver);
    },
    deleteProperty(target, key) {
        console.log('delete', key);
        return Reflect.deleteProperty(target, key);
    }
})
proxy.pop();

// 结果
// get pop function pop() { [native code] }
// get length 2
// get 1 b
// delete 1
// set length 1
```

### shift

```js
const origin = ['a', 'b'];
const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        console.log('get', key, result);
        return result;
    },
    set(target, key, value, receiver) {
        console.log('set', key, value);
        return Reflect.set(target, key, value, receiver);
    },
    deleteProperty(target, key) {
        console.log('delete', key);
        return Reflect.deleteProperty(target, key);
    }
})
proxy.shift();

// 结果
// get shift function shift() { [native code] }
// get length 2
// get 0 a
// get 1 b
// set 0 b
// delete 1
// set length 1
```

### unshift

```js
const origin = ['a', 'b'];
const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        console.log('get', key, result);
        return result;
    },
    set(target, key, value, receiver) {
        console.log('set', key, value);
        return Reflect.set(target, key, value, receiver);
    }
})
proxy.unshift('c');

// 结果
// get unshift function unshift() { [native code] }
// get length 2
// get 1 b
// set 2 b
// get 0 a
// set 1 a
// set 0 c
// set length 3
```

### splice

```js
const origin = ['a', 'b'];
const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        console.log('get', key, result);
        return result;
    },
    set(target, key, value, receiver) {
        console.log('set', key, value);
        return Reflect.set(target, key, value, receiver);
    },
    deleteProperty(target, key) {
        console.log('delete', key);
        return Reflect.deleteProperty(target, key);
    }
})

proxy.splice(0, 1);
// 结果
// get splice function splice() { [native code] }
// get length 2
// get constructor function Array() { [native code] }
// get 0 a
// get 1 b
// set 0 b
// delete 1
// set length 1

proxy.splice(0, 1, 'c', 'd');
// 结果
// get splice function splice() { [native code] }
// get length 2
// get constructor function Array() { [native code] }
// get 0 a
// get 1 b
// set 2 b
// set 0 c
// set 1 d
// set length 3
```

### includes/indexOf/lastIndexOf

```js
const origin = ['a', 'b'];
const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver);
        console.log('get', key, result);
        return result;
    },
});

proxy.includes('a')

// 结果
// get includes function includes() { [native code] }
// get length 2
// get 0 a

proxy.includes('c')

// 结果
// get includes function includes() { [native code] }
// get length 2
// get 0 a
// get 1 b
```

`indexOf`和`lastIndexOf`同理，不再赘述。

需要注意的是，调用数组的这三个方法，并不能保证会`get`数组的每一项，若在某一项匹配到，则后续项将不会再`get`。

### map

### forEach

### for of

## Proxy 的 ownKeys() 方法

Proxy 的`ownKeys()`可以拦截：

- `Object.getOwnPropertyNames()`
- `Object.getOwnPropertySymbols()`
- `Object.keys()`
- `for...in`循环

但是这些被拦截的不同的遍历方式在`handler.ownKeys`里统一使用`Reflect.ownKeys()`获取的值还是对应遍历方法原本的结果，这一点比较神奇。

```js
const origin = {
    [Symbol('')]: '',
    a: 'a'
}

Object.defineProperty(origin, 'b', {
    value: 'b',
    enumerable: false
})

const handler = {
    ownKeys(target) {
        return Reflect.ownKeys(target);
    }
}

const proxy = new Proxy(origin, handler)

Reflect.ownKeys(proxy)               // [ 'a', 'b', Symbol() ]
Object.getOwnPropertyNames(proxy)    // [ 'a', 'b' ]
Object.getOwnPropertySymbols(proxy)  // [ Symbol() ]
Object.keys(proxy)                   // [ 'a' ]

for(let i in proxy) {
    console.log(i)                   // a
}
```
