---
sidebarDepth: 0
---

# PWA

[[toc]]

## cache API

- 只对应单个站点的域，并非所有的域公用
- 会一直持久存在，直到你告诉它不再存储，开发者拥有全部的控制权

## 各个阶段

### register

```js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
            .then(function (registration) {

                // 注册成功
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function (err) {

                // 注册失败:(
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
```

### install

```js
// 监听 service worker 的 install 事件
this.addEventListener('install', function (event) {
    // 如果监听到了 service worker 已经安装成功的话，就会调用 event.waitUntil 回调函数
    event.waitUntil(
        // 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间。
        caches.open('my-test-cache-v1').then(function (cache) {
            // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
            return cache.addAll([
                '/',
                '/index.html',
                '/main.css',
                '/main.js',
                '/image.jpg'
            ]);
        })
    );
});
```

监听到`install`事件，表示 Service Worker 正在安装，

#### event.waitUntil(promise)

`promise`执行完毕并`resolved`，Service Worker 安装完成。若`promise`被`rejected`，Service Worker 安装失败。

#### 静态资源缓存

通过监听 Service Worker 的`install`事件，并在其中调用`cache.addAll([])`方法，可以进行静态资源的缓存。

#### 动态资源缓存

通过`fetch`事件处理回调来代理页面请求，从而实现动态资源缓存。

```js
this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // 来来来，代理可以搞一些代理的事情

            // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
            if (response) {
                return response;
            }

            // 如果 service worker 没有返回，那就得直接请求真实远程服务
            var request = event.request.clone(); // 把原始请求拷过来
            return fetch(request).then(function (httpRes) {

                // http请求的返回已被抓到，可以处置了。

                // 请求失败了，直接返回失败的结果就好了。。
                if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }

                // 请求成功的话，将请求缓存起来。
                var responseClone = httpRes.clone();
                caches.open('my-test-cache-v1').then(function (cache) {
                    cache.put(event.request, responseClone);
                });

                return httpRes;
            });
        })
    );
});
```

#### 静态资源缓存 VS 动态资源缓存

静态资源缓存

- 优点
  - 第二次访问即可离线
- 缺点
  - 需要将需要缓存的 URL 在编译时插入到脚本中，增加代码量和降低可维护性

动态资源缓存

- 优点
  - 无需更改编译过程，也不会产生额外的流量
- 缺点
  - 需要多一次访问才能离线可用

除了静态的页面和文件之外，如果对 Ajax 数据加以适当的缓存可以实现真正的离线可用， 要达到这一步可能需要对既有的 Web App 进行一些重构以分离数据和模板。

### activate

Service Worker 安装成功之后，会接收到一个激活事件（activate event）。
（激活事件的处理函数中，主要操作是清理旧版本的 Service Worker 脚本中使用资源。）

激活成功后 Service Worker 可以控制页面了，但是只针对在成功注册了 Service Worker 后打开的页面。也就是说，页面打开时有没有 Service Worker，决定了接下来页面的生命周期内受不受 Service Worker 控制。所以，只有当页面刷新后，之前不受 Service Worker 控制的页面才有可能被控制起来。
