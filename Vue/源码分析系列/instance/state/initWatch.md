# initWatch 源码分析及收获

## 分析


## 收获

### watch 对象 key 的 value 可以是数组

主要应用场景：使用`Vue.extend`、`Vue.mixin`或组件`extends`选项、`mixins`选项合并`watch`选项时，会将同名的`watch`合并成一个数组。

watch 对象 key 的 value 可以是数组，数组内的元素可以是函数、方法名、选项对象。

Vue 实例化阶段初始化 watch 选项时，如果 watch 对象 key 对应的 value 为数组，将循环取出数组里的元素并进行 watch。

```js
{
  name: 'App',
  data() {
    return {
      a: 1
    }
  },
  watch: {
    'a': [
      function () {
        console.log('1')
      },
      function () {
        console.log('2')
      },
      'watchAFn',
      {
        handler: () => {
          console.log('4')
        },
        immediate: true
      }
    ]
  },
  mounted() {
    setTimeout(() => {
      this.a = 2
    }, 2000)
  },
  methods: {
    watchAFn() {
      console.log('3')
    }
  }
}
// 4
// 1
// 2
// 3
// 4
```


## 源码

```js
// @file src/core/instance/state.js
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher (
  vm: Component,
  keyOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    // 方法名
    handler = vm[handler]
  }
  return vm.$watch(keyOrFn, handler, options)
}

Vue.prototype.$watch = function (
  expOrFn: string | Function,
  cb: any,
  options?: Object
): Function {
  const vm: Component = this
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options)
  }
  options = options || {}
  options.user = true
  const watcher = new Watcher(vm, expOrFn, cb, options)
  if (options.immediate) {
    cb.call(vm, watcher.value)
  }
  return function unwatchFn () {
    watcher.teardown()
  }
}
```