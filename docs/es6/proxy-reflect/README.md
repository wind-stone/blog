# Proxy/Reflect

## this 和 receiver

### Proxy 实例的 get() 里的 this 和 receiver

Proxy 实例的`get()`方法里的`receiver`总是指向原始的读操作所在的那个对象。

常规情况下，`receiver`即为 Proxy 实例。

```js
const origin = {
    a: 'a'
};
const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        // 读操作是在 proxy 对象上进行的，因此 receiver === proxy
        console.log('receiver === proxy -->', receiver === proxy);
        return Reflect.get(target, key, receiver);
    }
});

proxy.a;

// 结果
// receiver === proxy --> true
```

而当 Proxy 实例位于读操作所在对象的原型链上时，Proxy 实例的`get()`方法里的`receiver`就会指向读操作所在的对象。

```js
const origin = {
    a: 'a'
};
const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        // 读操作是在 child 对象上进行的，因此 receiver === child
        console.log('receiver === proxy -->', receiver === proxy);
        console.log('receiver === child -->', receiver === child);
        return Reflect.get(target, key, receiver);
    }
});

const child = Object.create(proxy);

child.a;

// 结果
// receiver === proxy --> false
// receiver === child --> true
```

### Proxy 实例的 set() 里的 receiver

类似于`get()`，Proxy 实例的`set()`里的`receiver`指的是原始的写操作所在的那个对象。

```js
const origin = {
    a: 'a'
};
const proxy = new Proxy(origin, {
    set(target, key, value, receiver) {
        // 写操作是在 proxy 对象上进行的，因此 receiver === proxy
        console.log('receiver === proxy -->', receiver === proxy);
        return Reflect.set(target, key, value, receiver);
    }
});

proxy.a = 'b';

// 结果
// receiver === proxy --> true
```

```js
const origin = {
    a: 'a'
};
const proxy = new Proxy(origin, {
    set(target, key, value, receiver) {
        // 写操作是在 child 对象上进行的，因此 receiver === child
        console.log('receiver === proxy -->', receiver === proxy);
        console.log('receiver === child -->', receiver === child);
        return Reflect.set(target, key, value, receiver);
    }
});

const child = Object.create(proxy);

child.a = 'b';

// 结果
// receiver === proxy --> false
// receiver === child --> true
```

### Proxy 实例的 get()/set() 里的 this

无论`proxy`实例是否位于读/写操作所在对象的原型链上，Proxy 实例的`get`/`set`方法里的`this`，都指向定义`get`/`set`时所在的那个对象。

```js
const origin = {
    a: 'a'
};

const handler = {
    get(target, key, receiver) {
        console.log('this === handler -->', this === handler);
        return Reflect.get(target, key, receiver);
    }
}

const proxy = new Proxy(origin, handler);

proxy.a;

// 结果
// this === handler --> true
```

`set`同理。在实际应用中，基本上不会在`get`/`set`里使用`this`。

### Proxy 实例 get() 返回的函数内的 this

Proxy 实例里`get()`方法返回的若是函数的话，则该函数会自动绑定`this`为`proxy`实例，无论这个函数来自于哪里。

```js
const origin = {
    fn() {
        console.log('origin.fn:');
        console.log('this === proxy -->', this === proxy);
    },
    fn1() {
        console.log('origin.fn1:');
        console.log('this === proxy -->', this === proxy);
    }
}

const instrumentation = {
    fn() {
        console.log('instrumentation.fn: ');
        console.log('this === proxy -->', this === proxy);
    }
}

const globalFn2 = function() {
    console.log('globalFn2: ');
    console.log('this === proxy -->', this === proxy);
}

const proxy = new Proxy(origin, {
    get(target, key, receiver) {
        if (key === 'fn') {
            // 即使不传入 receiver，结果仍一样
            return Reflect.get(instrumentation, key, receiver)
        }
        if (key === 'fn1') {
            // 即使不传入 receiver，结果仍一样
            return Reflect.get(target, key, receiver);
        }
        if (key === 'fn2') {
            return globalFn2;
        }
    }
})

proxy.fn();

// 结果
// instrumentation.fn:
// this === proxy --> true

proxy.fn1();

// 结果
// origin.fn1:
// this === proxy --> true

proxy.fn2();

// 结果
// globalFn2:
// this === proxy --> true
```

### Reflect.get() 里的 this 和 receiver

当`origin`有`getter`函数时，调用`Reflect.get()`不传入第三个参数`receiver`，则`origin`里的`getter`函数里的`this`指向`origin`。

```js
const origin = {
    a: 'a',
    b: 'b',
    get c() {
        console.log('this === receiver -->', this === receiver);
        console.log('this === origin -->', this === origin);
        return this.a + this.b;
    }
}

const receiver = {
    a: 1,
    b: 2
}

console.log(Reflect.get(origin, 'c'))

// 结果
// this === receiver --> false
// this === origin --> true
// ab
```

当`origin`有`getter`函数时，调用`Reflect.get()`若传入第三个参数`receiver`，则`origin`里的`getter`函数里的`this`指向`receiver`。

```js
const origin = {
    a: 'a',
    b: 'b',
    get c() {
        console.log('this === receiver -->', this === receiver);
        console.log('this === origin -->', this === origin);
        return this.a + this.b;
    }
}

const receiver = {
    a: 1,
    b: 2
}

console.log(Reflect.get(origin, 'c', receiver))

// 结果
// this === receiver --> true
// this === origin --> false
// 3
```

### Reflect.set() 里的 this 和 receiver

同理，当`origin`有`setter`函数时，调用`Reflect.set()`若不传入第四个参数`receiver`，则`origin`里的`setter`函数里的`this`指向`origin`；如传入第四个参数`receiver`，则`origin`里的`setter`函数里的`this`指向`receiver`。

```js
const origin = {
    a: 'a',
    b: 'b',
    set c(value) {
        console.log('this === receiver -->', this === receiver);
        console.log('this === origin -->', this === origin);
    }
}

const receiver = {
    a: 1,
    b: 2
}

Reflect.set(origin, 'c', 'c')

// 结果
// this === receiver --> false
// this === origin --> true
```

```js
const origin = {
    a: 'a',
    b: 'b',
    set c(value) {
        console.log('this === receiver -->', this === receiver);
        console.log('this === origin -->', this === origin);
    }
}

const receiver = {
    a: 1,
    b: 2
}

Reflect.set(origin, 'c', 'c', receiver)

// 结果
// this === receiver --> true
// this === origin --> false
```
