# 优雅地重置 Vuex 子模块的 State

参考: [Reset Vuex Module State Like a Pro](https://tahazsh.com/vuebyte-reset-module-state)

Vue SPA 项目里，我们可能会使用 Vuex 管理应用里的数据，且会依据路由来拆分 Store 的子模块（`child module`），每个路由对应一个子模块。

而在路由切换时，旧的路由对应的子模块可能就不再需要，这时候就要清理子模块的`state`，以便释放内存，或下次再次进入该旧路由时可以获取到初始的`state`数据。

那么如何优雅地重置子模块的`state`呢？

假设我们的 Store 目录如下：

```txt
store
├── index.js
└── modules
    └── cart.js
```

我们可以这样重置：

```js
const getDefaultState = () => {
  return {
    items: [],
    status: 'empty'
  }
}

// initial state
const state = getDefaultState()

const actions = {
  resetCartState ({ commit }) {
    commit('resetState')
  },
  addItem ({ state, commit }, item) { /* ... */ }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

export default {
  state,
  getters: {},
  actions,
  mutations
}
```

