# CSRF

CSRF（Cross-site request forgery）跨站请求伪造，也被称为“One Click Attack”或者“Session Riding”，通常缩写为 CSRF 或者 XSRF，是一种对网站的恶意利用。尽管听起来像跨站脚本（XSS），但它与XSS非常不同，XSS 利用站点内的信任用户，而 CSRF 则通过伪装来自受信任用户的请求来利用受信任的网站。与 XSS 攻击相比，CSRF 攻击往往不大流行（因此对其进行防范的资源也相当稀少）和难以防范，所以被认为比 XSS 更具危险性。

CSRF 有两个关键点：

- 跨站点的请求：从字面上看，跨站点请求的来源是其他站点，比如，目标网站的删除文章功能接收到来自恶意网站客户端（JavaScript、Flash、HTML等）发出的删除文章请求，这个请求就是跨站点的请求，目标网站应该区分请求来源。字面上的定义总是狭义的，这样恶意的请求也有可能来自本站。
- 请求是伪造的：伪造的定义很模糊，一般情况下，我们可以认为：如果请求的发出不是用户的意愿，那么这个请求就是伪造的。而对于 XSS 来说，发起的任何请求实际上都是目标网站同域内发出的，此时已经没有同源策略的限制，虽然这样，我们同样认为这些请求也是伪造的，因为它们不是用户的意愿。

## 示例

目标网站 A：`www.a.com`
恶意网站 B：`www.b.com`

两个域不一样，目标网站 A 上有一个删除文章的功能，通常是用户单击“删除链接”时才会删除指定的文章，这个链接是`www.a.com/blog/del?id=1`，id 号代表不同的文章。

我们知道，这样删除文章实际上就是发出一个 GET 请求，那么如果目标网站 A 上存在一个 XSS 漏洞，执行的 JS 脚本无同源策略限制，就可以按下面的方式来删除文章。

- 使用 AJAX 发出 GET 请求，请求值是 id = 1，请求目标地址是`www.a.com/blog/del`
- 或者动态创建一个标签对象（如 img、iframe、script）等，将它们的 src 指向这个链接`www.a.com/blog/del?id=1`，发出的也是 GET 请求
- 然后欺骗用户访问存在 XSS 脚本的漏洞页面（在目标网站 A 上），则攻击发生

上述是通过 XSS 漏洞使得 JS 脚本在没有同源策略限制的情况下执行的，即请求时会自动带上会话（Cookie等）。

如果不用这种方式，或者目标网站 A 根本不存在 XSS 漏洞，还可以如何删除文章？看看 CSRF 的思路，步骤如下：

- 在恶意网站 B 上编写一个 CSRF 页面（`www.b.com/csrf.html`），想想有什么办法可以发出一个 GET 请求到目标网站 A 上？
  - 利用 AJAX 跨域时带上目标域的会话
  - 更简单的：用代码`<img src="http://www.a.com/blog/del?id=1">`
- 然后欺骗已经登录目标网站 A 的用户访问`www.b.com/csrf.html`页面，则攻击发生

这个攻击过程有三个关键点：

- 跨域发出了一个 GET 请求
- 可以无 JavaScript 参与
- 请求是身份认证后的

### 跨域发出了一个 GET 请求

同源策略是用来限制客户端脚本的跨域请求行为，但实际上由客户端 HTML 标签等发出的跨域 GET 请求被认为是合法的，不在同源策略的限制中，但是这个请求发出后并没有能力得到目标页面响应的数据内容。

很多网站其实都需要这样的功能，比如，嵌入第三方资源：图片、JS 脚本，CSS 样式、框架内容，尤其是很多开放的 Web 2.0 网站有个 mashup 应用聚合概念，如 Google 的 Gadgets 或者 SNS 社区中的第三方 Web 应用于 Web 游戏，通过 iframe 嵌入第三方扩展应用，如果将这样的 GET 请求限制住，那么 Web 世界就过于封闭了。

安全风险总是出现在正常的流程中，现在我们发出的是一个删除文章的 GET 请求，对于合法的跨域请求，浏览器会放行。

### 可以无 JavaScript 参与

CSRF 这个过程与 XSS 不一样，可以不需要 JavaScript 参与，当然也可以有 JavaScript 参与，比如在`www.b.com/csrf.html`中使用 JavaScript 动态生成一个 img 对象：

```html
<script>
  new Image().src = 'http://www.a.com/blog/del?id=1'
</script>
```

同样可以达到攻击效果。需要特别注意的是：这里并不是 JavaScript 跨域操作目标网站 A 的数据，而是间接生成了 img 对象，由 img 对象发起一个合法的跨域 GET 请求而已，这个过程和上面直接用一个 img 标签一样。

### 请求是身份认证后的

这一点非常关键，跨域发出的请求类似这样：

```request
GET /blog/del?id=1 HTTP/1.1
Host: www.a.com
User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:5.0) Gecko/20100101 Firefox/5.0
Connection: keep-alive
Referer: http://www.b.com/csrf.html
Cookie:sid=0951abe6d508dab60357804519a61b999;JSESSIONID=abcTePo2Ori_k-pWt5net;
```

而如果是目标网站 A，用户自己单击删除链接时发出的请求类似这样：

```request
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

## CSRF 攻击类型

按照请求类型区分，上面介绍的这个场景中其实已经提到，GET 型与 POST 型的 CSRF 攻击。

若按照攻击方式分类，CSRF 可分为：

- HTML CSRF 攻击
- JSON HiJacking 攻击
- Flash CSRF 攻击
等等

### HTML CSRF 攻击

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

## 危害

- 篡改目标网站上的用户数据
- 盗取用户隐私数据
- 作为其他攻击向量的辅助攻击手段
- 传播 CSRF 蠕虫

## 如何防御 CSRF 攻击？

### CSRF Token

CSRF Token 是一个随机、不可预测的字符串，由服务器（在生成登录态时）生成并发送给客户端（通常是前端页面），客户端在后续向服务器发送敏感请求时，需要将这个 Token 一并发送给服务器，服务器会对该 Token 进行验证，只有验证通过的请求才会被处理。

CSRF Token 防御 CSRF 攻击的具体过程：

（1）Token 的生成与下发

当用户登录目标网站后，服务器会为该用户的本次会话生成一个唯一的、随机的 CSRF Token。这个 Token 通常具有足够的随机性和复杂性，使得攻击者难以猜测。

服务器会将这个 Token 以某种方式传递给客户端，常见的传递方式有以下两种：

- ​​嵌入页面元素​​：将 Token 放在 HTML 页面的`<meta>`标签中，例如：

```html
<meta name="csrf-token" content="your-random-token-value">
```

- ​​通过接口返回​​：在用户登录或页面加载时，服务器通过接口将 Token 作为响应数据返回给前端，前端 JavaScript 代码可以获取并保存这个 Token。

（2）Token 的携带与发送

当客户端（前端）需要向服务器发送敏感请求（如 POST、PUT、DELETE 等可能修改服务器数据的请求）时，需要将 CSRF Token 一并发送给服务器。常见的携带方式有：

​- ​请求头​​：前端可以在请求头中添加一个自定义的字段（如 X-CSRF-Token）来携带 Token。例如，使用 Axios 发送请求时，可以通过请求拦截器添加 Token：

```js
axios.interceptors.request.use(config => {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    if (token) {
        config.headers['X-CSRF-Token'] = token;
    }
    return config;
});
```

- ​​请求参数​​：也可以将 Token 作为请求参数添加到 URL 或请求体中，不过这种方式相对不太安全，因为 URL 可能会被记录在浏览器历史记录或服务器日志中。

（3）Token 的验证

服务器在接收到客户端的请求后，会从请求头、请求参数等指定位置获取客户端发送过来的 CSRF Token。服务器会将这个 Token 与之前为该用户会话生成的 Token 进行比对：

- ​​验证通过​​：如果两者一致，说明该请求是来自合法的用户页面，服务器会正常处理该请求。
- ​​验证失败​​：如果两者不一致，或者客户端没有携带 Token，服务器会拒绝该请求，并返回相应的错误信息，例如 403 Forbidden 状态码，表示请求被禁止。

CSRF Token 防御攻击的关键原因

- ​​Token 的随机性和不可预测性​​：攻击者无法通过恶意网站预测或获取到目标网站为特定用户生成的 CSRF Token。因为 Token 是在服务器端随机生成的，并且只在服务器和合法用户的浏览器之间传递，攻击者无法通过正常的 HTTP 请求获取到这个 Token。
- ​​Token 的本地性​​：CSRF Token 通常存储在用户的浏览器会话中，并且与特定的用户会话相关联。攻击者诱导用户访问的恶意网站无法直接访问该用户的合法会话中的 Token，也就无法在恶意请求中携带正确的 Token。
- ​​服务器的严格验证​​：服务器会对每个敏感请求进行严格的 Token 验证，只有携带正确 Token 的请求才会被处理。这就确保了即使攻击者能够诱导用户发起请求，由于请求中不包含正确的 Token，服务器也会拒绝该请求，从而避免了 CSRF 攻击的发生。

综上所述，CSRF Token 通过生成、下发、携带和验证等一系列机制，有效地防止了攻击者利用用户的已登录状态发起恶意请求，保护了用户和网站的安全。

### 检查请求的 Referer/Origin 头

后端可以校验请求头中的 Referer 或 Origin 字段，确保请求来自合法的源（比如只允许来自 <<https://your-frontend.com的请求）。>

但这种方法并不完全可靠，因为某些浏览器或隐私模式下可能不发送 Referer，且容易被伪造（需结合其它方案）。

### 关键操作使用 POST/表单提交，避免 GET 请求执行敏感操作

​​GET 请求容易被滥用​​（比如通过`<img src="...">`、`<a href="...">`触发），不应在 GET 请求中执行如删除、转账等敏感操作。

敏感操作一定要用 ​​POST/PUT/DELETE​​，并且配合 CSRF Token 校验。

### 使用 SameSite Cookie 属性（现代浏览器支持）

在设置 Cookie 时，可以指定 SameSite属性，限制 Cookie 在跨站请求时不被发送。

常见取值：

- Strict：完全禁止第三方 Cookie（严格模式，任何跨站请求都不带 Cookie）
- Lax（推荐）：允许部分安全的跨站请求（如导航跳转 GET 请求）携带 Cookie，但阻止大部分恶意跨站 POST 请求
- None：允许跨站发送 Cookie（必须同时设置 Secure，即仅 HTTPS）

🔒 ​​推荐做法：将身份认证相关的 Cookie 设置为 SameSite=Lax 或 SameSite=Strict，能有效防御大部分 XSRF 攻击。​

示例（后端设置 Cookie 时）：

```http
Set-Cookie: sessionId=abc123; SameSite=Lax; Secure; HttpOnly
```
