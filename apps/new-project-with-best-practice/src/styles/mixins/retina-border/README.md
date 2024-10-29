# retina-border

实现移动端 1px 物理像素边框，可实现任意原生的边框。

在 DPR = 2 的屏幕上会显示 0.5px CSS 像素，即 1px 物理像素。

在 DPR = 3 的屏幕上会显示 0.3333333px CSS 像素，即 1px 物理像素。

注意：

此方式是通过将元素的 before 伪类来实现 1px 物理像素边框的，因此元素的 before 不能再做他用，但是可以使用元素的 after 伪类。

## Features

- 可以模拟出 原生 CSS 的所有形式的边框，边框大小最小可以达到 1px 物理像素
- 通过继承功能，最终**产出的代码量最少**

## 参数说明

retina-border 函数的参数依次为：

- borderWidth：边框宽度，默认为 1px
- borderStyle：边框类型，默认为 solid
- borderColor：边框颜色，默认为 rgba(0, 0, 0, .08)
- borderRadius：边框圆角，默认为 0

需要注意的是：

- 这些参数的值的写法跟原生 CSS 完全一致，比如 borderWidth: 1px 0 代表只有上下边框
- 如果 borderRadius 存在，会给该元素添加 border-radius 声明，且边框的 border-radius 会自动匹配 DPR

只要原生 css 可以实现的边框，都可以通过使用 retina-border 函数并依次传入四个参数实现。

## 调用

### 无参数名，参数需按序传入

```less
// 无参数名，参数值需按序传入
.border-whatever {
  #retina-border(1px 2px 3px 4px; solid; red; 2px);
}
.border-whatever {
  #retina-border(1px 2px 3px 4px; solid; red);
}
.border-whatever {
  #retina-border(1px 2px 3px 4px; solid);
}
.border-whatever {
  #retina-border(1px 2px 3px 4px);
}
```

- 参数依次为：边框宽度、边框风格、边框颜色、边框圆角，各参数的使用方式同原生边框，可以简写，以 border-width 为例：
  - border-width: 1px
  - border-width: 1px 0
  - border-width: 1px 0 1px
  - border-width：1px 2px 3px 4px
- 参数间使用分号 ; 分隔，如果想省略参数，只能从最右参数依次向左省略，不能越过省略，如
  - #retina-border(border-width); √
  - #retina-border(border-style; border-color; border-radius); ×

### 有参数名，参数可无序传入

```less
.border-xxx {
  #retina-border(@borderWidth: 1px; @borderColor: red);
}
```

- 参数为键值对，使用 : 分开，参数间使用 ; 隔开
- 参数的键有 @borderWidth、@borderStyle、@borderColor、@borderRadius，参数间不区分顺序
