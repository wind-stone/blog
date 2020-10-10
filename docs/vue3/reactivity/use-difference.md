# Vue 2 和 Vue 3 响应式使用的差异

## 动态添加/删除属性

由于 Vue 2 基于`Object.defineProperty`来实现响应式的局限性，Vue 2 里如下的操作不会触发视图更新：

- 为对象（数组）添加/删除新属性（新元素）
- 对数组基于下标的修改、对于`length`修改的监测
- 对 Map、Set、WeakMap 和 WeakSet 的支持

因此，Vue 2 里使用`Vue.set`（`vm.$set`）和`Vue.delete`（`vm.$delete`）来解决前两个问题。

以`vm.$set`为数组添加新元素为例（对象）：

```js
export default {
  data () {
    return {
      array: []
    }
  },
  mounted () {
    this.$watch(
      () => {
        console.log('re-calculate')
        return this.array[0]
      },
      () => console.log('array[0] 改变了')
    )

    let i = 0
    setInterval(() => {
      console.log(`2000ms 后，设置 array[${i}] = 0`)
      this.$set(this.array, i, 0)
      i++
    }, 2000)
  }
}
// 结果
// re-calculate
// 2000ms 后，设置 array[0] = 0
// re-calculate
// array[0] 改变了
// 2000ms 后，设置 array[1] = 0
// re-calculate
// 2000ms 后，设置 array[2] = 0
// re-calculate
// 2000ms 后，设置 array[3] = 0
// re-calculate
// ...
```

可以看到，每当为`array`添加一个新的元素时，就会打印一次`re-calculate`，因为调用`vm.$set`为数组设置新元素会通知所有依赖`array`的 Watcher 进行重新计算。具体源码及分析可以查看[Vue 2.x 响应式原理 - 通知更新 - 引用类型](https://blog.windstone.cc/vue/source-study/observer/notify-update.html#%E5%BC%95%E7%94%A8%E7%B1%BB%E5%9E%8B)

但是在 Vue 3 里，基于 Proxy 实现的响应式不再有这些限制，当为数组添加新元素时，不会再通知依赖`array`的 Watcher 进行重新计算，因为每次只是为`array`添加新元素，而没有修改`array`的引用。（因为监听的是`array[0]`，只在`array[0]`变化时才会触发 Watcher 重新计算）

```js
import { reactive } from '@vue/reactivity'
import { watch } from 'vue';
export default {
    name: 'App',
    setup() {
      const data = reactive({
        array: []
      })

      watch(
        () => {
          console.log('re-calculate')
          return data.array[0]
        },
        () => console.log('data.array[0] 改变了')
      )

      let i = 0
      setInterval(() => {
        console.log(`2000ms 后，设置 data.array[${i}] = 0`)
        data.array[i] = '0'
        i++
      }, 2000)
    }
}
// 结果
// re-calculate
// 2000ms 后，设置 data.array[0] = 0
// re-calculate
// data.array[0] 改变了
// 2000ms 后，设置 data.array[1] = 0
// 2000ms 后，设置 data.array[2] = 0
// 2000ms 后，设置 data.array[3] = 0
// ...
```
