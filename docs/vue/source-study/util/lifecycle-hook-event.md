# 生命周期钩子事件 hook events

## 背景

Vue 里有三种方式可以注册生命周期钩子函数，当发生到该生命周期时，钩子函数就会被调用:

1. 在 Vue 组件选项对象里添加
2. 父组件模板里调用子组件时，可以给子组件添加自定义的生命周期钩子事件
3. 组件里通过`vm.$on/$once('hook:xxx')`注册生命周期钩子事件

我们一般最常用的是用第 1 种方式，比如:

```vue
<script>
export default {
    mounted() {
      console.log("mounted");
    }
};
</script>
```

第 2 种方式:

```vue
<template>
    <Child @hook:mounted="childMounted"/>
</template>

<script>
import Child from "./Child";

export default {
    components: { Child },
    methods: {
        childMounted() {
            console.log("Child was mounted");
        }
    }
};
</script>
```

此时，若是子组件触发了`mounted`事件，则会调用父组件的`childMounted`事件。

第 3 种方式:

```vue
<script>
export default {
    mounted() {
        const picker = new Pickaday({
            // ...
        });

        // 或者使用 this.$on
        this.$once("hook:beforeDestroy", () => {
            picker.destroy();
        });
    }
};
</script>
```

如上所示，第 1 种和第 3 种方式是给组件自身注册生命周期函数，而第 2 种是给子组件注册生命周期函数。

而且，实际上第 2 种方式最终也是使用第 3 种方式的`vm.$on/$once`来注册事件的，而这是在模板的编译阶段完成的。

接下来，我们就以第 3 种方式为例，来看看源码里是如何实现生命周期钩子事件的。

## 生命周期钩子事件源码

当我们通过`vm.$on`注册事件时，如发现事件名称以`hook:`开头，则设置`vm._hasHookEvent = true`

```js
// src/core/instance/events.js
export function eventsMixin (Vue: Class<Component>) {
  const hookRE = /^hook:/
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }
  // ...
}
```

而 Vue 内部在各个生命周期调用生命周期函数时，都是调用`callHook`函数，其中会判断`vm._hasHookEvent`的值并确定是否要`vm.$emit`对应的生命周期钩子事件。

```js
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // ...
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
    // ...
  }
  // ...
}
```

```js
// src/core/instance/lifecycle.js
export function callHook (vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```

如此这般，我们就可以使用`vm.$on`给组件添加生命周期钩子事件啦。

## 参考

- [Vue.js Component Hooks as Events](https://www.digitalocean.com/community/tutorials/vuejs-component-event-hooks)
- [hookEvent of Vue](https://juejin.im/post/5dadaf9ef265da5b860140a1)
