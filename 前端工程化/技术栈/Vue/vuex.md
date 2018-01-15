## registerModule 里的坑

### 问题描述

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


### 问题追踪