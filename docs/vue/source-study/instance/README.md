---
sidebarDepth: 0
---

# 组件实例化

## 根组件的实例化 VS 普通组件实例化

- 根组件实例：是指在`main.js`里显示调用`new Vue(options)`生成的实例
- 普通组件实例：是指只定义了组件选项对象，在生成 DOM Tree 的过程中隐式调用`new vnode.componentOptions.Ctor(options)`生成的组件

现在我们来总结一下，根组件实例和普通组件实例在实例化过程中的区别。
