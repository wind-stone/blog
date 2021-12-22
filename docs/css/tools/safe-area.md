# 安全距离

[[toc]]

针对 iPhone X 等手机，给元素的任意属性，添加安全距离，兼容 iOS 11.1 的`constant`和 iOS 11.2+ 的`env`。

## stylus 版本

```styl
safe-area-mixin($property, $position = bottom, $value = 0px, $important = false)
    {$property} $value
    for fn in constant env
        {$property} s('calc(%s + %s(safe-area-inset-%s)', $value, fn, $position) $important == true ? !important : unquote('')
```

其中，`safe-area-mixin`的参数为：

- `$property`：必需，要添加的属性名，如`margin-bottom`
- `$position`：可选，要获取的安全距离的位置，值为`top`/`right`/`bottom`/`left`，对应`safe-area-inset-top/right/bottom/left`
- `$value`: ，需要额外增加的尺寸
- `$important`：可选，布尔值，是否添加`!important`

```styl
// 使用
body {
    safe-area-mixin(height, bottom, 20px, true)
}

// 或
body
    safe-area-mixin(
        $property: height,
        $position: bottom,
        $value: 20px,
        $important: true
    )

// 结果
body {
  height: 20px;
  height: calc(20px + constant(safe-area-inset-bottom) !important;
  height: calc(20px + env(safe-area-inset-bottom) !important;
}
```

## less 版本

```less
.safe-area-bottom(@property: padding-bottom; @position: bottom; @offset: 0px) {
    @supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
        & when(@offset = 0) {
            @{property}: ~'env(safe-area-inset-@{position})';
            @{property}: ~'constant(safe-area-inset-@{position})';
        }

        & when(@offset > 0) {
            @{property}: ~'calc(@{offset} + env(safe-area-inset-@{position}))';
            @{property}: ~'calc(@{offset} + constant(safe-area-inset-@{position}))';
        }

        & when(@offset < 0) {
            @{property}: ~'calc(@{offset} - env(safe-area-inset-@{position}))';
            @{property}: ~'calc(@{offset} - constant(safe-area-inset-@{position}))';
        }
    }
}
```

前提：`@property`传入`padding-bottom`，`@position`传入`bottom`。

`~`操作符：

> Escaping allows you to use any arbitrary string as property or variable value. Anything inside ~"anything" or ~'anything' is used as is with no changes except interpolation.

比如将`~'env(safe-area-inset-@{position})'`转成`env(safe-area-inset-bottom)`。

如果不用`~`，而是直接用`@{property}: env(safe-area-inset-@position)`的话，编译结果是`padding-bottom: env(safe-area-inset- bottom)`，`@position`前面会多个空格。

`~`操作符，详见[less - Operations - Escape](https://lesscss.org/#escaping)。
