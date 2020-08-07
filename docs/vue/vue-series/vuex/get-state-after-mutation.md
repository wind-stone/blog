# vuex 里在 action 里提交 mutation 之后可以立即同步获取到最新的 state 吗

## 背景

项目里使用到了`vuex`，且采用`mapState`/`mapGetter`从`store`里获取数据，那么当我们在`action`里提交`mutation`修改数据后，可以同步获取到最新的`state`吗？

有一次在写代码时，我就遇到了这个疑惑。考虑如下代码（为了突出本文讨论的重点，我将原场景尽可能地简化）:

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function getStatus ({ isFirst } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(isFirst ? 'ONGOING' : 'FINISHED')
    }, 1000)
  })
}

export default new Vuex.Store({
  state: {
    status: 'ONGOING'
  },
  mutations: {
    updateStatusMutation (state, status) {
      state.status = status
    }
  },
  actions: {
    async getStatusAction ({ commit }, params) {
      const status = await getStatus(params)
      commit('updateStatusMutation', status)
      return status
    }
  }
})
```

```vue
<template>
  <div class="vuex-test">
    <span>活动状态: {{ status }}</span>
    <button @click="getStatusAndHandle">Handle</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'vuex-test',
  computed: {
    ...mapState([
      'status'
    ])
  },
  async created () {
    try {
      await this.getStatusAction({
        isFirst: true
      })
    } catch {
      // catch error
    }
  },
  methods: {
    ...mapActions([
      'getStatusAction'
    ]),
    async getStatusAndHandle () {
      let status = this.status
      try {
        status = await this.getStatusAction()
      } catch {
        // catch error
      }
      if (status === 'ONGOING') {
        // 活动进行中的处理
      } else {
        // 活动结束的处理
      }
    }
  }
}
</script>
```

用户点击按钮后，要获取到最新的活动状态，若获取失败则使用之前的状态，之后根据状态进行不同的业务逻辑处理。

上述代码在组件的`created`钩子里获取初始的活动状态并提交到`state`里，在业务组件里通过`mapState`获取到活动状态。而当活动状态
