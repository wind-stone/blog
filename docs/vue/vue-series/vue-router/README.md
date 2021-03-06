# vue-router 原理

[[toc]]

## history 变化机制

导致历史记录变化的方式，主要有两种：

- 修改 location.hash
- history.pushState/popState 等

以下以修改 location.hash 导致历史记录变化为例，详细说明历史记录栈的变化情况

### 新增历史记录

- 修改 location.hash 属性会更新显示在地址栏中的 URL，同时会在浏览器的历史记录栈中添加一条记录
- 修改 location.hash，浏览器只会滚动到页面相应位置，不会重新加载网页

### 历史记录不变的情况

- 刷新页面不会产生新的一条历史记录
- 刷新页面不会更改已有的历史记录栈（不管是当前页面之前还是之后的历史记录点），
- 点击回退和前进按钮或者调用 history 的 back、forward、go方法产生的后退、前进操作，不会更改历史记录栈，只会影响当面页面呈现哪一条历史记录

### 历史记录栈的更改

如果当前页面呈现的历史记录点不是历史记录栈里最后一条历史记录，则在新增历史记录时，会先销毁该历史记录点之后的历史记录，再新增一条历史记录。示例如下：

- 假设现有历史记录栈为： #1 -> #2 -> #3 -> #4，当前在 #4，此刻 history.length = 4
- 回退一次到 #3 ，此刻 history.length = 4（即回退时历史记录不会更改）
- 再回退一次到 #2 ，此刻 history.length = 4（即回退时历史记录不会更改）
- 再回退一次到 #1 ，此刻 history.length = 4（即回退时历史记录不会更改）
- 再前进一次到 #2 ，此刻 history.length = 4（即前进时历史记录不会更改）
- 可以直接修改地址栏里的 url，修改 hash 为 #5，此刻历史记录将变为：#1 -> #2 -> #5，且 history.length = 3。这说明在 #2 添加一条新的历史记录时，原先历史记录里位于 #2 之后的 #3、#4 都会被删除，并会在 #2 之后添加新的历史记录 #5

### 历史记录栈的销毁

- 只有关闭页面才会销毁整个历史记录栈

## SPA（Single Page Web Application）

单页 Web 应用，就是只有一张 Web 页面的应用。SPA 是加载单个 HTML 页面并在用户与应用程序交互时动态更新该页面的 Web 应用程序。浏览器一开始会加载必需的HTML、CSS 和 JavaScript，所有的操作都在这张页面上完成，都由 JavaScript 来控制。因此，对单页应用来说模块化的开发和设计显得相当重要。

### 优点

- 避免了页面跳转（切换），就没有白屏阻塞，
- 因而提供了更加流畅的用户体验（让用户在web app感受native app的速度和流畅）
- 因而可以节省原生（Android和 iOS）APP 的开发成本（如果应用于移动端开发）
- 而且可以提高发布效率，无需每次安装更新包（如果应用于移动端开发）

### 缺点

- 效果和性能与原生还有较大差距
- 各版本浏览器兼容性不一致
- 业务随着代码量增加而增加，不利于首屏优化
- 不利于搜索引擎抓取

### url 路径里的 `#!`

由于我们在处理单页应用的时候页面是不刷新的，所以会导致我们的网页记录和内容很难被搜索引擎抓取到。搜索引擎抓取页面首先要遵循http协议，可是#不是协议内的内容。而实际上也是这样，我们没有见过搜索引擎的搜索结果中，哪一条记录可以快速定位到网页内的某个位置的。解决的方法是用 #!号代替#号，因为谷歌会抓取带有#!的URL。（Google规定，如果你希望Ajax生成的内容被浏览引擎读取，那么URL中可以使用”#!”(这种URL在一般页面一般不会产生定位效果)），这样我们可以解决ajax的不被搜索引擎抓取的问题。在vueJs里面，我们可以看到作者就是这样做的。

### SPA 实现原理

- 监听地址栏中 hash 变化驱动界面变化
- 用 pushstate 记录浏览器的历史，驱动界面变化
- 直接在界面用普通事件驱动界面变化

前两种方式较为普遍，因为它们的变化记录浏览器会保存在history中，可以通过回退/前进按钮找回，或者history对象中的方法控制。最后一种方法是用普通事件驱动的，没有改变浏览器的history对象，所以一旦用户按了返回按钮将会退到浏览器的主界面。所以，一般采用前两种方式。值得一提的是，在不支持hash监听和pushsate变化的浏览器中可以考虑用延时函数，不停得去监听浏览器地址栏中url发生的变化，从而驱动界面变化。

Reference

- [阮一峰-URL 的井号](http://www.ruanyifeng.com/blog/2011/03/url_hash.html)
- [搜索引擎会不会抓取带#号(哈希值)的URL](http://www.admin5.com/article/20130614/509297.shtml)

## 父子路由切换显示

### 需求说明

- 在一些后台管理页面，常常涉及到列表页和详情页，列表页和详情页看起来是独立的页面，没有相同的元素。
- 列表页包含查询条件和查询结果。查询条件可能有时间范围、关键字、下拉选择框等等条件，查询结果是以表格呈现的列表。
- 详情页是每一条查询结果的详细信息，点击列表页每一条查询结果的“详情”进入详情页。

需求是，经过复杂的查询条件查出结果，进入详情页后返回，可以复用那些查询条件，而不需要重新输入查询条件。

## 解决方法

1. 情况一，列表页和详情页是同级路由：由列表页进入详情页时，列表页会被销毁，导致从详情页返回到列表页时需要重新填写查询条件重新查询，费时费力。此时，如果在列表页和详情页这个 router-view 上添加 keep-alive，可以保证列表页和详情页在切换时不被销毁，但是问题是不同查询结果详情页面可能不一样，如果 keep-alive 了需要将不一样的地方删除，无法很好的解决问题。

2. （推荐方法）情况二，将详情页设置为列表页的子路由，父子路由都不添加 keep-alive。点击“详情”进入详情页子路由时，将列表页包含框隐藏掉，此时只显示详情页。返回时，列表页包含框显示，子路由自动销毁，如此可以保证查询条件等保持不变。

HMLT 如下所示。

```html
<div>
  <div v-show="showChildRouter" class="list-ctn"></div>
  <router-view></router-view>
</div>
```

## 异步路由-处理加载状态/加载失败

```js
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

> 注意如果你希望在 Vue Router 的路由组件中使用上述语法的话，你必须使用 Vue Router 2.4.0+ 版本。

尽管 Vue.js 官网已经声称 Vue Router 2.4.0+ 已经支持带有加载状态的异步路由，但是亲测在`vue-router` 3.0.2 及以前版本，都没有实现异步路由处理加载状态/加载失败的功能。但是通过 hack 的方式，可以实现这一功能。

```js
// router.js
function lazyLoadView(AsyncView) {
    const AsyncHandler = () => ({
        component: AsyncView,
        loading: LoadingComponent,
        error: ErrorComponent,
        delay: 200,
        timeout: 200
    });

    return Promise.resolve({
        functional: true,
        render(h) {
            return h(AsyncHandler);
        }
    });
}

const router = new Router({
    routes: [
         {
             path: '/video',
             name: ROUTER_NAME_VIDEO,
             component: () => lazyLoadView(import(/* webpackChunkName: 'video' */ './modules/Video'))
         }
    ]
});

export default router;
```
