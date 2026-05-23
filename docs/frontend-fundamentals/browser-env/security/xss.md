# XSS

跨站脚本（Cross Site Scripting），为不和层叠样式表（Cascading Style Sheets, CSS）的缩写混淆，故将跨站脚本缩写为 XSS。

XSS，发生在目标网站中目标用户的浏览器层面上，当用户浏览器渲染整个 HTML 文档的过程中出现了不被预期的脚本指令并执行时，XSS 攻击就会发生。而这段不被预期的脚本，一般是恶意攻击者往 WEB 页面里插入的恶意 Script 代码。

通俗地可以将 XSS 总结为：想尽一切方法将恶意的基本内容在目标网站中目标用户的浏览器上解析执行。

## XSS 分类

XSS 有三类：

- 反射型 XSS（非持久型 XSS）
- 存储型 XSS（持久型 XSS）
- DOM XSS

### 反射型 XSS

发出请求时，XSS 代码出现在 URL 中，作为输入提交到服务端，服务端解析后响应，在响应内容中出现这段 XSS 代码，最后浏览器解析执行。这个过程就像是一次反射，故称为反射型 XSS。

示例一，`http://www.foo.com/xss/reflect1.php`的代码如下：

```php
<?php
  echo $_GET['x'];
?>
```

输入`x`的值未经任何过滤就直接输出，我们可以提交：`http://www.foo.com/xss/reflect1.php?x=<script>alert(1)</script>`，服务端解析时，`echo`就会完整地输出`<script>alert(1)</script>`到响应体中，然后浏览器解析执行触发。

示例二，`http://www.foo.com/xss/reflect2.php`的代码如下：

```php
<?php
  header('Location: '.$_GET['x']);
?>
```

输入`x`的值作为响应头部的 Location 字段值输出，意味着会发生跳转，触发 XSS 的其中一种方式如下：
`http://www.foo.com/xss/reflect2.php?x=data:text/html;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pPC9zY3JpcHQ%2b`，跳转到`data:`协议上，`text/html`是 MIME 或`Content-Type`，表明文档类型，`base64`是指后面字符串的编码方式，后面这段`base64`解码后的值为：
`<script>alert(document.domain)</script>`，于是，当发生跳转时，就会执行这段 JS。

### 存储型 XSS

存储型 XSS 和 反射型 XSS 的区别仅在于：提交的 XSS 代码会存储在服务端（不管是数据库、内存还是文件系统等），下次请求目标页面时不用再提交 XSS 代码。

最典型的例子是留言板 XSS，用户提交一条包含 XSS 代码的留言存储到数据库，目标用户查看留言板时，那些留言的内容会从数据库查询出来并显示，浏览器发现有 XSS 代码，就当做正常的 HTML 与 JS 解析执行，于是就触发了 XSS 攻击。

存储型 XSS 的攻击是最隐蔽的。

### DOM XSS

与反射型 XSS、存储型 XSS 的差别在于，DOM XSS 的 XSS 代码并不需要服务器解析响应的直接参与，触发 XSS 靠的就是浏览器端的 DOM 解析，可以认为完全是客户端的事情。

如`http://www.foo.com/xssme.html`页面里有如下代码：

```html
<script>
  eval(location.hash.substr(1))
</script>
```

触发 XSS 方式为：`http://www.foo.com/xssme.html#alert(1)`

这个 URL # 后的内容是不会发送到服务端的，仅仅是在客户端被接收并解析执行。

针对于 DOM XSS，常见的输入点有：

- document.URL
- document.URLUnencoded
- document.location（以及 location 的多个属性）
- document.referrer
- window.location（以及 location 的多个属性）
- window.name
- xhr 请求回来的数据
- document.cookie
- 表单项的值

除了这些输入点，还有可能是用户请求的 HTML 在传输回来时被路由器或者运营商劫持并插入了一段脚本。

常见的输出点有：

- 直接输出 HTML 内容，如
  - document.write(...)
  - document.writeln(...)
  - document.body.innerHTML = ...
- 直接修改 DOM 树（包括 DHTML 事件），如
  - document.form[0].action = ...（以及其他集合，如：一些对象的 src/href 属性等）
  - document.attachEvent(...)
  - document.create(...)
  - document.execCommand(...)
  - document.body.xxx （直接通过 body 对象访问 DOM）
  - window.attachEvent(...)
- 替换 document URL，如
  - document.location = ...（以及直接赋值给 location 的 href、host、hostname 属性）
  - document.location.hostname = ...
  - document.location.replace(...)
  - document.location.assign(...)
  - document.URL = ...
  - window.navigate(...)
- 打开或修改新窗口，如
  - document.open(...)
  - window.open(...)
  - window.location.href = ...（以及直接赋值给 location 的 href、host、hostname 属性）
- 直接执行脚本，如
  - eval(...)
  - window.execScript(...)
  - window.setInterval(...)
  - window.setTimeout(...)

这些都是 JavaScript 的基本点，从这些输入/输出点我们可以看到，DOM XSS 的处理逻辑就在客户端。

### 防范措施

- 不要引入任何不可信的第三方 JavaScript 到页面里
- 不要往 HTML 页面里插入任何不可信数据，如果一定要往 HTML 页面插入数据，一定要：
  - 插入到 HTML 标签之间的数据，要进行 HTML Entity 编码
  - 插入到 HTML 属性里的数据，要进行 HTML 属性编码
  - 插入到 SCRIPT 里的数据，要进行 SCRIPT 编码
  - 插入到 STYLE 属性里的数据，要进行 CSS 编码
  - 插入到 HTML URL 里的数据，要进行 URL 编码
- 使用富文本时，使用 XSS 规则引擎进行编码过滤

Reference: [防御 XSS 攻击的七条原则](http://blog.jobbole.com/47372/)
