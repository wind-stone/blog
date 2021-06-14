# CSS 兼容性

[[toc]]

## background-size: 100% auto; 导致 background-repeat 属性失效

部分华为浏览器，以下的代码将不起作用。其直接表现为设置`background-size: 100% auto;`会导致`background-repeat`属性失效。

```css
div {
    background: #FFE6AE url('...') top left/100% repeat-y;

    /* 或 */
    background: #FFE6AE url('...') top left repeat-y;
    background-size: 100% auto;
}
```

解决办法：`background-size`的第二个参数不能使用`auto`，可使用`1px`代替，即`background-size: 100% 1px`。

```css
div {
    background: #FFE6AE url('...') top left/100% 1px repeat-y;
}
```

## flex 兼容性问题

### flex-basis

`flex-basis`的默认值是`auto`。

但是在 iOS 10.2 及以下版本，`flex-basis`的默认值为`0`。

Reference: [flex:1在iOS10.2导致flex-wrap 不起作用](https://jsonz1993.github.io/2017/08/flex-1%E5%9C%A8iOS10-2%E5%AF%BC%E8%87%B4flex-wrap%E4%B8%8D%E8%B5%B7%E4%BD%9C%E7%94%A8bug/)

## rem 在 Android APP 的 webview 计算不准确的问题

Reference: [rem布局在webview中页面错乱](https://blog.csdn.net/u013778905/article/details/77972841)

前置信息:

- 内嵌在 APP 里面的 H5 页面
- 使用`rem`作为单位
- `html`元素的`font-size`设置正常
- 系统浏览器和绝大部分手机上，正常显示
- 在某些手机上，页面元素变大了（或变小了），调试后发现是`rem`计算成`px`时不准确导致

结论:

- 手机系统设置了字体大小，导致 APP 里 webview 里的默认字体大小偏大或偏小。将系统字体设置为“正常”即可解决问题。
- 若想要在用户设置了系统字体大小之后仍能正常显示，可参考 Reference 里的解决方法。

## 小于 12px 字体使用 line-height 属性垂直居中偏上的问题

[[toc]]

问题描述：[Android 浏览器文本垂直居中问题](http://imweb.io/topic/5848d0fc9be501ba17b10a94)

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

## IE

### IE6~8 CSS hack

| 版本\hack | _   | *   | \0  | \9  |
| --------- | --- | --- | --- | --- |
| IE 6      | √   | √   | ×   | √   |
| IE 7      | ×   | √   | ×   | √   |
| IE 8      | ×   | ×   | √   | √   |

各类写法如下：

```css
.test {
    _color:#FF0000;         /*仅 IE6支持 */
    *color:#FFFF00;          /* 仅 IE6、7支持 */
    color:#0000FF\0;       /* 仅 IE8支持 */
    color:#0000FF\9;       /* 所有IE浏览器(IE6+)支持 */
}
```

更详细的信息见：[http://blog.csdn.net/freshlover/article/details/12132801](http://blog.csdn.net/freshlover/article/details/12132801)

### IE6 float 换行

在浮动元素上添加如下代码

- display: inline-block;
- overflow: hidden;

### IE6 a:hover 问题

原因：是ie6对a:hover子标签的解读是建立在父标签的hover设置上的，换句话说如果不设置任何父标签a:hover{}则ie6就会停止对a的子标签hover解读

比如

```html
<a href ="#">鼠标经过时改变我的<em>颜色</em></a>
```

```css
a:hover em {
  color:#F00;
}
```

上述代码不会生效。需改成 （只要存在 a:hover {} 即可，不管里面是什么规则）

```css
a:hover {zoom: 1;}
a:hover em{color:#F00;}
```

参考文档：[http://www.jb51.net/css/149472.html](http://www.jb51.net/css/149472.html)

### IE6~8 a 超链接被击穿问题

描述：当用超链接 a 绝对定位在某个元素 ele（内含图片或者文字）上时，超链接 a 会被击穿，鼠标放在 ele 上的图片或者文字上时，超链接无效，并且无法跳转。

解决方案：设置超链接的背景（不能为transparent），然后通过 filter 设置透明度。

### IE6 多类选择器 bug（避免使用）

```css
.first.second {}
.third.second {}
```

上述两句都只会应用的 .second 上，并且第二句会覆盖第一句

### IE6 相对父容器绝对定位的bug

两种方法

- 给父层设置zoom:1触发layout
- 给父层设置宽度（width(定位left)/height(定位bottom)）

详见： [http://blog.csdn.net/zhouyong0/article/details/6318485](http://blog.csdn.net/zhouyong0/article/details/6318485)

### IE6 固定定位

IE6不支持固定定位，但是可以依靠绝对定位和 JS 来模拟。具体代码为：

```js
    var pos6 = function(){
        var scrollHeight = $(window).scrollTop();
        var bodyHeight   = $('body').height();
        floatwrap.css('top', (scrollHeight - 532) + 'px');
        floatwrap.css('right','-48px');
    };
    var ie6float = function(){
        if (!$.isIE6){
            return ;
        }
        floatwrap.css('display','block').css('position','absolute');
        pos6();
        var ie6timer;
        var _goPos = function(){
            floatwrap.css('display','none');
            clearTimeout(ie6timer);
            ie6timer = setTimeout(function(){
                floatwrap.css('display','block');
            },200);
            pos6();
        };
        $(window).on('scroll',function(){
            _goPos();
        });
        $(window).on('resize',function(){
            _goPos();
        });
    };
    ie6float();
```

### IE 6~8（9及以上没有测） 输入框内容高度兼容性问题

对于下面一段代码：phone-text是输入框，输入框 height + 上下pading + 上下border = 48

```css
.phone-text {
    width: 180px;
    height: 40px;
    font-size: 24px;
    border: 2px solid #fd5c47;
    padding: 2px 5px;
    vertical-align: middle;
}
```

chrome下，会自动将输入的文字垂直居中

IE 6~8下：，不会将输入的问题垂直居中

将代码改成

```css
.phone-text {
    width: 180px;
    height: 24px;
    font-size: 24px;
    border: 2px solid #fd5c47;
    padding: 10px 5px;
    vertical-align: middle;
}
```

### IE 6、7下将 块级元素设置为 display: inline-block; 失效

解决方法：

```css
{
    display: inline-block;

   /*在 display: inline-block 下面添加以下两个规则*/
    *zoom: 1;
    *display: inline;
}
```

### IE 6 overflow: hidden; 失效

IE6 对 overflow 属性的理解有误，说白了是 IE6 的一个 bug，IE7 开始已经修复这个问题，也就是说IE7/IE8下 overflow: hidden; 可以清除浮动造成的影响-- [张鑫旭-对overflow与zoom”清除浮动”的一些认识](http://www.zhangxinxu.com/wordpress/2010/01/%E5%AF%B9overflow%E4%B8%8Ezoom%E6%B8%85%E9%99%A4%E6%B5%AE%E5%8A%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E8%AE%A4%E8%AF%86/)

通用的清楚浮动的方法，在浮动元素的父元素上添加类：clearfix

```css
.clearfix:after {
    content:"020";
    display:block;
    height:0;
    clear:both;
    visibility:hidden
}
.clearfix {
    zoom:1
}
```

### 其他

- IE6 CSS高度height:100% 无效
- [IE6 和 IE7 下 margin-bottom 失效](http://blog.csdn.net/ximenxiafeng/article/details/8871158)
- IE6 不支持 png24 的透明图片，要用 png8
