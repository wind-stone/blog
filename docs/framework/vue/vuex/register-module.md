---
sidebarDepth: 0
---

# registerModule 里的坑

[[toc]]

## 问题描述

如果你在项目里使用`vuex`，且存在以下场景：

1. 组件里通过`mapGetters`将`store`中的`getter`映射到局部计算属性
2. 该`getter`返回的是一引用类型
3. 组件的`watch`里对该`getter`进行监听并做处理
4. 最重要的是，你使用`registerModule`异步注册一个动态模块

如果以上条件都满足，那么，恭喜你，第`4`条中的`registerModule`每调用一次，第`3`条中就会处理一次。这也就意味着，每调用一次`registerModule`，`getter`返回的值的引用就变化一次，这是为什么呢？

首先，我们通过简单的代码来描述以上所述的场景：

```js
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    obj: {
      key: 'value'
    }
  },
  getters: {
    obj(state) {
      return state.obj
    }
  },
  mutations: {
    // ..
  },
  actions: {
    // ...
  },
  modules: {
    childModuleOne: {
      // state、getters、mutations、actions...
    }
  }
})
```

```js
// App.vue
<template>
  <div id="app"></div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Vuex, { mapGetters } from 'vuex'
  import store from './store'
  export default {
    computed: {
      ...mapGetters([
        'obj'
      ])
    },
    watch: {
      obj(val) {
        console.log(val)
      }
    },
    mounted() {
      store.registerModule('childModuleTwo', {
        // state、getters、mutations、actions...
      })
    }
  }
</script>
<style>
</style>
```

```js
// main.js
import Vue from 'vue'
import Vuex from 'vuex'
import store from './store'
import App from './App.vue'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
```

## 问题追踪

学习`vuex`的源码，我们可以知道，`vuex`的`store.getters`是通过新建一 Vue 实例`store._vm`，通过将`store.getters`绑定到`store._vm`的计算属性上，以此来实现`getter`的响应式处理。

```js
export class Store {
  constructor (options = {}) {
    // ...
  }
  // ...
  registerModule (path, rawModule) {
    if (typeof path === 'string') path = [path]
    assert(Array.isArray(path), `module path must be a string or an Array.`)
    this._modules.register(path, rawModule)
    installModule(this, this.state, path, this._modules.get(path))
    // reset store to update getters...
    resetStoreVM(this, this.state)
  }
  // ...
}
```

查看以上`registerModule`可以看出，在调用`installModule`进行安装模块之后，会调用`resetStoreVM`进行重置`store._vm`，问题就出在`resetStoreVM`这个函数上。

```js
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // bind store public getters
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  // 开启严格模式
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        // 问题就出在这，$$state 的改变，会导致监听 getter 的 watch 重新计算
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

通过分析`resetStoreVM`的源码，我们知道，在`vuex`安装了新的子模块之后，需要重置`store._vm`为一新的 Vue 实例，而老的 Vue 实例`oldVm`上的数据`$$state`会置为`null`，此时会触发`watch`进行重新计算。（`watch`依赖`store._vm.computed.xxx`，而`store._vm.computed.xxx`依赖`store._vm._data.$$state`，因而`store._vm._data.$$state`置为`null`，会导致`watch`重新计算。）

但是，我们不禁好奇，为什么`vuex`注册新的子模块之后，需要重置`store._vm`呢？

原因是，新的子模块里也有子模块的`getters`，这些新的`getter`也要与`store._vm`的计算属性进行绑定。但是，我们知道，目前 Vue 还没有提供任何的 API 供我们动态去增加计算属性，因此，只能新建一 Vue 实例来取代旧的`store._vm`，并将`vuex`里的所有`getter`与新的`store._vm`的计算属性进行一一对应的绑定。
