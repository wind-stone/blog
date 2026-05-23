# SSE（Server-Sent Events）

SSE（Server-Sent Events，服务器推送事件）和 WebSocket 都是现代 Web 应用中实现实时通信的主流技术，但它们的底层原理和适用场景有着本质的区别。

## 📡 SSE 的工作原理

SSE 是一种基于标准 HTTP/HTTPS 协议的**单向流式传输技术**。它的核心能力是允许服务器持续向客户端推送数据，而无需客户端反复发起请求。

SSE 的工作流程非常直观：

1. **建立连接**：客户端通过原生的 `EventSource` 对象向服务器发起一个普通的 HTTP 请求，并在请求头中携带 `Accept: text/event-stream` 来标识需要流式数据。
2. **保持长连接**：服务器接收到请求后，会设置响应头（`Content-Type: text/event-stream`、`Cache-Control: no-cache`、`Connection: keep-alive`），从而建立一个不关闭的 HTTP 长连接。
3. **持续推送**：服务器可以随时通过这个长连接，以 `data: 内容\n\n` 的标准格式向客户端分片发送数据。客户端通过监听 `message` 事件，就能逐段接收并实时渲染（例如大模型对话时的“打字机效果”）。
4. **自动重连**：如果连接意外断开，浏览器会原生支持自动重连（默认间隔 3 秒），无需开发者编写额外的重连逻辑。

由于 SSE 完美契合了大模型“边推理、边输出”的场景，它能有效消除用户等待全量结果的延迟，同时大幅降低前后端的内存压力。

## ⚖️ SSE 与 WebSocket 的区别

WebSocket 是一种独立于 HTTP 的**全双工（双向）通信协议**。虽然两者都能实现服务器向客户端推送数据，但在通信方向、协议基础、实现复杂度等方面存在显著差异：

| 对比维度       | SSE (Server-Sent Events)                | WebSocket                                  |
| :------------- | :-------------------------------------- | :----------------------------------------- |
| **通信方向**   | **单向**（仅服务端 → 客户端）           | **全双工**（客户端 ↔ 服务端双向同时通信）  |
| **协议基础**   | 基于标准 HTTP 协议，属于 HTTP 扩展      | 独立的 `ws://` 或 `wss://` 协议            |
| **数据格式**   | 仅支持文本格式（如 JSON、纯文本）       | 支持文本和二进制数据（如图片、音视频流）   |
| **重连机制**   | 浏览器原生支持自动重连，零代码自愈      | 无原生重连，需手动编写断线重连逻辑         |
| **实现复杂度** | 极低，前后端基础 HTTP 代码即可实现      | 较高，需处理握手、心跳检测、帧解析等       |
| **适用场景**   | 实时通知、日志流、AI 逐字输出、任务进度 | 在线聊天、多人游戏、实时协同编辑、金融交易 |

### 💡 总结与选型建议

- 如果你的业务场景只需要**服务器单向推送数据**给客户端（例如：AI 大模型的流式回复、实时新闻推送、运维监控看板），**优先选择 SSE**。它更轻量、实现极其简单，且能很好地兼容现有的 HTTP 代理和网关。
- 如果你的业务场景需要**客户端和服务器频繁地双向实时交互**（例如：即时通讯聊天室、多人在线竞技游戏、协同文档编辑），**必须选择 WebSocket**，以满足低延迟和双向数据传输的需求。

## EventSource 和 fetch 的区别

在前端实现 SSE（服务器推送事件）时，原生的 `EventSource` 和 `fetch` 是两种截然不同的实现路径。它们的核心区别主要体现在**请求灵活性**、**功能完备性**以及**开发复杂度**这三个方面。

### 📊 核心区别对比

| 对比维度         | EventSource (原生 API)              | fetch (配合 ReadableStream)     |
| :--------------- | :---------------------------------- | :------------------------------ |
| **请求方式**     | 仅支持 GET 请求                     | 支持 GET、POST 等任意 HTTP 方法 |
| **自定义请求头** | 不支持（无法携带 Authorization 等） | 完全支持自定义 Header           |
| **自动重连**     | 浏览器原生内置，断线自动恢复        | 无，需开发者手动编写重试逻辑    |
| **数据解析**     | 自动解析 SSE 协议格式               | 需手动处理流式字节与协议解析    |
| **开发复杂度**   | 极低，开箱即用                      | 较高，需处理底层流和边界情况    |

### 💡 详细解析

**1. EventSource：简单但受限的“专用工具”**
`EventSource` 是 HTML5 专门为 SSE 设计的 API。它的最大优势是**极其简单**，你只需要提供一个 URL，浏览器就会自动处理连接、解析 `data:` 格式的数据，甚至在网络断开时自动重连。
但它的致命短板在于**不够灵活**：它只能发起简单的 GET 请求，且无法在请求头中携带自定义信息（比如用户登录后的 Token 认证）。这在很多需要鉴权的现代 Web 应用中是非常不方便的。

**2. fetch：灵活但繁琐的“底层管道”**
使用 `fetch` 发起 SSE 请求，本质上是利用其强大的网络请求能力，配合 `ReadableStream` 来读取服务器源源不断返回的流式数据。
它的最大优势是**绝对的控制权**：你可以像发普通 API 请求一样，使用 POST 方法发送用户数据，并在 Header 中轻松带上 `Authorization: Bearer token` 等认证信息。
但代价是**开发复杂度陡增**。你需要自己编写代码去处理底层的字节流拼接（防止中文或长文本被切成两半导致乱码）、手动识别 SSE 的 `\n\n` 消息边界，并且还要自己实现断线重连的逻辑。

### 🚀 总结与最佳实践建议

- **简单场景选 EventSource**：如果你的需求只是单向接收公开数据（比如实时股票行情、公共新闻推送），不需要携带 Token 也不需要发 POST 请求，直接用原生的 `EventSource` 最省心。
- **复杂场景别手撸 fetch**：在现代业务中（比如带用户鉴权的 AI 对话），我们既需要 `fetch` 的灵活性（POST + 自定义 Header），又不想处理繁琐的流式解析和重连逻辑。因此，**强烈建议直接使用成熟的第三方库（如微软开源的 [@microsoft/fetch-event-source](https://github.com/Azure/fetch-event-source)）**。它在底层帮你完美封装了 `fetch` 的流式处理细节，让你既能享受 `fetch` 的灵活，又能拥有像 `EventSource` 一样优雅的开发体验。

### 示例

#### EventSource 请求示例

```js
// 1. 创建 EventSource 实例并建立连接
const eventSource = new EventSource('/api/sse-events');

// 将 token 作为 query 参数传给后端
// const token = 'your_user_token_here';
// const eventSource = new EventSource(`/api/sse-events?token=${token}`);

// 跨域请求携带 Cookie
// const eventSource = new EventSource('/api/sse-events', {
//   withCredentials: true // 允许跨域携带凭证（Cookie）
// });

// 2. 监听连接成功
eventSource.onopen = () => {
    console.log('SSE 连接已建立');
};

// 3. 监听默认的 message 事件（服务器发送 data: xxx 时触发）
eventSource.onmessage = event => {
    console.log('收到服务器推送：', event.data);
};

// SSE 协议允许服务器发送带有特定 event 字段的消息，前端可以分别监听这些自定义事件：

// 监听服务器发送的 event: userUpdate 消息
// eventSource.addEventListener('userUpdate', (event) => {
//   const data = JSON.parse(event.data);
//   console.log('用户信息更新了：', data);
// });

// // 监听服务器发送的 event: systemNotify 消息
// eventSource.addEventListener('systemNotify', (event) => {
//   console.log('系统通知：', event.data);
// });

// 4. 监听连接错误（断线时会自动触发，浏览器会尝试自动重连）
eventSource.onerror = error => {
    console.error('SSE 连接发生错误：', error);
};

// 5. 手动关闭连接（比如在组件销毁或用户退出时）
eventSource.close();
```

#### fetch SSE 请求示例

```js
async function fetchSSE(url, options, onMessage) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) throw new Error(`HTTP 错误：${response.status}`);
    if (!response.body) throw new Error('响应体不可用');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = ''; // 用于缓存不完整的消息片段

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 将二进制数据解码为字符串，并拼接到缓冲区
        buffer += decoder.decode(value, { stream: true });
        // 按 SSE 的消息结束符 \n\n 进行分割
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // 将最后可能不完整的一段保留在缓冲区

        for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const dataStr = line.slice(5).trim(); // 去掉 'data:' 前缀
            if (dataStr) {
                // 触发消息回调，通常这里会是 JSON 数据
                onMessage(JSON.parse(dataStr));
            }
        }
    }
}

// 调用示例：发送 POST 请求并接收流式回复
fetchSSE(
    '/api/stream-chat',
    {
        method: 'POST',
        body: JSON.stringify({ userInput: '你好，请介绍一下你自己' }),
    },
    data => {
        console.log('收到流式数据：', data);
    }
);
```

#### @microsoft/fetch-event-source 请求示例

```js
import { fetchEventSource } from '@microsoft/fetch-event-source';

// 使用第三方库的简洁实现
await fetchEventSource('/api/stream-chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_TOKEN', // 轻松携带认证信息
    },
    body: JSON.stringify({ userInput: '你好' }),
    onmessage(event) {
        const data = JSON.parse(event.data);
        console.log('收到数据：', data);
    },
    onerror(err) {
        console.error('连接发生错误', err);
        // 可以在这里自定义重连逻辑
    },
});
```

## Fetch API 和 传统的 XHR 有什么区别？在处理 AI 流式输出时你会选择哪一个？

这是前端开发中一个很经典的技术选型点。

### Fetch API 与 XHR 的核心区别

简单来说，**Fetch 是 XHR 的现代化替代方案**，但并非在所有场景下都能完全替代。

| 特性            | XHR (XMLHttpRequest)                                            | Fetch API                                                                                                       |
| :-------------- | :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **API 设计**    | 基于事件回调 (`onreadystatechange`)，代码冗长，容易形成回调地狱 | 基于 Promise，支持 `async/await`，代码更简洁、可读性更强                                                        |
| **流式处理**    | 支持有限，早期浏览器实现不统一，处理流数据比较麻烦              | **原生支持** `ReadableStream`，可以边接收边处理数据，非常适合大文件或实时数据流                                 |
| **请求取消**    | 通过 `xhr.abort()` 直接取消，简单粗暴                           | 需要借助 `AbortController`，稍微多一步操作，但更灵活                                                            |
| **上传进度**    | **原生支持** `upload.onprogress` 事件，可以实时监听上传进度     | **不原生支持**，需要借助 `ReadableStream` 自己模拟，实现复杂且兼容性差                                          |
| **错误处理**    | 需要手动检查 `status` 码（如 `xhr.status === 200`）             | 只有网络错误（断网、DNS 失败）才会 `reject`，HTTP 错误（如 404、500）依然 `resolve`，需要手动检查 `response.ok` |
| **Cookie 携带** | 默认自动携带同源 Cookie                                         | 默认**不携带**，需要显式设置 `credentials: 'include'`                                                           |
| **兼容性**      | 兼容性极好，支持 IE10+                                          | 现代浏览器支持良好，但 IE 完全不支持，需要 polyfill                                                             |

### 处理 AI 流式输出时的选择

**我会毫不犹豫地选择 Fetch API + ReadableStream。**

原因非常明确：**AI 流式输出的核心需求，恰好是 Fetch 的强项，但却是 XHR 的短板。**

1. **流式处理是刚需**：AI 大模型（如 ChatGPT、通义千问）的回复是逐 token 生成的。我们需要**边接收边渲染**，而不是等全部生成完再一次性展示。`fetch` 的 `response.body.getReader()` 可以让我们拿到一个 `ReadableStream`，逐块读取数据，完美契合这个场景。

2. **控制力更强**：AI 对话中，用户随时可能**打断**（停止生成）。`AbortController` 可以让我们优雅地中断请求，而 XHR 的 `abort()` 虽然也能做到，但在 Promise 链中集成不如 Fetch 自然。

3. **代码更优雅**：AI 流式输出的处理逻辑本身就很复杂（处理半包、粘包、解析 JSON 块等）。用 `async/await` 配合 `while` 循环来读取流，代码结构远比 XHR 的回调嵌套清晰得多。

**实际代码示例（Fetch 处理 AI 流式输出）：**

```javascript
async function fetchAIStream(url, options, onChunk, onDone, onError) {
    const controller = new AbortController();

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                // 处理最后剩余的 buffer
                if (buffer) {
                    onChunk(buffer);
                }
                onDone();
                break;
            }

            // 解码并处理数据块
            buffer += decoder.decode(value, { stream: true });

            // 处理粘包：按行分割，解析完整的 JSON 块
            const parts = buffer.split('\n');
            while (parts.length > 1) {
                const chunk = parts.shift();
                if (chunk) {
                    onChunk(chunk); // 将每个完整的块传给回调
                }
            }
            buffer = parts[0]; // 剩余的不完整部分留到下次处理
        }
    } catch (err) {
        if (err.name === 'AbortError') {
            console.log('请求被用户中断');
        } else {
            onError(err);
        }
    }

    // 返回一个中断函数，供外部调用
    return () => controller.abort();
}
```

### 总结

- **通用场景**：优先用 Fetch，代码更现代、更简洁。
- **需要上传进度**：用 XHR（或基于 XHR 封装的库，如 axios）。
- **处理 AI 流式输出**：**必须用 Fetch**，因为它的 `ReadableStream` 是处理流式数据的原生利器，XHR 在这方面能力不足。

所以，对于你提到的 AI 流式输出场景，**Fetch API 是更优、更现代的选择**。

## fetch 接收到的 chunk，如何保证是有序的？

在使用 `fetch` 接收流式响应（比如 SSE 或大文件下载）时，**你完全不需要担心 chunk 的乱序问题，浏览器底层已经为你保证了绝对的顺序**。

### 🛡️ 为什么 fetch 的 chunk 是绝对有序的？

1. **TCP 协议的底层保证**
   `fetch` 请求是基于 HTTP 协议的，而 HTTP 又是建立在 TCP 协议之上的。TCP 是一种面向连接的、**可靠的、基于字节流**的传输层通信协议。它的核心特性之一就是**保证数据包按发送顺序到达**。即使网络中的数据包走了不同的路径导致后发的包先到了，TCP 协议也会在底层把它们重新排好序，再完整地交给上层的浏览器。

2. **ReadableStream 的队列机制**
   当你在前端使用 `response.body.getReader()` 获取到一个 `ReadableStreamDefaultReader` 时，它本质上是一个带内部队列的管道。浏览器会把底层 TCP 传过来的有序字节流，按顺序放入这个队列中。当你调用 `await reader.read()` 时，只是按顺序从这个队列的头部把数据取出来。因此，**你每次 `read()` 拿到的 chunk，绝对是你收到数据的先后顺序，也就是服务器发出的先后顺序**。

### 💡 为什么网上会有“分片乱序”的说法？

你可能在一些大文件上传或视频录制的资料中看到过“如何保证分片顺序”的讨论。**这完全是另一个维度的问题，千万不要混淆：**

- **`fetch` 接收流式数据（下载/ SSE）**：是**单条** TCP 连接内的字节流。浏览器保证顺序，开发者**不需要**做任何处理。
- **大文件分片上传（上传）**：是前端把一个文件切成几十甚至上百个 chunk，然后**并发发起几十个独立的 HTTP 请求**传给服务器。因为这几十个请求是独立的，网络延迟不同，服务器接收到的顺序可能会乱，所以**上传场景**才需要给每个分片带上 `index` 序号，让服务器去重新排序合并。

### ⚠️ 你真正需要处理的是“不完整片段”

正如我们上一轮沟通的，在 `fetch` 接收流时，你唯一需要手动处理的是**“不完整片段（Partial Chunk）”**。

但这**不是乱序**，而是“截断”。比如服务器发了 `data: 你好\n\n`，网络可能把它拆成两次给你：第一次拿到 `data: 你`，第二次拿到 `好\n\n`。这两次拿到的数据依然是**按顺序**的，只是第一条数据没说完。所以你才需要用 `buffer` 把它们按顺序拼起来，直到遇到完整的结束符 `\n\n`。

**总结一下：**
放心使用 `fetch` 配合 `while (true) { reader.read() }` 的流式读取模式。浏览器和 TCP 协议已经为你把数据排得整整齐齐，你只需要通过 `buffer` 缓冲区去拼接那些被网络截断的“半句话”即可。

## 如果浏览器不支持 fetch，如何实现流式数据的监听？

如果浏览器不支持 `fetch` 或者不支持 `fetch` 中的流式读取（`ReadableStream`），实现流式数据监听的最佳方案是退回到浏览器原生的 **`EventSource` API**。

`EventSource` 是专门为 SSE（Server-Sent Events）设计的原生接口，它的兼容性极好，甚至支持到 IE11 以及早期的 Safari 和移动端浏览器。

以下是针对不同情况的详细解决方案：

### 1. 最佳替代方案：使用原生 `EventSource`

`EventSource` 天生就是为了处理流式数据而生的，它不需要像 `fetch` 那样手动去拼接二进制流或处理缓冲区，浏览器底层已经帮你做好了所有的解析和自动重连工作。

**基础实现代码：**

```javascript
// 1. 创建连接（仅支持 GET 请求）
const eventSource = new EventSource('/api/sse-stream');

// 2. 监听默认消息（服务器发送 data: xxx 时触发）
eventSource.onmessage = function (event) {
    const data = event.data; // 获取流式数据片段
    console.log('收到流式数据:', data);
    // 在这里将数据追加到页面 DOM 中
};

// 3. 监听自定义事件（如果服务器发送了 event: update）
eventSource.addEventListener('update', function (event) {
    console.log('收到特定事件数据:', event.data);
});

// 4. 错误与重连处理（EventSource 默认会自动重连）
eventSource.onerror = function (err) {
    console.error('连接发生错误:', err);
    // 如果连接彻底关闭，eventSource.readyState === 2 (EventSource.CLOSED)
    if (eventSource.readyState === EventSource.CLOSED) {
        console.log('连接已断开');
    }
};

// 5. 在页面销毁或不需要时手动关闭
// eventSource.close();
```

### 2. 如果需要 POST 请求或自定义 Header

`EventSource` 的唯一致命短板是**只支持 GET 请求，且无法自定义请求头**。如果你的流式接口必须通过 POST 发送参数，或者需要在 Header 中携带 Token 鉴权，在不支持 `fetch` 的环境下，你有以下两种选择：

- **方案 A：使用成熟的 Polyfill（首选）**
  你可以引入社区成熟的 Polyfill 库，例如 `eventsource-polyfill` 或 `@microsoft/fetch-event-source` 的旧版本兼容方案。这些库在底层会自动判断：如果浏览器支持 `fetch` 流式读取就用 `fetch`；如果不支持，它们会退回到使用古老的 `XMLHttpRequest` (XHR) 来模拟流式数据的监听和解析。

- **方案 B：手动封装 `XMLHttpRequest` (XHR)**
  如果不想引入第三方库，你可以手动使用 `XMLHttpRequest` 来监听流。XHR 有一个 `progress` 事件，会在服务器传输数据的过程中不断触发。
  **大致逻辑如下：**

    ```javascript
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/sse-stream', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // 设置鉴权 Header
    xhr.setRequestHeader('Authorization', 'Bearer YOUR_TOKEN');

    let lastPosition = 0; // 记录上一次读取的位置

    xhr.onprogress = function () {
        // 截取从上一次位置到当前最新的数据
        const newData = xhr.responseText.substring(lastPosition);
        lastPosition = xhr.responseText.length;

        // 处理新获取的流式片段（注意：这里需要自己按 \n\n 分割 SSE 消息）
        console.log('收到新片段:', newData);
    };

    xhr.send(JSON.stringify({ prompt: '你好' }));
    ```

### 3. 针对极老旧浏览器（如 IE8/9）的兜底方案

如果你的应用需要兼容 IE8/IE9 这种连 `EventSource` 都没有的极老旧浏览器，通常有两种妥协方案：

- **引入 Polyfill**：直接使用 `eventsource-polyfill`，它会利用 XHR 或 iframe 等古老技术来模拟 SSE 标准。
- **短轮询 (Short Polling)**：这是最原始的方法。即使用 `setInterval` 每隔几秒钟发一次普通的 HTTP 请求去询问服务器“有没有新数据”。虽然实时性较差且浪费资源，但在极端环境下是最稳妥的保底方案。

**总结建议：**
只要你的业务场景允许使用 **GET 请求**，在不支持 `fetch` 的环境下，**无脑选择原生的 `EventSource`** 即可。它开箱即用，自带自动重连，且完美避开了手动处理流式字节和乱码的复杂工程问题。
