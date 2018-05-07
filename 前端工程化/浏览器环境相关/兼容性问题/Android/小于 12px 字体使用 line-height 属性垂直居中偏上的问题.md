# 小于 12px 字体使用 line-height 属性垂直居中偏上的问题

问题描述：[Android 浏览器文本垂直居中问题](http://imweb.io/topic/5848d0fc9be501ba17b10a94)

## 解决方案

### 方案一：scale

```html
<span class="content">测试文本</span>
```

```css
.content {
  display: inline-block;
  height: 40px;
  background-color: gray;
  line-height: 40px;
  font-size: 20px;
  transform: scale(0.5);
  transform-origin: 0% 0%;
}
```

该方法存在的问题是：元素原先占据的空间不会因为`scale(.5)`而改变。


### 方案二：table-cell

```html
<div class="container">
  <span class="content">testtesttesttesttest</span>
</div>
```

```css
.container {
  display: table;
}
.content {
  background-color: gray;
  font-size: 10px;
  display: table-cell;
  vertical-align: middle;
}
```

该方法的缺点是：内容标签外部增加了一层标签


### 方案三：伪元素 + vertical-align: middle

```html
<span class="content">测试文本</span>
```

```css
.content::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 100%;
  margin-top: 1px;
}
```

原理：伪元素设置了`vertical-align: middle;`之后，伪元素（行内元素框）会与父元素基线上方0.5ex处的一个点对齐。

PS：大多数用户代理都把`1ex`处理成`0.5em`。