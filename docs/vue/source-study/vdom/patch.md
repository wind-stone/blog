---
sidebarDepth: 0
---

# Patch

[[toc]]

## insertedVnodeQueue 的作用

待补充内容

insertedVnodeQueue 的添加顺序是先子后父

所以对于同步渲染的子组件而言，

## 钩子函数的执行顺序

- 先父组件后子组件的有：
  - `beforeCreate`
  - `created`
  - `beforeMount`
  - `beforeUpdate`
  - `updated`
  - `beforeDestroy`
- 先子组件后父组件的有：
  - `mounted`
  - `destroy`

## 组件更新算法

