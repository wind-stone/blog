---
sidebarDepth: 0
---

# 文字省略

[[toc]]

## 单行省略

```scss
@mixin one-line-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
```

```stylus
one-line-ellipsis(maxWidth = 100%)
    max-width maxWidth
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
```

```less
.one-line-ellipsis() {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
```

## 多行省略

```less
.multi-line-ellipsis(@line) {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: @line;
    -webkit-box-orient: vertical;
}
```
