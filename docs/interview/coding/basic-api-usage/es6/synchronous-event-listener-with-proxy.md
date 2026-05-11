# 考察 Proxy 应用：以同步的方式实现事件监听

## 题目描述

```html
<html>
    <head></head>
    <body>
        <button class="sync-button">按钮</button>
        <script>
            const getElement = () => {
                // 实现该方法，最终效果为：点击一次按钮，打印一次结果。
            }

            (async () => {
                const btn = getElement('.sync-button');
                while(1) {
                    await btn.waitClick;
                    console.log('click!');
                }
            })();
        </script>
    </body>
</html>
```

## 实现效果

<interview-javascript-coding-basic-api-usage-es6-synchronous-event-listener-with-proxy></interview-javascript-coding-basic-api-usage-es6-synchronous-event-listener-with-proxy>

请打开控制台 Console 面板，点击按钮，查看效果。

## 实现代码

@[code vue](@components/interview/javascript/coding/basic-api-usage/es6/synchronous-event-listener-with-proxy.vue)
