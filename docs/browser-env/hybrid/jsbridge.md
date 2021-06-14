# JS Bridge

[[toc]]

通常企业级的 JS Bridge 库都会对 JS 和客户端的交互，做一层封装，以尽可能友好的方式供前端开发人员使用。

以快手 JS Bridge 库的`ksBridge.postVideo`为例，该方法是调用视频拍摄和发布功能，在视频上传过程中，会不断调用`success`回调。

```js
// 使用方式
import ksBridge from '@ks/ks-bridge';
ksBridge.postVideo({
    param: {
        topic: '主体',
        magicName: '模法表情名称',
        magicFaceId: '魔法表情 id'
    },
    success(ret) {
        // 客户端返回 result: 1 时调用
        console.log(JSON.stringify(ret));
    },
    fail(err) {
        // 客户端返回 result 非 1 时调用
    },
    complete() {
        // 无论客户端返回 result 是 1 还是非 1，都调用
    }
});
```

```js
// 客户端返回的结果
{
   result: 1, // 1 成功 0 用户取消
   data: {
      // ...
      "progress": "100",  // 上传进度
      // ...
   }
}
```

在 JS Bridge 库的底层实现中，无论是`success`、`fail`、`complete`回调，都是被合并在同一个`callback`函数里，并添加到全局的`window`对象上，客户端完成操作后会调用`window`上的`callback`方法并传入操作结果，`callback`方法里通过判断结果对象里的`result`字段，若是`1`则调用`success`，`非 1`则调用`fail`，最后不管`result`是啥值都会调用`complete`。

尤其需要注意的是，这个`callback`函数必须注册到全局`window`下，客户端才能调用到。

```js
ksBridge.postVideo = function (obj) {
    // 生成随机的回调方法
    const randowCallback = 'ks_bridge_callback_' + Math.random().toString(36).slice(2);
    window[randowCallback] = function (res) {
        if (res.result === 1) {
            obj.success && obj.success(res);
        } else {
            obj.fail && obj.fail(res);
        }
        obj.complete && obj.complete(res);
    }

    // 调用客户端方法（客户端通过 API 注入在 window 上）
    window.Kwai.postVideo({
        param: obj.param,
        callback: randowCallback
    })
}
```

## 可能存在的问题

### window 上绑定的方法消失导致的问题

针对上面的`postVideo`方法，因为在视频上传的过程中会不断调用`success`回调（实际上先调用`window`上的`callback`回调，再`callback`内部调用`success`回调），一旦绑定在`window`上的`callback`回调消失（比如刷新页面，老页面`window`销毁，客户端拿到的是新页面的`window`），则会找不到回调，页面就会报错：

- iOS：`TypeError: undefined is not a function`
- Android：`ReferenceError: kwai_bridge_callback_XXXX is not defined`

因此，在客户端调用回调时，要先判断`window`上的`callback`是否存在！

## JS Bridge 实现

[JSBridge的原理 - 掘金](https://juejin.im/post/5abca877f265da238155b6bc)
