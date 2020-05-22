# CSS 代码片段

## safe area

针对 iPhone X 等手机，给元素的任意属性，添加安全距离。

```styl
// 定义
safe-area-mixin($property, $value, $safeAreaDirection = bottom, $important = false)
    {$property} $value
    for fn in constant env
        {$property} s('calc(%s + %s(safe-area-inset-%s)', $value, fn, $safeAreaDirection) $important == true ? !important : unquote('')

// 使用
body {
    safe-area-mixin(height, bottom, 20px, true)
}

// 或
body
    safe-area-mixin(
        $property: height,
        $value: 20px,
        $safeAreaDirection: bottom,
        $important: true
    )

// 结果
body {
  height: 20px;
  height: calc(20px + constant(safe-area-inset-bottom) !important;
  height: calc(20px + env(safe-area-inset-bottom) !important;
}
```

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
