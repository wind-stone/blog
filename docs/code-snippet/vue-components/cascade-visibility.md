# 级联 v-model

前置知识：大概了解`v-model`的实现方式。

## 背景

有时候我们可能会出现级联使用`v-model`的情况，比如 A 组件里通过`v-model="proA"`控制 B 组件的可见性，B 组件再通过`v-model="proA"`将属性`proA`传入 C 组件，控制 C 组件的可见性。

但当在 C 组件里通过`emit`事件的方式改变`proA`的值，就出问题了。因为 C 组件`emit`事件是让 B 组件改变`proA`的值，但`proA`是 B 组件的`props`，组件是不能直接修改`props`的，因此报错（若是生产环境下，可能不会报错）。

### 示例及代码

<!-- <cascade-visibility-OldA /> -->

请打开控制台，并点击上方的按钮，并查看报错。

A 组件:

@[code vue](@components/cascade-visibility/OldA.vue)

B 组件:

@[code vue](@components/cascade-visibility/OldB.vue)

C 组件:

@[code vue](@components/cascade-visibility/OldC.vue)

## 解决方案

以上示例之所以会报错，是因为 B 组件里直接修改了`props`里的`proA`，如果在 B 组件里可以间接地通过`emit`事件让 A 组件来修改`proA`就没问题了。

<!-- <cascade-visibility-NewA /> -->

A 组件(仅修改了引入 NewB 组件):

@[code vue](@components/cascade-visibility/NewA.vue)

B 组件（引入 CascadeVisibility.js 组件）:

@[code vue](@components/cascade-visibility/NewB.vue)

CascadeVisibility.js:

@[code vue](@components/cascade-visibility/CascadeVisibility.js)

C 组件无需修改。
