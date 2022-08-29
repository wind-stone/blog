# 装饰器

[TypeScript - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

本节主要是对官方文档的补充，说明各种装饰器函数的参数。

## 类装饰器

```ts
// 类装饰器
function sealed(constructor: Function) {
  console.log('constructor', constructor === BugReport) // true

  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}
```

类装饰器函数唯一的参数`constructor`是被装饰的类本身。

## 方法装饰器

```ts
function enumerable(value: boolean) {
  return function (target: any,propertyKey: string,descriptor: PropertyDescriptor) {
    // 当方法装饰器装饰在类的实例方法上时，target 为被装饰的类的原型
    console.log('enumerable target', target === Greeter.prototype)
    descriptor.enumerable = value;
  };
}

function staticMemberDecorator(target: any,propertyKey: string,descriptor: PropertyDescriptor) {
  // 当方法装饰器装饰在类的静态方法上时，target 为被装饰的类本身
  console.log('staticMemberDecorator target', target === Greeter)
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @staticMemberDecorator
  static staticFn() {}

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

## 访问器装饰器

访问器装饰器的第一个参数`target`取值，同方法装饰器。

## 参数装饰器

```ts
function Inject1<T = any>(token?: T) {
  return (target: object, key: string | symbol, index?: number) => {
    console.log('Inject1 target', target === BugReport); // "Inject1 target",  true
    console.log('Inject1 key', key); // "Inject1 key",  undefined
    console.log('Inject1 index', index); // "Inject1 index",  0
  };
}

function Inject2<T = any>(token?: T) {
  return (target: object, key: string | symbol, index?: number) => {
    console.log('Inject2 target', target === BugReport.prototype); // "Inject2 target",  true
    console.log('Inject2 key', key); // "Inject2 key",  "hello"
    console.log('Inject2 index', index); // "Inject2 index",  0
  };
}


function Inject3<T = any>(token?: T) {
  return (target: object, key: string | symbol, index?: number) => {
    console.log('Inject3 target', target === BugReport);
    console.log('Inject3 key', key);
    console.log('Inject3 index', index);
  };
}

class BugReport {
  type = "report";
  title: string;

  constructor(@Inject1() t: string) {
    this.title = t;
  }

  instanceFn(@Inject2() a: string) {}

  static staticFn(@Inject3() a:string) {

  }
}
```

- 参数装饰器应用在类的`constructor`方法上时，装饰器函数的`target`参数指向类本身，`key`为`undefined`
- 参数装饰器应用在类的实例方法上时，装饰器函数的`target`参数指向类的原型，`key`为实例方法名称
- 参数装饰器应用在类的静态方法上时，装饰器函数的`target`参数指向类本身，`key`为静态方法名称
