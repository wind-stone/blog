# 虚拟滚动

## 参考文档

- [别再抱怨后端一次性传给你 1w 条数据了，几行代码教会你虚拟滚动！](https://juejin.cn/post/7301911743487590452)，简单版
- [花三个小时，完全掌握分片渲染和虚拟列表～](https://juejin.cn/post/7121551701731409934?searchId=2025091714474992EE8ABA620737BFC942)，完整版

## 实现效果

### 元素高度相同且固定

<animation-effects-virtual-scroll-item-fixed-height-example></animation-effects-virtual-scroll-item-fixed-height-example>

#### 父组件源码

@[code vue](@components/animation-effects/virtual-scroll/item-fixed-height-example.vue)

#### 高度固定虚拟滚动组件

@[code vue](@components/animation-effects/virtual-scroll/item-fixed-height.vue)

### 元素动态高度

<animation-effects-virtual-scroll-item-dynamic-height-example></animation-effects-virtual-scroll-item-dynamic-height-example>

#### 父组件源码

@[code vue](@components/animation-effects/virtual-scroll/item-dynamic-height-example.vue)

#### 动态高度虚拟滚动组件

@[code vue](@components/animation-effects/virtual-scroll/item-dynamic-height.vue)

## 参考文档里的效果

[别再抱怨后端一次性传给你 1w 条数据了，几行代码教会你虚拟滚动！](https://juejin.cn/post/7301911743487590452)，这篇文档里的简版效果是这样的：

<animation-effects-virtual-scroll-simple></animation-effects-virtual-scroll-simple>
