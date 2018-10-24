---
sidebarDepth: 0
---

# Observer

[[toc]]

## Object.defineProperty

目前 Vue 里的响应式是使用`Object.defineProperty`来实现的，但是存在一些局限：

- 对属性的添加、删除动作的监测
- 对数组基于下标的修改、对于 .length 修改的监测
- 对 Map、Set、WeakMap 和 WeakSet 的支持

第一条和第二条，已经通过其他方式弥补了。
