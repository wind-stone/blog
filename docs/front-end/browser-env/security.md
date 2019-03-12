---
sidebarDepth: 0
---

# 安全

[[toc]]

## Cookie 安全

Cookie 是一个神奇的机制，同域内浏览器中发出的任何一个请求都会带上 Cookie，无论请求什么资源，请求时，Cookie 出现在请求头的 Cookie 字段中。（这一点可以造成 CSRF）

Ajax 跨域请求，默认情况下无法带上目标域的会话（Cookie 等），这是需要设置 xhr 实例的`withCredentials`属性为 `true`。


## XSS

跨站脚本（Cross Site Scripting），为不和层叠样式表（Cascading Style Sheets, CSS）的缩写混淆，故将跨站脚本缩写为 XSS。

XSS，发生在目标网站中目标用户的浏览器层面上，当用户浏览器渲染整个 HTML 文档的过程中出现了不被预期的脚本指令并执行时，XSS 攻击就会发生。而这段不被预期的脚本，一般是恶意攻击者往 WEB 页面里插入的恶意 Script 代码。

通俗地可以将 XSS 总结为：想尽一切方法将恶意的基本内容在目标网站中目标用户的浏览器上解析执行。

### XSS 分类

XSS 有三类：
- 反射型 XSS（非持久型 XSS）
- 存储型 XSS（持久型 XSS）
- DOM XSS

#### 反射型 XSS

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


#### 存储型 XSS

存储型 XSS 和 反射型 XSS 的区别仅在于：提交的 XSS 代码会存储在服务端（不管是数据库、内存还是文件系统等），下次请求目标页面时不用再提交 XSS 代码。

最典型的例子是留言板 XSS，用户提交一条包含 XSS 代码的留言存储到数据库，目标用户查看留言板时，那些留言的内容会从数据库查询出来并显示，浏览器发现有 XSS 代码，就当做正常的 HTML 与 JS 解析执行，于是就触发了 XSS 攻击。

存储型 XSS 的攻击是最隐蔽的。


#### DOM XSS

与反射型 XSS、存储型 XSS 的差别在于，DOM XSS 的 XSS 代码并不需要服务器解析响应的直接参与，触发 XSS 靠的就是浏览器端的 DOM 解析，可以认为完全是客户端的事情。

如`http://www.foo.com/xssme.html`页面里有如下代码：

```html
<script>
  eval(location.hash.substr(1))
</script>
```

触发 XSS 方式为：`http://www.foo.com/xssme.html#alert(1)`

这个 URL#后的内容是不会发送到服务端的，仅仅是在客户端被接收并解析执行。

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


## CSRF

CSRF（Cross-site request forgery）跨站请求伪造，也被称为“One Click Attack”或者“Session Riding”，通常缩写为 CSRF 或者 XSRF，是一种对网站的恶意利用。尽管听起来像跨站脚本（XSS），但它与XSS非常不同，XSS 利用站点内的信任用户，而 CSRF 则通过伪装来自受信任用户的请求来利用受信任的网站。与 XSS 攻击相比，CSRF 攻击往往不大流行（因此对其进行防范的资源也相当稀少）和难以防范，所以被认为比 XSS 更具危险性。

CSRF 有两个关键点：
- 跨站点的请求：从字面上看，跨站点请求的来源是其他站点，比如，目标网站的删除文章功能接收到来自恶意网站客户端（JavaScript、Flash、HTML等）发出的删除文章请求，这个请求就是跨站点的请求，目标网站应该区分请求来源。字面上的定义总是狭义的，这样恶意的请求也有可能来自本站。
- 请求是伪造的：伪造的定义很模糊，一般情况下，我们可以认为：如果请求的发出不是用户的意愿，那么这个请求就是伪造的。而对于 XSS 来说，发起的任何请求实际上都是目标网站同域内发出的，此时已经没有同源策略的限制，虽然这样，我们同样认为这些请求也是伪造的，因为它们不是用户的意愿。


### 示例

目标网站 A：`www.a.com`
恶意网站 B：`www.b.com`

两个域不一样，目标网站 A 上有一个删除文章的功能，通常是用户单击“删除链接”时才会删除指定的文章，这个链接是`www.a.com/blog/del?id=1`，id 号代表不同的文章。

我们知道，这样删除文章实际上就是发出一个 GET 请求，那么如果目标网站 A 上存在一个 XSS 漏洞，执行的 JS 脚本无同源策略限制，就可以按下面的方式来删除文章。

- 使用 AJAX 发出 GET 请求，请求值是 id = 1，请求目标地址是`www.a.com/blog/del`
- 或者动态创建一个标签对象（如 img、iframe、script）等，将它们的 src 指向这个链接`www.a.com/blog/del?id=1`，发出的也是 GET 请求
- 然后欺骗用户访问存在 XSS 脚本的漏洞页面（在目标网站 A 上），则攻击发生

上述是通过 XSS 漏洞使得 JS 脚本在没有同源策略限制的情况下执行的，即请求时会自动带上会话（Cookie等）。


如果不用这种方式，或者目标网站 A 根本不存在 XSS 漏洞，还可以如何删除文章？看看 CSRF 的思路，步骤如下：

- 在恶意网站 B 上编写一个 CSRF 页面（`www.b.com.csrf.html`），想想有什么办法可以发出一个 GET 请求到目标网站 A 上？
    - 利用 AJAX 跨域时带上目标域的会话
    - 更简单的：用代码`<img src="http://www.a.com/blog/del?id=1">`
- 然后欺骗已经登录目标网站 A 的用户访问`www.b.com/csrf.html`页面，则攻击发生

这个攻击过程有三个关键点：
- 跨域发出了一个 GET 请求
- 可以无 JavaScript 参与
- 请求是身份认证后的

#### 跨域发出了一个 GET 请求

同源策略是用来限制客户端脚本的跨域请求行为，但实际上由客户端 HTML 标签等发出的跨域 GET 请求被认为是合法的，不在同源策略的限制中，但是这个请求发出后并没有能力得到目标页面响应的数据内容。

很多网站其实都需要这样的功能，比如，嵌入第三方资源：图片、JS 脚本，CSS 样式、框架内容，尤其是很多开放的 Web 2.0 网站有个 mashup 应用聚合概念，如 Google 的 Gadgets 或者 SNS 社区中的第三方 Web 应用于 Web 游戏，通过 iframe 嵌入第三方扩展应用，如果将这样的 GET 请求限制住，那么 Web 世界就过于封闭了。

安全风险总是出现在正常的流程中，现在我们发出的是一个删除文章的 GET 请求，对于合法的跨域请求，浏览器会放行。


#### 可以无 JavaScript 参与

CSRF 这个过程与 XSS 不一样，可以不需要 JavaScript 参与，当然也可以有 JavaScript 参与，比如在`www.b.com/csrf.html`中使用 JavaScript 动态生成一个 img 对象：
```html
<script>
  new Image().src = 'http://www.a.com/blog/del?id=1'
</script>
```
同样可以达到攻击效果。需要特别注意的是：这里并不是 JavaScript 跨域操作目标网站 A 的数据，而是间接生成了 img 对象，由 img 对象发起一个合法的跨域 GET 请求而已，这个过程和上面直接用一个 img 标签一样。


#### 请求是身份认证后的

这一点非常关键，跨域发出的请求类似这样：
```
GET /blog/del?id=1 HTTP/1.1
Host: www.a.com
User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:5.0) Gecko/20100101 Firefox/5.0
Connection: keep-alive
Referer: http://www.b.com/csrf.html
Cookie:sid=0951abe6d508dab60357804519a61b999;JSESSIONID=abcTePo2Ori_k-pWt5net;
```

而如果是目标网站 A，用户自己单击删除链接时发出的请求类似这样：
```
GET /blog/del?id=1 HTTP/1.1
Host: www.a.com
User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:5.0) Gecko/20100101 Firefox/5.0
Connection: keep-alive
Referer: http://www.a.com/blog/
Cookie:sid=0951abe6d508dab60357804519a61b999;JSESSIONID=abcTePo2Ori_k-pWt5net;
```

可以看到这两个请求中，除了请求来源 Referer 值不一样外，其他都一样，尤其是这里的 Cookie 值，该 Cookie 是用户登录目标网站 A 后的身份认证标志。跨域发出的请求同样会带上目标网站 A 的用户 Cookie，这样的请求就是身份认证后的，攻击才会成功。

通过这个场景，我们知道了 CSRF 的过程，不过这个过程只介绍了 GET 请求的情况，那么 POST 请求呢？比如，目标网站 A 的“写文章”功能，这是一个表单提交的操作，会发起 POST 请求。同样，这个 POST 请求可以从恶意网站 B 中发出，通过 JavaScript 自动生成一份表单，表单的 action 地址指向目标网站 A 的“写文章”表单提交地址，表单的相关字段都准备好后，即可发出请求。下面看一段代码：

```js
function new_form() {
  var f = document.createElement('iframe')
  document.body.appendChild(f)
  f.method = 'post'
  return f
}

function create_elements(eForm, eName, eValue) {
  var e = document.createElement('input')
  eForm.appendChild(e)
  e.type = 'text'
  e.name = eName
  // 兼容浏览器的兼容设置，目的是让表单不可见
  if (!document.all) {
    e.style.display = 'none'
  } else {
    e.style.display = 'block'
    e.style.width = '0px'
    e.style.height = '0px'
  }
  e.value = eValue
  return e
}

var _f = new_form()
create_elements(_f, 'title', 'hi')
create_elements(_f, 'content', 'csrf_here')
_f.action = 'http://www.a.com/blog/add'
_f.submit()
```

构造完成，当目标网站 A 的用户被欺骗访问了恶意网站 B 的该页面时，一个跨域的伪造的 POST 表单请求就发出了。同样，这个请求带上了目标网站 A 的用户 Cookie


### CSRF 攻击类型

按照请求类型区分，上面介绍的这个场景中其实已经提到，GET 型与 POST 型的 CSRF 攻击。

若按照攻击方式分类，CSRF 可分为：
- HTML CSRF 攻击
- JSON HiJacking 攻击
- Flash CSRF 攻击
等等

#### HTML CSRF 攻击

发起的 CSRF 请求都属于 HTML 元素发出的，这一类是最普遍的 CSRF 攻击。如下这些 HTML 元素都可以发出 CSRF 请求。

HTML 中能够设置 src/href 等链接地址的标签都可以发起 GET 请求，如：

- `<link href="">`
- `<img src="">`
- `<img lowsrc="">`
- `<img dynsrc="">`
- `<meta http-equiv="refresh" content="0; url=">`
- `<iframe src="">`
- `<frame src="">`
- `<script src="">`
- `<bgsound src="">`
- `<embed src="">`
- `<video src="">`
- `<audio src="">`
- `<a href="">`
- `<table background="">`
- ...

CSS 样式中的：

- `@import ""`
- `background: url("")`
- ...

还有通过 JavaScript 动态生成的标签对象或 CSS 对象发起的 GET 请求，而发出 POST 请求只能通过 form 提交方式。


### JSON HiJacking 攻击
### Flash CSRF 攻击

请查看《Web前端黑客技术揭秘》相关章节


### 危害

- 篡改目标网站上的用户数据
- 盗取用户隐私数据
- 作为其他攻击向量的辅助攻击手段
- 传播 CSRF 蠕虫


## 界面操作劫持

界面操作劫持攻击是一种基于视觉欺骗的 Web 会话劫持攻击，它通过在网页的可见输入控件上覆盖一个不可见的框（iframe），使得用户误以为在操作可见控件，而实际上用户的操作行为被其不可见的框所劫持，执行不可见框中的恶意劫持代码，从而完成在用户不知情的情况下窃取敏感信息、篡改数据等攻击。

具体详情，请查看《Web前端黑客技术揭秘》第 5 章。

