# uni-app

[[toc]]

## uni-app 学习记录

PS: 本人熟悉 h5 和 Vue.js 开发，不熟悉小程序和 uni-app 开发，因此如下的记录

### 为什么在 uni-app 的项目里可以直接使用 HTML 标签

出于降低 h5 应用向 uni-app 迁移成本的考虑，写成`div`、`span`也可以运行在 app 和小程序上，因为 uni-app 编译器会在编译时会把这些 HTML 标签编译为小程序标签。但不推荐这种用法，因为这样调试 H5 端时容易混乱。此外，仍然建议养成新习惯，使用 uni-app 的标签。

| HTML 标签                                              | uni-app 标签 | 转换说明                    |
| ------------------------------------------------------ | ------------ | --------------------------- |
| div/ul/li                                              | view         | -                           |
| span/font                                              | text         | -                           |
| a                                                      | navigator    | -                           |
| img                                                    | image        | -                           |
| select                                                 | picker       | -                           |
| iframe                                                 | web-view     | -                           |
| input                                                  | 没变化       | type 属性改成了 confirmtype |
| audio                                                  | 没变化       | 不再推荐使用，改成 API 方式 |
| form/button/checkbox/radio/label/textarea/canvas/video | 没变化       | -                           |

参考: [白话uni-app 【也是html、vue、小程序的区别】](https://ask.dcloud.net.cn/article/id-35657)

### 原生微信小程序与 uni-app 里组件生命周期的对象关系

#### App 级

原生微信小程序`App.onLaunch`触发之后，开始触发 uni-app 组件的`mounted`和`onLaunch`。

#### Page、Component 级

uni-app 里，不管是页面实例还是组件实例，最终都是使用的原生微信小程序的 Component 构造器来创建实例的。

传给构造器的`PageOrComponentOptions`选项的如下生命周期被调用时，会触发`$vm`上对应的钩子和操作。

- 原生微信小程序的`PageOrComponentOptions.lifetimes.attached`里时会初始化创建该组件对应的 Vue 实例`$vm`，随之调用`$vm.$mount()`方法。
- 原生微信小程序的`PageOrComponentOptions.lifetimes.ready`里触发`$vm.mounted`和`$vm.onReady`钩子。
- 原生微信小程序的`PageOrComponentOptions.lifetimes.detached`里调用`$vm.$destroy()`方法。

- 原生微信小程序的`PageOrComponentOptions.pageLifetimes.show`里触发`$vm.onPageShow`钩子。
- 原生微信小程序的`PageOrComponentOptions.pageLifetimes.hide`里触发`$vm.onPageHide`钩子。
- 原生微信小程序的`PageOrComponentOptions.pageLifetimes.resize`里触发`$vm.onPageResize`钩子。

##### Page

针对页面组件，在 uni-app 里最终也是使用原生小程序的 Component 构造器来创建页面实例的。

且页面实例的生命周期触发时，会调用`PageOptions.methods.xxx`方法，进而调用了页面实例对应的 Vue 实例的`$vm.xxx`钩子。具体的钩子如下：

- 原生微信小程序的`PageOptions.methods.onShow`里触发`$vm.onShow`
- 原生微信小程序的`PageOptions.methods.onLoad`里触发`$vm.onLoad`
- 原生微信小程序的`PageOptions.methods.onHide`里触发`$vm.onHide`
- 原生微信小程序的`PageOptions.methods.onUnload`里触发`$vm.onUnload`
- 原生微信小程序的`PageOptions.methods.onPullDownRefresh`里触发`$vm.onPullDownRefresh`
- 原生微信小程序的`PageOptions.methods.onReachBottom`里触发`$vm.onReachBottom`
- 原生微信小程序的`PageOptions.methods.onShareAppMessage`里触发`$vm.onShareAppMessage`
- 原生微信小程序的`PageOptions.methods.onShareTimeline`里触发`$vm.onShareTimeline`
- 原生微信小程序的`PageOptions.methods.onPageScroll`里触发`$vm.onPageScroll`
- 原生微信小程序的`PageOptions.methods.onResize`里触发`$vm.onResize`
- 原生微信小程序的`PageOptions.methods.onTabItemTap`里触发`$vm.onTabItemTap`

PS: 实际上，原生微信小程序里，Page 构造器是 Component 构造器的简化版本。（微信官方文档没有明确这么说，但是官方技术专员在[回答问题时有提到](https://developers.weixin.qq.com/community/develop/doc/000e48667d80001b7ebad1c0d56c00?highLine=component%2520%25E6%259E%2584%25E5%25BB%25BA%25E9%25A1%25B5%25E9%259D%25A2)，在一篇[官方的技术文章](https://developers.weixin.qq.com/community/develop/article/doc/0000a8d54acaf0c962e820a1a5e413)里也有提到）

### uni-app 之 Webpack 打包

Webpack 打包 uni-app 代码时，会将页面组件作为一个`entry chunk`，加载`entry chunk`之后会立即执行入口`module`；页面组件里引用的自定义组件会作为异步`chunk`；且不管是页面组件的`entry chunk`还是自定义组件的异步`chunk`，都会为`chunk`生成一个单独的文件，即与`comp.wxss`、`comp.json`、`comp.wxml`平级的`comp.js`文件。

常规情况下，Webpack 产生的异步`chunk`只是将`chunk`和`module`添加到全局，但是不会立即调用其中的`module`，而是等待外部主动调用。

但是，小程序里加载自定义组件的`comp.js`文件后，是需要立即执行`Component(options)`之类的代码来初始化组件的。因此，uni-app 在打包时，自定义组件对应的异步`chunk`里添加一段自执行的代码：

```js
// comp.js
require('../../../../common/vendor.js');

// 组件的异步 chunk
(global.webpackJsonp = global.webpackJsonp || []).push([
    ['pages/comp/comp/index'],
    {
        '7dd2': function(e, n, a) {},
        '9c1f': function(e, n, a) {
            'use strict';
            a.r(n);
            var t = a('41fe'),
                o = (a('a100'), a('f0c5')),
                p = Object(o.a)(
                    t.a,
                    function() {
                        var e = this.$createElement;
                        this._self._c;
                    },
                    [],
                    !1,
                    null,
                    '74eb',
                    null,
                    !1,
                    undefined,
                    undefined
                );
            n.default = p.exports;
        },
        a100: function(e, n, a) {
            'use strict';
            var t = a('7dd2');
            a.n(t).a;
        },
    },
]);

// 这段是针对小程序增加的自执行的代码，实现的源码可参考：https://github.com/dcloudio/uni-app/blob/f3b901ce37bcb3977efc3c3f04956cce80824f66/packages/webpack-uni-mp-loader/lib/plugin/generate-component.js#L111
(global['webpackJsonp'] = global['webpackJsonp'] || []).push([
    ['145'],
    {
        a145: function(module, exports, __webpack_require__) {
            __webpack_require__('543d')['createComponent'](
                __webpack_require__('9c1f')
            );
        },
    },
    // 区别在第三个参数，传入的话，会立即执行 module
    [['a145']],
]);
```

## 踩过的坑

### 父子组件销毁顺序

在 Vue 里，父子组件的销毁顺序是：

父组件 beforeDestroy -> 子组件 beforeDestroy -> 子组件 destroyed -> 父组件 destroyed

但是，经过测试`uni-app`里组件的销毁顺序如下：

子组件 beforeDestroy  ->  子组件 destroyed -> 父组件 beforeDestroy  -> 父组件 destroyed

猜测：小程序组件生命周期里，与组件销毁相关的钩子只有`detached`，可能是这个原因导致的。

若是子组件先`detached`、父组件后`detached`，因此没办法做到跟 Vue 一样的销毁顺序？

### 列表循环里的 key 不生效

[列表循环里的 key 不生效](./v-for-key.md)
