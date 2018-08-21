---
sidebarDepth: 0
---

# Scoped CSS

[[toc]]

## 使用

```html
<template>
  <div class="hello">
    <div class="world"></div>
  </div>
</template>

<style lang="less" scoped>
.hello {
  color: #333;
  > .world {
    color: #444;
  }
}
</style>
```

转换结果：

```html
<template>
  <div data-v-469af010 class="hello">
    <div data-v-469af010 class="world"></div>
  </div>
</template>

<style>
.hello[data-v-469af010] {
  color: #333;
}
.hello > .world[data-v-469af010] {
  color: #444;
}
</style>
```

## 渲染规则

- 给组件内的（不包括子组件）所有 DOM 节点添加唯一的`data-v`属性(形如`data-v-24167b06a`)
  - 子组件的根节点会添加属于父组件的`data-v`属性，但根节点之下的 DOM 不会添加输入父组件的`data-v`属性
- 在每条（编译后生成的）CSS 规则的最后一个选择器之后，再添加一`data-v`属性选择器（如`[data-v-24167b06a]`）,以便这条规则仅对该组件内拥有该`data-v`属性的 DOM 节点生效

## 深度作用选择器

### 问题的产生

若是父组件的样式是`scoped`，如果在父组件里，覆盖子组件里 DOM 元素的样式呢？

```html
<template>
  <div class="child-component">
    <button>你好</button>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent'
}
</script>

<style lang="less">
button {
    background-color: red;
}
</style>
```

子组件`ChildComponent`如上所示，`button`的背景颜色是`red`。

```html
<template>
  <div class="hello">
    <div class="world"></div>
    <ChildComponent></ChildComponent>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent'
export default {
  name: 'HelloWorld',
  components: {
    ChildComponent
  }
}
</script>

<style lang="less" scoped>
.hello {
  color: #333;
  > .world {
    color: #444;
  }
  button {
    background-color: green;
  }
}
</style>
```

父组件`HelloWorld`如上所示，正如你所见，在父组件的样式里，想修改子组件`ChildComponent`里`button`元素的背景色为`green`。但是因为父组件`HelloWorld`的样式里添加了`scoped`，结果并不能如愿，button 的颜色仍然是`red`。

最终渲染出来的 HTML 和 CSS 如下所示。

```html
<div data-v-469af010 class="hello"">
  <div data-v-469af010 class="world"></div>
  <div data-v-469af010 class="child-component">
    <button>你好</button>
  </div>
</div>
```

```css
<!-- 子组件样式 -->
button {
  background-color: red;
}

<!-- 父组件样式 -->
.hello[data-v-469af010] {
  color: #333;
}
.hello > .world[data-v-469af010] {
  color: #444;
}
.hello button[data-v-469af010] {
  background-color: green;
}
```

最终编译出的 CSS 里，关于`button`的规则里，`button`选择器后追加了属性选择器`[data-v-469af010]`。但是在渲染出的 HTML 里，`button`元素并没有`data-v-469af010`属性，导致父组件样式里声明的背景颜色`green`实际上并没有覆盖子组件里`button`的背景颜色`red`。

这是什么原因呢？

正如之前渲染规则里所说，若组件存在子组件，则仅有子组件的根节点会有`data-v`属性，子组件根节点之下的 DOM 节点不会有`data-v`组件（前提是子组件的 CSS 是非 scoped 的）。此时，如果想覆盖子组件内 DOM 元素的样式，将变得较为困难。因为在父组件 CSS 的每条规则的最后，都会添加`data-v`属性选择器，而子组件内的 DOM 节点是没有父组件的`data-v`属性的，最终导致在父组件里无法覆盖子组件里 DOM 元素的样式。

### 解决方案

针对以上的问题，`vue-loader`给出了解决方案，就是使用深度作用选择器。

```css
.hello {
  color: #333;
  > .world {
    color: #444;
  }
  /* button 元素选择器前添加 /deep/ 深度作用选择器 */
  /deep/ button {
    background-color: green;
  }
}
```

父组件里在`button`元素选择器前添加`/deep/`深度作用选择器，最终生产的 CSS 如下所示。

```css
<!-- 子组件样式 -->
button {
  background-color: red;
}

<!-- 父组件样式 -->
.hello[data-v-469af010] {
  color: #333;
}
.hello > .world[data-v-469af010] {
  color: #444;
}
.hello[data-v-469af010] button {
  background-color: green;
}
```

加上深度选择器之后，`data-v`属性选择器将加在声明时的`/deep/`选择器之前的选择器上（此例里是加在`.hello`选择器上），而不是最后一个选择器上（此例里是`button`选择器），父元素最终覆盖了子组件里 DOM 元素的样式。

注意：

- `/deep/`这种写法是用在预处理器里的，常规的 CSS 里，可以使用`>>>`来替换掉`/deep/`

## 最佳实践

- 通用组件/基础组件，不要添加`scoped`
  - 方便调用方覆盖样式
- 业务组件，可以添加`scoped`
  - 防止被全局样式覆盖
  - 防止组件内的样式影响子组件的样式

参考：

- [vue-loader: 有作用域的 CSS](https://vue-loader.vuejs.org/zh-cn/features/scoped-css.html)
- [Vue.js 风格指南-为组件样式设置作用域](https://cn.vuejs.org/v2/style-guide/index.html#%E4%B8%BA%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E8%AE%BE%E7%BD%AE%E4%BD%9C%E7%94%A8%E5%9F%9F-%E5%BF%85%E8%A6%81)
