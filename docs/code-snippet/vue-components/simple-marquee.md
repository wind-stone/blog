---
sidebarDepth: 0
---

# 简单跑马灯

## 说明

简单的跑马灯实现，支持：

- 自适应内容项的高度

## 示例

<simple-marquee-example></simple-marquee-example>

## 调用

```html
<simple-marquee>
    <!-- 请确保此处的 slot 内容是个 v-for 循环的标签，且必须存在 key -->
    <div v-for="i in 10" :key="i" class="marquee-item">{{ new Array(10).fill(i).join(' ') }}</div>
</simple-marquee>
```

## 代码

### 组件源码

<<< @/docs/.vuepress/components/simple-marquee/index.vue