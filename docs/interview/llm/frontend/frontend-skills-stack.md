# 前端技术选型

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
