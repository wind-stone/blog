# meta 标签

## theme-color 设置浏览器导航栏背景颜色

```html
<meta name="theme-color" content="#ff6633">
```

## charset 设置文档编码方式

```html
<meta charset="UTF-8">
```

添加了`charset`属性的`meta`标签无需再有`name`和`content`。`charset`属性描述了 HTML 文档自身的编码形式。因此，建议将这个标签放在`head`的第一个。这样，浏览器读到这个标签之前，处理的所有字符都是 ASCII 字符，众所周知，ASCII 字符是 UTF-8 和绝大多数字符编码的子集，所以，在读到`meta`之前，浏览器把文档理解多数编码格式都不会出错，这样可以最大限度地保证不出现乱码。

一般情况下，HTTP 服务端会通过 HTTP 头来指定正确的编码方式，但是有些特殊的情况如使用`file`协议打开一个 HTML 文件，则没有 HTTP 头，这种时候，`charset`的`meta`就非常重要了。
