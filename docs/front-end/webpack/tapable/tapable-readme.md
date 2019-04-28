# Tapable README.md

`Tapable`版本: 2.0.0-beta.4，[github 地址](https://github.com/webpack/tapable/tree/master)

`tapable`暴露了如下一些钩子类（`hook classes`），这些钩子类用于为插件函数创建钩子。

```js
const {
  // 同步钩子类，只能串行执行插件
  SyncHook,                 // 同步钩子类，不关心插件的返回值
  SyncBailHook,             // 同步 bail 钩子类，关心插件的返回值
  SyncWaterfallHook,        // 同步 waterfall 钩子类
  SyncLoopHook,             // 同步 loop 钩子

  // 异步钩子类，可串行、可并行
  AsyncParallelHook,        // 异步并行钩子
  AsyncParallelBailHook,    // 异步并行 bail 钩子
  AsyncSeriesHook,          // 异步串行钩子
  AsyncSeriesBailHook,      // 异步串行 bail 钩子
  AsyncSeriesWaterfallHook  // 异步串行 waterfall 钩子
 } = require("tapable");
```

## 安装

```js
npm install --save tapable
```

## 使用

所有的钩子函数都接收一个可选的、类型为数组的参数，数组的项是以后要挂载在该钩子上的插件函数的入参名称。

```js
const hook = new SyncHook(["arg1", "arg2", "arg3"]);
```

最佳实践是，将所有的钩子暴露在某个类的`hooks`属性上:

```js
class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
    };
  }

  /* ... */
}
```

之后就可以这样使用钩子了:

```js
const myCar = new Car();

// 使用钩子的 tap 方法添加插件，第一个参数是插件名称，第二个参数是插件函数
myCar.hooks.brake.tap("WarningLampPlugin", () => warningLamp.on());
```

添加插件时，需要设置插件的名称，以标记这个插件。

插件函数可以接收参数:

```js
myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`));
```

针对同步钩子，`tap`是唯一有效的添加插件的方法。异步钩子也支持异步插件。

```js
myCar.hooks.calculateRoutes.tapPromise("GoogleMapsPlugin", (source, target, routesList) => {
  // 返回 promise 实例
  return google.maps.findRoute(source, target).then(route => {
    routesList.add(route);
  });
});

myCar.hooks.calculateRoutes.tapAsync("BingMapsPlugin", (source, target, routesList, callback) => {
  bing.findRoute(source, target, (err, route) => {
    if(err) return callback(err);
    routesList.add(route);
    // 调用 callback
    callback();
  });
});

// 你仍然可以添加同步插件
myCar.hooks.calculateRoutes.tap("CachedRoutesPlugin", (source, target, routesList) => {
  const cachedRoute = cache.get(source, target);
  if(cachedRoute)
    routesList.add(cachedRoute);
})
```

声明了这些钩子的类，可以这样调用它们:

```js
class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
    };
  }
  /**
    * 你将获取不到 SyncHook/AsyncParallelHook 钩子的返回值，要是想要返回值，就相应地使用 SyncWaterfallHook 和 AsyncSeriesWaterfallHook 钩子
   **/

  setSpeed(newSpeed) {
    // 执行同步钩子的 call 方法将执行所有挂载在该同步钩子上的插件函数，且 call 方法只会返回 undefined
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    const routesList = new List();
    // 执行 AsyncParallelHook 钩子的 promise 方法，执行所有挂载在该同步钩子上的插件函数
    return this.hooks.calculateRoutes.promise(source, target, routesList).then((res) => {
      // 针对 AsyncParallelHook 钩子来说，此处的 res 为 undefined
      return routesList.getRoutes();
    });
  }

  useNavigationSystemAsync(source, target, callback) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
      if(err) return callback(err);
      callback(null, routesList.getRoutes());
    });
  }
}
```

钩子将编译出一个方法，该方法将以最有效的方式运行你的插件。这将依据以下信息生成代码:

- 所注册的插件的数量（没注册、注册一个、注册多个）
- 所注册的插件的类型（同步、异步、`promise`）
- 执行钩子时使用的调用方法（同步、异步、`promise`）
- 参数的数量
- 是否使用了拦截器（`interception`）

这将确保最快的执行速度。（译者注: 所以在`new`钩子类的时候，传入参数列表是为了更加有效地编译出方法？）

## 钩子类型

每一个钩子都可以注册一到多个函数。它们执行的方式依赖于钩子的类型:

- 基本钩子（`basic hook`，名称里没有`waterfall`/`bail`/`loop`）: 这类钩子只是简单的按序调用你注册每一个函数。
- `waterfall`钩子: 这类钩子也是按序调用你注册的每一个函数，与基本钩子不同的是，它会将前一个函数的返回值作为参数传入下一个函数。
- `bail`钩子: 这类钩子允许提现退出。当任何一个注册的函数的返回值不为`undefined`，则`bail`钩子将停止执行剩余的钩子。
- `loop`钩子: 这类钩子会可能循环执行单个插件。在`SyncLoopHook`钩子里，触发钩子时，会同步串行执行插件。若插件执行后返回非`undefined`，则会循环执行当前插件，直到插件返回`undefined`为止，才会继续执行下一个插件。

（PS: 译者注，“按序”是指按插件注册的顺序）

此外，钩子可以是同步的或异步的，因此有`Sync`/`AsyncSeries`/`AsyncParallel`的钩子类。

- `Sync`: 同步钩子，只能注册同步函数，使用`myHook.tap()`注册。
- `AsyncSeries`: 异步串行钩子，可以注册同步函数、基于回调的函数以及基于`promise`的函数，分别使用`myHook.tap()`、`myHook.tapAsync()`、`myHook.tapPromise()`注册。它们也是按序调用每一个异步函数。
- `AsyncParallel`: 异步并行钩子，可以注册同步函数、基于回调的函数以及基于`promise`的函数，分别使用`myHook.tap()`、`myHook.tapAsync()`、`myHook.tapPromise()`注册。但是，它们是并行执行每一个异步函数。

钩子的类名可以反映出钩子的类型。比如，`AsyncSeriesWaterfallHook`允许注册异步钩子，且会串行地执行它们，并会将前一个函数的返回值作为参数传递给下一个函数。

## 拦截器

拦截器，`interception`。

所有的钩子都提供了一个拦截器 API:

```js
myCar.hooks.calculateRoutes.intercept({
  call: (source, target, routesList) => {
    console.log("Starting to calculate routes");
  },
  register: (tapInfo) => {
    // tapInfo = { type: "promise", name: "GoogleMapsPlugin", fn: ... }
    console.log(`${tapInfo.name} is doing its job`);
    return tapInfo; // may return a new tapInfo object
  }
})
```

- `call`: `(...args) => void`，往拦截器里添加`call`方法，该方法将在钩子触发时调用，且可以访问到钩子的参数。
- `tap`: `(tap: Tap) => void`，往拦截器里添加`tap`方法，该方法将在每次将插件注册到钩子时调用，且可以访问到`Tap`对象，且`Tap`对象不可改变。
- `loop`: `(tap: Tap) => void`，往拦截器里添加`loop`方法，该方法将在一个`loop`钩子每一次`loop`时调用。
- `register`: `(tap: Tap) => Tap | undefined`，往拦截器里添加`register`方法，该方法将在每一次调用`tap`方法时调用，且可以修改它`Tap`参数，，进而修改注册的插件。

## 上下文对象

插件和拦截器都可以通过配置，访问可选的上下文对象，通过操作上下文对象可以将任意值传递给之后的插件和拦截器。

```js
myCar.hooks.accelerate.intercept({
  context: true,
  tap: (context, tapInfo) => {
    // tapInfo = { type: "sync", name: "NoisePlugin", fn: ... }
    console.log(`${tapInfo.name} is doing it's job`);

    // `context` starts as an empty object if at least one plugin uses `context: true`.
    // If no plugins use `context: true`, then `context` is undefined.
    if (context) {
      // Arbitrary properties can be added to `context`, which plugins can then access.
      context.hasMuffler = true;
    }
  }
});

myCar.hooks.accelerate.tap({
  name: "NoisePlugin",
  context: true
}, (context, newSpeed) => {
  if (context && context.hasMuffler) {
    console.log("Silence...");
  } else {
    console.log("Vroom!");
  }
});
```

## HookMap

HookMap 是一个帮助类，以生成一个管理钩子的 Map。

```js
const keyedHook = new HookMap(key => new SyncHook(["arg"]))

keyedHook.tap("some-key", "MyPlugin", (arg) => { /* ... */ });
keyedHook.tapAsync("some-key", "MyPlugin", (arg, callback) => { /* ... */ });
keyedHook.tapPromise("some-key", "MyPlugin", (arg) => { /* ... */ });

const hook = keyedHook.get("some-key");
if(hook !== undefined) {
  hook.callAsync("arg", err => { /* ... */ });
}
```

## Hook/HookMap 接口

`public`接口:

```js
interface Hook {
  tap: (name: string | Tap, fn: (context?, ...args) => Result) => void,
  tapAsync: (name: string | Tap, fn: (context?, ...args, callback: (err, result: Result) => void) => void) => void,
  tapPromise: (name: string | Tap, fn: (context?, ...args) => Promise<Result>) => void,
  intercept: (interceptor: HookInterceptor) => void
}

interface HookInterceptor {
  call: (context?, ...args) => void,
  loop: (context?, ...args) => void,
  tap: (context?, tap: Tap) => void,
  register: (tap: Tap) => Tap,
  context: boolean
}

interface HookMap {
  for: (key: any) => Hook,
  tap: (key: any, name: string | Tap, fn: (context?, ...args) => Result) => void,
  tapAsync: (key: any, name: string | Tap, fn: (context?, ...args, callback: (err, result: Result) => void) => void) => void,
  tapPromise: (key: any, name: string | Tap, fn: (context?, ...args) => Promise<Result>) => void,
  intercept: (interceptor: HookMapInterceptor) => void
}

interface HookMapInterceptor {
  factory: (key: any, hook: Hook) => Hook
}

interface Tap {
  name: string,
  type: string
  fn: Function,
  stage: number,
  context: boolean
}
```

`protected`接口: （仅对于包含了钩子的类来说）

```js
interface Hook {
  isUsed: () => boolean,
  call: (...args) => Result,
  promise: (...args) => Promise<Result>,
  callAsync: (...args, callback: (err, result: Result) => void) => void,
}

interface HookMap {
  get: (key: any) => Hook | undefined,
  for: (key: any) => Hook
}
```

## MultiHook

A helper Hook-like class to redirect taps to multiple other hooks:

```js
const { MultiHook } = require("tapable");

this.hooks.allHooks = new MultiHook([this.hooks.hookA, this.hooks.hookB]);
```
