# 【中级】如何实现内容高度不够时 footer 吸底的效果

```html
<div class="wrapper">
  <div class="content">
     内容区域
  </div>
  <div class="footer">footer 区域</div>
</div>
```

## 参考答案

### 方案一：min-height + absolute

```css
html,
body {
  height: 100%;
}
.wrapper {
  position: relative;     /* 关键 */
  box-sizing: border-box;
  min-height: 100%;       /* 关键 */
}
.wrapper .content {
  padding-bottom: 100px;
}
.footer {
  position: absolute;     /* 关键 */
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;          /* 设置固定高度 */
}

```

### 方案二：flexbox

```css
html,
body {
  height: 100%;
}
.wrapper {
  min-height: 100%;       /* 关键 */
  display: flex;          /* 关键 */
  flex-direction: column; /* 关键 */
}
.wrapper .content {
  flex: 1; /* 关键 */
}

/* 高度可以不设置 */
.footer {}
```

### 方案三：min-height + calc

```css
html,
body {
  height: 100%;
}

.wrapper {
  min-height: 100%; /* 关键 */
}

.wrapper .content {
  min-height: calc(100% - 100px); /* 关键 */
}

/* 高度需要固定 */
.footer {
  height: 100px;
}
```

参考：[CSS实现footer“吸底”效果](https://juejin.cn/post/6844903688469741576)

可引申：`footer`常驻底部实现及文档流`position`、`flex`等
