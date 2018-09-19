---
sidebarDepth: 0
---

# Vuex 源码学习

[[toc]]

版本：3.0.1

## 源码注释

学习源码过程中，我添加了一些注释，可以查看[这个仓库](https://github.com/wind-stone/vuex)，并将最新的一个提交（包含源码注释）与上一提交（Vuex 官方源码，使用的是 3.0.1 版本）对比，差异部分即为源码注释。

## 实现细节

### store.state/getters 为什么是响应式的？

在`vuex`的实现里，`store`上有一 Vue 实例`store._vm`。

通过将`store.state`赋值为`store._vm_data.$$state`，因而使得`store.state`获得了响应式的能力。

通过将`store.getters`赋值为`store._vm.computed`，使得每个`getter`成为了`store._vm`的计算属性，因此`getter`既拥有监听`store._vm_data.$$state`改变（并重新计算出自身的新值）的能力，又拥有在自身值改变之后通知外部`watcher`的能力。

```js
/**
 * 重置 store 实例的 vm 属性，并将 store 的 state 和 getters 分别映射到 vm 的 data 属性 和 computed 属性上，
 * 从而实现 getter 随 state 的变化而变化，以及 getter 的惰性获取能力，类似于 vue 实例的 computed 随 data 的变化而变化一样
 * @param {*} store store 实例
 * @param {*} state store 的根 state
 * @param {*} hot 用于热部署时
 */
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
      // 将 store.state 作为 Vue 实例的 data 的 $$state 属性，从而实现 store.state 是响应式的
      $$state: state
    },
    // 将 store.getters 作为 Vue 实例的计算属性，从而实现 store.getter 随着 store._vm_data.$$state 即 store.state 的改变重新计算出新值，若是值改变了，会通知外部依赖于该 getter 的 watcher
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
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

### 模块的上下文对象 context

我们在注册模块时，每一模块对应着一`Module`类的实例，实例上有一属性`context`，其为模块的上下文对象，该对象的结构为：

```js
{
  state,
  getters,
  commit,
  dispatch
}
```

对于启用了命名空间的模块来说，上面的`state`、`getters`、`commit`、`dispatch`都是局部化的；
对于根模块以及“模块链上不存在启用命名空间的祖先模块”的模块来说，`state`、`getters`、`commit`、`dispatch`都是全局的。

使用模块上下文对象的场景有很多，比如：

- `mapMutations`/`mapActions`映射到组件方法上来提交`mutation`/分发`action`时，实际上使用的就是局部`commit`和`dispatch`
- `getter`函数的第一个参数是局部`state`，第二个参数是局部`getters`，第三个参数是全局`state`，第四个参数是全局`getters`
- `mutation`回调函数的第一个参数`context`对象，就包括了上面的局部`state`（对于启用命名空间来说，`state`是指局部`state`）
- `action`回调函数的第一个参数`context`对象，就包含了上面的局部`dispatch`、`commit`、`getters`、`state`，以及全局`rootGetters`和`rootState`

注意：根模块的局部`state`、`getters`、`commit`、`dispatch`就是全局的`state`、`getters`、`commit`、`dispatch`。

```js
function installModule (store, rootState, path, module, hot) {
  // ...
  const local = module.context = makeLocalContext(store, namespace, path)
  // ...
}
```

```js
/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 *
 * 创建绑定在给定命名空间上的局部 state、getters、commit、dispatch，若没有命名空间，返回根实例上的
 * @param {object} store store 实例
 * @param {string} namespace 命名空间
 * @param {object} path 模块路径
 */
function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''

  const local = {
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(`[vuex] unknown local action type: ${args.type}, global type: ${type}`)
          return
        }
      }

      // dispatch 的第三个参数 options 的 root 为 tree 时，分发根模块上的 action，否则分发命名空间模块上的 action
      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(`[vuex] unknown local mutation type: ${args.type}, global type: ${type}`)
          return
        }
      }

      // commit 的第三个参数 options 的 root 为 tree 时，提交根模块上的 mutation，否则提交命名空间模块上的 mutation
      store.commit(type, payload, options)
    }
  }

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  // getters、state 必须实时获取
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}
```

可以从源码里看到，

- 模块有命名空间时，局部`commit`、`dispatch`实际上就是全局`commit`、`dispatch`
- 有命名空间时
  - 若调用`commit`、`dispatch`的`options.root`为`true`，局部`commit`、`dispatch`实际上就是调用全局`commit`、`dispatch`
  - 否则，局部`commit`、`dispatch`实际上也是调用全局`commit`、`dispatch`，但是传入的`type`是带命名空间的

了解了局部的`commit`、`dispatch`，我们再来学习下局部的`state`、`getters`，会发现有些不一样的地方。

源码里，获取`state`/`getters`都是通过存取描述符`get`来实时获取，这样每次获取的可能是不一样的值。

```js
/**
 * 实时获取命名空间模块的 getters（遍历 store.getters，将符合命名空间的 getter 筛选出来）
 * @param {*} store store 实例
 * @param {*} namespace 命名空间
 */
function makeLocalGetters (store, namespace) {
  const gettersProxy = {}

  const splitPos = namespace.length
  // 每次获取时，遍历 store.getters 上的每个 getter，将符合命名空间的 getter 加入到 gettersProxy
  Object.keys(store.getters).forEach(type => {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) return

    // extract local getter type
    const localType = type.slice(splitPos)

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: () => store.getters[type],
      enumerable: true
    })
  })

  return gettersProxy
}

/**
 * 获取嵌套的子模块的 state
 * @param {*} state 根 state
 * @param {*} path 模块路径
 */
function getNestedState (state, path) {
  return path.length
    ? path.reduce((state, key) => state[key], state)
    : state
}
```

现在局部`context`对象已经有了，那么如果是如何将`context`注入到`getter`/`mutation`、`action`中去的呢？

安装模块时，会获取到模块的上下文，并在`registerGetter`/`registerMutation`/`registerAction`时作为参数传入，如此原始的`getter`/`mutation`/`action`便可以获取到`context`。

```js
function installModule (store, rootState, path, module, hot) {
  // ...

  const local = module.context = makeLocalContext(store, namespace, path)

  // 遍历 mutation，并注册
  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  // 遍历 action，并注册
  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  // 遍历 getter，并注册
  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  // ...
}
```

```js
/**
 * 注册 getters
 * @param {*} store store 实例
 * @param {*} type getter 的名称（带命名空间）
 * @param {*} rawGetter getter
 * @param {*} local 绑定命名空间的上下文对象
 */
function registerGetter (store, type, rawGetter, local) {
  // ...
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
  // ...
}

/**
 * 注册 mutations
 * @param {*} store store 实例
 * @param {*} type mutation 的名称（带命名空间）
 * @param {*} handler mutation 回调函数
 * @param {*} local 绑定命名空间的上下文对象
 */
function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}

/**
 * 注册 actions
 * @param {*} store store 实例
 * @param {*} type action 的名称（带命名空间）
 * @param {*} handler action 回调函数
 * @param {*} local 绑定命名空间的上下文对象
 */
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

rawAction.call(store, {
    dispatch: local.dispatch,
    commit: local.commit,
    getters: local.getters,
    state: local.state,
    rootGetters: store.getters,
    rootState: store.state
}, payload, cb)
```

### 模块的局部 state/getters 为什么要实时获取？

由上一节上下文对象`context`实时获取`state`/`getters`，我们不禁怀有疑问，为什么要实时获取呢，难道局部`state`/`getters`会发生变化？

答案是，局部`state`/`getters`确实不是一直保持不变的。比如在以下情况下，`state`和`getters`是会发生变化的：

- 通过`store.registerModule`注册动态模块时，会增加部分`state`/`getter`
- 通过`store.unregisterModule`卸载动态模块时，会删除部分`state`/`getter`
- 通过`store.replaceState`（常见的使用场景是 SSR）替换掉整个`state`

因此，`state`的动态变化显而易见。而`getters`的动态变化就略显繁琐一些。由`store.state/getters 为什么是响应式的？`一节我们可以看到，`store.getters`作为`store._vm`的计算属性，`getters`在上述几种情况下导致`store._vm`更换时，也会随之更换为新的对象。

### 调用 getter 时可以传入额外参数

若是项目里有需求，需要在调用`getter`时传入参数，那么可以如下定义`getter`，让`getter`的回调函数返回另一函数。

```js
// store.js
new Vuex.Store({
  state: {
    a: 1
  },
  getters: {
    // 重点！！ 此处的 aWithB 是一函数，该函数返回另一函数
    aWithB: (state) => (b) => {
      return state.a + b
    }
  },
  mutations: {
    SET_A: (state, payload) => {
      state.a = payload
    }
  }
})
```

```html
<template>
  <div id="app">
    <div>a: {{ a }}</div>
    <div>aWithB: {{ aWithB(2) }}</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'App',
  mounted () {
  },
  computed: {
    ...mapGetters([
      'aWithB'
    ]),
    ...mapState([
      'a'
    ])
  },
  created () {
    setTimeout(() => {
      this.SET_A(2)
    }, 2000)
  },
  methods: {
    ...mapMutations([
      'SET_A'
    ])
  }
}
</script>
```

页面显示结果为：

```js
// 初始时
a: 1
aWithB: 3

// 2000ms 后
a: 2
aWithB: 4
```

可以发现，名为`aWithB`的`getter`结果是`state.a`和调用`aWithB`时传入的参数`b`的和，而且在`state.a`改变时，其值也会随之改变。

TODO: 待重读最新的 Vue 响应式源码之后，再来详细分析这里一层层的依赖订阅关系。

### 在带命名空间的模块注册全局 action

```js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

源码里是这么实现的：

```js
function installModule (store, rootState, path, module, hot) {
  // ...

  // 遍历 action，并注册
  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  // ...
}
```

Reference: [在带命名空间的模块注册全局 action](https://vuex.vuejs.org/zh/guide/modules.html#%E5%9C%A8%E5%B8%A6%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E6%A8%A1%E5%9D%97%E6%B3%A8%E5%86%8C%E5%85%A8%E5%B1%80-action)

### action 回调函数的结果，会处理成 Promise 对象

我们知道，action 回调函数可以返回 Promise 实例，比如：

```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

但是如果 action 回调函数没有返回 Promise 实例，Vuex 里会将返回结果处理成 Promise。

```js
// store.js
export default new Vuex.Store({
  state: {
    a: 1
  },
  mutations: {
    SET_A: (state, payload) => {
      state.a = payload
    }
  },
  actions: {
    asynSetA: ({ commit }, payload) => {
      setTimeout(() => {
        commit('SET_A', payload)
      })
      return 'this is promise data'
    }
  }
})
```

```js
// App.vue
import { mapActions } from 'vuex'
export default {
  name: 'App',
  created () {
    this.asynSetA(2).then(res => {
      console.log('action 返回结果：', res)
    })
  },
  methods: {
    ...mapActions([
      'asynSetA'
    ])
  }
}
```

结果会打印出`action 返回结果： this is promise data`。

我们来学习下源码里是如何实现的。

```js
/**
 * 注册 actions
 * @param {*} store store 实例
 * @param {*} type action 的名称（带命名空间）
 * @param {*} handler action 回调函数
 * @param {*} local 绑定命名空间的上下文对象
 */
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}
```

源码里，会对模块上的`action`即上面的`handler`做一层封装，即`wrappedActionHandler`，`wrappedActionHandler`执行时，会先执行原始的`handler`，会根据其返回结果判断，若结果是 Promise 实例则直接返回，否则处理成 Promise 实例，将其状态置为`resovled`并返回结果。

在“命名空间的副作用”一节里我们知道，可能存在同名的多个`action`，而当分发的`action`存在多个时，需要这几个`action`都`resolve`了，最终返回的 Promise 才会改变状态为`resolve`。

```js
export class Store {
  /**
   * 分发 action
   * @param {*} _type action 的名称（带命名空间）
   * @param {*} _payload payload
   */
  dispatch (_type, _payload) {
    // check object-style dispatch
    const {
      type,
      payload
    } = unifyObjectStyle(_type, _payload)

    const action = { type, payload }
    const entry = this._actions[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown action type: ${type}`)
      }
      return
    }

    // action 执行前，先调用订阅 action 变化的回调函数
    this._actionSubscribers.forEach(sub => sub(action, this.state))

    // 若 action 有多个回调，都执行完了才算 resolve
    return entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)
  }
}
```

### 严格模式

严格模式下，无论何时发生了状态变更且不是由`mutation`函数引起的，将会抛出错误。

```js
function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, () => {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
    }
  }, { deep: true, sync: true })
}
```

开启严格模式，将深度监听`state`对象，若是发现修改`state`时`store._committing`的值为`false`，则此次修改`state`不是由`mutation`函数引起的，进而抛错。

而当执行`mutation`函数修改`state`对象时，会先将`store._committing`置为`true`，修改完之后，再将`store._committing`还原，详见`_withCommit`函数。

```js
export class Store {
  // ...
  commit (_type, _payload, _options) {
    // check object-style commit
    const {
      type,
      payload,
      options
    } = unifyObjectStyle(_type, _payload, _options)

    const mutation = { type, payload }
    const entry = this._mutations[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown mutation type: ${type}`)
      }
      return
    }
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload)
      })
    })
    this._subscribers.forEach(sub => sub(mutation, this.state))

    if (
      process.env.NODE_ENV !== 'production' &&
      options && options.silent
    ) {
      console.warn(
        `[vuex] mutation type: ${type}. Silent option has been removed. ` +
        'Use the filter functionality in the vue-devtools'
      )
    }
  }
  // ...
  _withCommit (fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }
  // ...
}
```

### 命名空间的副作用

命名空间的实现机制，导致命名空间存在副作用——可能存在多个同名的`action`/`mutation`。

因而在源码实现里，`action`/`mutation`的`key`对应的`value`不是函数，而是函数数组，在`dispatch`/`commit`时，会遍历调用`action`/`mutation`。

```js
function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}

function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}
```

而命名空间的副作用是如何产生的呢？我们先来看看 Vuex 是如何处理命名空间的。

```js
// src/module/module-collection.js
class ModuleCollection {
  // ...
  getNamespace (path) {
    let module = this.root
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }
  // ...
}
```

如此可见，命名空间是有模块路径刷选而来的，针对模块链上的模块，如果该模块的`namespaced`为`true`则该模块的名称就保留在最终的命名空间里。

因此，针对模块路径为`first`和`second/first`，假设`second`是不带命名空间的模块，`first`是带命名空间的模块，那么如果`first`模块和`second`模块的子模块`first`存在同名的`mutation`比如`SET_X`（`action`同理），那么将导致在`store.commit('first/SET_X')`时，将同时提交这两个模块的`SET_X`提交。如下代码验证了以上的说法。

```js
new Vuex.Store({
  state: {
    a: 1
  },
  modules: {
    first: {
      namespaced: true,
      state: {
        a: '2'
      },
      mutations: {
        SET_A: (state, payload) => {
          console.log('SET_A in first with namespace!')
          state.a = payload
        }
      }
    },
    second: {
      namespaced: false,
      state: {
        a: '2'
      },
      modules: {
        first: {
          namespaced: true,
          state: {
            a: 3
          },
          mutations: {
            SET_A: (state, payload) => {
              console.log('SET_A in second(without namespace) and it\'s child first with namespace!')
              state.a = payload
            }
          }
        }
      }
    }
  }
})
```

```js
// Vue 组件实例里
// import { mapMutations } from 'vuex'
export default {
  name: 'App',
  mounted () {
    this.$store.commit('first/SET_A', 'the same value')
    // this.SET_A('the same value')

  },
  // methods: {
  //   ...mapMutations('first', [
  //     'SET_A'
  //   ])
  // }
}

// 输出为：
// SET_A in first with namespace!
// SET_A in second(without namespace) and it's child first with namespace!
```

### createNamespacedHelpers、mapState/mapMutation/mapAction

Vuex 里有个`helpers.js`模块，里面定义了`createNamespacedHelpers`、`mapState`、`mapMutation`、`mapAction`等辅助函数。

没读源码之前，一直好奇在这些辅助函数是如何获取到`store`实例的（但是自己却没有认真思想过这个问题..），读了源码才发现，原来都是从 Vue 实例上通过`this.$store`获取的。

整个辅助函数这块代码相当简单，此处不再赘述。

## 最佳实践

### 模块的 mutation/action 里不要用 this

实现里，根模块及嵌套子模块里的`mutation`/`action`里的`this`都是指向`store`实例，因此为了避免引起歧义，最好不要在`mutation`/`action`使用`this`

```js
/**
 * 注册 mutations
 * @param {*} store store 实例
 * @param {*} type mutation 的名称（带命名空间）
 * @param {*} handler mutation 回调函数
 * @param {*} local 绑定命名空间的上下文对象
 */
function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    // handler（模块里注册的 mutation 回调函数）调用时，this 指向 store 实例
    handler.call(store, local.state, payload)
  })
}

/**
 * 注册 actions
 * @param {*} store store 实例
 * @param {*} type action 的名称（带命名空间）
 * @param {*} handler action 回调函数
 * @param {*} local 绑定命名空间的上下文对象
 */
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    // handler（模块里注册的 action 回调函数）调用时，this 指向 store 实例
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    // ...
  })
}
```