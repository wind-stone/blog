# 安全距离

[[toc]]

## 源码

### core.styl

```stylus
safe-area-fn(fn, position)
  s('%s(safe-area-inset-%s)', fn, position)

functions = constant env
safe-area-mixin(property, position, important = false)
  for fn in functions
    {property} safe-area-fn(fn, position) important == true ? !important : unquote('')
```

### index.styl

```stylus
@import "./core.styl"

.safe-area-pt
  safe-area-mixin(padding-top, top, true)
.safe-area-pr
  safe-area-mixin(padding-right, right, true)
.safe-area-pb
  safe-area-mixin(padding-bottom, bottom, true)
.safe-area-pl
  safe-area-mixin(padding-left, left, true)
```

## 使用说明

此工具基于`stylus`为 iPhone X 等具有安全距离的手机提供适配，兼容 iOS 11.1 的`constant`和 iOS 11.2+ 的`env`。

此工具的里

- `core.styl`：提供了核心的`stylus`函数定义和`mixin`定义
- `index.styl`：基于`core.styl`暴露了常用的类名

### 方式一：添加类名

```stylus
// 引入
@import '{path}/index.styl'
```

```html
<!-- 给需要的元素添加对应的类型 -->
<div class="safe-area-pb"></div>
```

```css
/* 产出的 safe-area-pb 类的规则 */
.safe-area-pb {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
```

暴露的类名及对应会添加的属性和属性值如下表所示。

| 类名         | 属性           | 属性值                 |
| ------------ | -------------- | ---------------------- |
| safe-area-pt | padding-top    | safe-area-inset-top    |
| safe-area-pr | padding-right  | safe-area-inset-right  |
| safe-area-pb | padding-bottom | safe-area-inset-bottom |
| safe-area-pl | padding-left   | safe-area-inset-left   |

### 方式二：调用 mixin

假设无法直接给元素添加类名或者`index.styl`里暴露的类名不满足要求，可以直接调用`core.styl`里的`safe-area-mixin`函数。

```stylus
// 引入
@import '{path}/core.styl'
```

```html
<!-- 元素存在特定类名，无法添加新类名 -->
<div class="sf-mb"></div>
```

```stylus
.sf-mb
  safe-area-mixin(margin-bottom, bottom)
```

产出:

```css
.sf-mb {
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
}
```

其中，safe-area-minxin 的参数为：

- `property`：必需，要添加的属性名，如`margin-bottom`
- `position`：必需，要取得的属性值，值为`top`/`right`/`bottom`/`left`，对应`safe-area-inset-top/right/bottom/left`
- `important`：可选，布尔值，是否添加`!important`

### 最佳实践

如果项目用不到工具里暴露的类名，可以仅仅引入`core.styl`文件，此时只有调用了`safe-area-minxin`的地方才会有最终的 CSS 产出，不调用则不会产出任何 CSS 代码。
