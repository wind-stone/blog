# composition-api

- `setup`的调用时机？
- `setup`内调用`onMounted`等生命周期钩子后，这些钩子是如何关联到组件实例`vm`上的？
- `setup`返回值是如何挂在`vm`上的？

## 状态管理

- [Should You Use Composition API as a Replacement for Vuex?](https://vuejsdevelopers.com/2020/10/05/composition-api-vuex/)
- [中文版 - 你是否应该使用Composition API替代Vuex？](https://zhuanlan.zhihu.com/p/320445941)

使用体验上来说，不借助 Vuex 来做状态管理的话，代码写着很难受。

- 状态管理的代码组织方式千奇百怪
