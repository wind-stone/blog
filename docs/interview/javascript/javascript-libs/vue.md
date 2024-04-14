# Vue

## 【初级】v-if 和 v-show 的区别和应用场景

## 【中级】Vue 的依赖收集

## 【中级】nextTick 是如何实现的？数据响应式变化时，为什么要使用 nextTick？

## 【中级】Vue 2.x的响应式是怎么做的？这种做法有什么缺点？

## 【中级】renderWatcher

```HTML
<template>
    <div>{{a}}</div>
</template>

<script>
export default {
    data: { a: 0 },
    mounted() {
        this.a = 1;
        this.a = 2;
        this.a = 3;
    },
}
</script>
```
