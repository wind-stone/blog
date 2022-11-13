# 通用弹窗

[[toc]]

## 说明

移动端 h5 中，弹窗会处于全屏固定定位的蒙层之上。

但是在默认情况下，以下情况，会导致蒙层下面的内容也会随之滑动（参见示例一）：

- 弹窗内容元素外：在蒙层元素上滚动
- 弹窗内容元素内：
  - 在不可滚动的元素上滚动
  - 在可滚动的内容滚动到顶部/底部后，继续滚动

通常情况下，蒙层之下的内容随之滚动不是我们所需要的效果。

因此，通用弹窗组件就是解决这个问题的，该组件支持：

- 可选择是否禁止蒙层之下的内容滚动
- 可允许弹窗内的内容滚动

## 示例

PS：请在手机端打开该页面进行体验

### 示例一：允许蒙层之下的内容滚动

<code-snippet-vue-components-common-popup-example :forbid-bg-scroll="false" />

### 示例二：禁止蒙层之下的内容滚动

<code-snippet-vue-components-common-popup-example :forbid-bg-scroll="true" />

## 调用

```html
<common-popup
    v-model="true"
    :forbid-bg-scroll="true"
    scroll-area-selector=".scroll-area"
    :show-close="true"
    @close="hide">
    <div class="common-popup-slot">
        用户自定义的 slot 内容，需要自己写样式
    </div>
</common-popup>
```

### 参数说明

#### 特性 attribute

- `v-model`：`Boolean`类型，控制弹窗是否显示，默认为`false`
- `forbid-bg-scroll`：`Boolean`类型，控制是否禁止蒙层之下的内容滚动，默认为`true`
- `scroll-area-selector`：`String`类型，弹窗内可滚动的元素选择器，比如`.scroll-area`，仅在`forbid-bg-scroll`为`true`时有效
- `show-close`：`Boolean`类型，是否显示关闭按钮

#### 事件

- `close`事件：点击“关闭 ❎”按钮时触发

## 代码

### 调用示例

@[code vue](@components/code-snippet/vue-components/common-popup/example.vue)

### 组件源码

@[code vue](@components/code-snippet/vue-components/common-popup/index.vue)
