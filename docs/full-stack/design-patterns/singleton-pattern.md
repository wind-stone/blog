# 单例模式

## 使用代理实现单例模式

```js
// singleton.js
export function singleton(classFn) {
    let instance = null;
    const proxy = new Proxy(classFn, {
        constructor(target, args) {
            if (!instance) {
                instance = Reflect.constructor(target, args);
            }
            return instance
        }
    })
    classFn.prototype.constructor = proxy;
    return proxy;
}
```

```js
// fn.js
import { singleton } from './singleton';

class Fn {
    constructor() {
        console.log('Fn 实例');
    }
}

export default singleton(Fn);
```

```js
import Fn from './fn';

const ins1 = new Fn();
const ins2 = new ins1.constructor();
console.log(ins1 === ins2); // true
```

以上代码主要是为了防止外部拿到实例的`constructor`后，再通过`new ins1.constructor`创建出另一个实例导致产生两个不同的实例。
