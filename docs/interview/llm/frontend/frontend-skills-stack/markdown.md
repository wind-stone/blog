# Markdown 渲染

处理 AI 流式输出的 Markdown 文本，核心思路其实非常直接：**“边接收、边拼接、边转换、边渲染”**。

在获取到流式数据后，你需要在前端引入专门的 Markdown 解析库，将实时拼接的 Markdown 字符串动态转换为 HTML，并渲染到页面上。

## 如何渲染 Markdown 文本？

以下是完整的实现方案和关键细节：

### 🛠️ 1. 引入 Markdown 解析与代码高亮库

浏览器无法直接识别 Markdown 语法，因此需要借助第三方库。在 Web 前端（如 Vue、React 或原生 JS）中，最主流的组合是：

- **markdown-it** 或 **marked.js**：负责将 Markdown 文本解析并转换为标准的 HTML 字符串。
- **highlight.js** 或 **Prism.js**：负责识别 HTML 中的代码块（`<pre><code>`），并为其添加语法高亮样式。

以 Vue3 + `markdown-it` 为例，基础引入和配置如下：

```javascript
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/ir-black.css'; // 引入你喜欢的代码高亮主题

// 初始化 markdown-it 实例，并配置 highlight 回调
const md = new MarkdownIt({
    highlight: function (str, lang) {
        // 如果指定了语言且 highlight.js 支持该语言，则进行高亮处理
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
            } catch (error) {
                console.error(error);
            }
        }
        // 如果没有指定语言或高亮失败，则转义后直接返回
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
});
```

### 🔄 2. 在流式接收中实时转换与渲染

在通过 `fetch` 或 `EventSource` 接收 AI 返回的流式数据时，你需要维护一个累积文本的变量（例如 `accumulatedContent`）。每当接收到新的数据块（chunk），就将其拼接到该变量中，并立即调用解析库转换为 HTML。

```javascript
let accumulatedContent = ''; // 用于累积完整的 Markdown 文本

// 假设在 fetch 的流式读取循环中
while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    accumulatedContent += chunk; // 1. 实时拼接 Markdown 文本

    // 2. 将拼接好的 Markdown 转换为 HTML
    const htmlContent = md.render(accumulatedContent);

    // 3. 将 HTML 渲染到页面上（以 Vue 为例，绑定到 v-html 指令）
    // document.getElementById('chat-output').innerHTML = htmlContent;
}
```

### 💡 3. 必须注意的三个关键细节

**① 自动滚动到底部 (Auto-scroll)**
随着 AI 源源不断地输出内容，页面高度会不断增加。为了不影响阅读体验，需要在每次更新内容后，将聊天容器的滚动条自动拉到底部。

```javascript
const chatContainer = document.getElementById('chat-container');
chatContainer.scrollTop = chatContainer.scrollHeight;
```

_进阶体验优化_：可以监听用户的鼠标滚轮事件。如果检测到用户正在主动向上滚动查看历史记录，则暂时停止自动滚动；当用户滚回底部时，再恢复自动跟随。

**② 表格与特殊样式丢失**
`markdown-it` 或 `marked` 默认只会将 Markdown 转换为最基础的 HTML 标签（如 `<table>`, `<th>`, `<td>`），但不会自带美观的 CSS 样式。这会导致 AI 输出的表格在页面上显得非常简陋甚至排版错乱。
**解决方案**：引入现成的 Markdown 样式库，例如 **`github-markdown-css`**。只需在项目中安装并引入该 CSS 文件，然后给渲染 Markdown 的容器加上 `class="markdown-body"`，表格、引用、列表等元素的样式就会立刻变得非常美观。

**③ 渲染性能优化（防抖/节流）**
如果 AI 输出速度极快，频繁的 DOM 更新（`innerHTML` 赋值）可能会导致页面掉帧或卡顿。
**解决方案**：可以结合 `requestAnimationFrame` 来合并渲染操作。将接收到的文本先存入缓冲区，然后在浏览器的下一次重绘之前统一进行 Markdown 转换和 DOM 更新，这样可以将渲染频率锁定在屏幕刷新率内（通常为 60fps），大幅提升流畅度。

## 如何渲染不完整的 Markdown 文本？

在 AI 流式输出时，由于数据是逐字或逐块到达的，Markdown 文本经常处于“中间状态”（比如只有开头的 `**` 而没有结尾的 `**`，或者代码块只有开头的 ` ```js ` 而没有闭合）。如果直接把这些不完整的文本丢给标准的 Markdown 解析器，会导致页面出现源码裸露、布局剧烈抖动（闪烁）甚至样式错乱。

解决这个问题的核心思路是：**在渲染前，对不完整的 Markdown 语法进行“智能检测与自动补全”**。

以下是三种主流的解决方案，从现成库到手动实现，供你参考：

### 🛠️ 方案一：使用专为流式渲染设计的现成库（强烈推荐）

目前社区已经有非常成熟的库专门解决 AI 流式输出的 Markdown 渲染问题，它们内置了强大的容错和补全机制。

- **Streamdown (React 首选)**：由 Vercel 开源，专为 AI 流式传输设计。它不仅能优雅地处理不完整的代码块、加粗、表格等语法，还内置了代码高亮（Shiki）、数学公式（KaTeX）和安全过滤。它采用“逐块独立渲染”机制，新数据到达时只会更新当前正在生长的块，已完成的块保持不变，性能极佳。
- **Cherry Markdown (框架无关)**：腾讯开源的编辑器，专门为 AI 流式输出场景设计了智能补全机制。它会自动识别未闭合的 12 种常见语法（如标题、加粗、代码块、表格、公式等）并临时补全，确保用户看到的永远是渲染后的漂亮样式，而不是尴尬的源码。

### ⚙️ 方案二：手动实现“语法自动补全”逻辑

如果你不想引入大型库，或者使用的是传统的 `markdown-it` / `marked.js`，可以手动写一个简单的预处理函数。核心原理是：**在将文本交给解析器之前，先检测并修补未闭合的语法**。

以最常见的**代码块**为例，你可以写一个 `patchMarkdown` 函数：

````javascript
/**
 * 检测并修补未闭合的 Markdown 代码块
 * @param text 原始增量文本
 * @returns 处理后可安全解析的文本
 */
const patchMarkdown = text => {
    // 匹配代码块标记 ```
    const codeBlockRegex = /```/g;
    const matches = text.match(codeBlockRegex);

    // 如果没有匹配到，或者匹配数量为偶数（说明已闭合），直接返回
    if (!matches || matches.length % 2 === 0) {
        return text;
    }

    // 如果匹配数量为奇数，说明最后一个代码块未闭合
    // 策略：在末尾临时补上一个闭合标记，防止后续内容被吞进代码块
    return text + '\n```';
};

// 在流式接收数据时调用
let accumulatedText = ''; // 累积的原始文本
// ...在 fetch 的流式循环中：
accumulatedText += chunk;
const safeText = patchMarkdown(accumulatedText); // 先补全
const html = md.render(safeText); // 再渲染
````

同样的逻辑也可以应用到加粗（`**`）、斜体（`*`）或行内代码（`` ` ``）等语法上，检测其开闭符号的数量是否为偶数，如果不是，就在渲染前临时补上闭合符号。

其中，最需要补全的语法主要集中在**成对出现的块级和行内元素**。以下是需要补全的核心情况罗列，以及一个整合了这些逻辑的 `patchMarkdown` 函数实现。

#### 📋 需自动补全的语法清单

1. **代码块（最核心）**：以 ` ``` ` 开头和结尾。如果只有开头没有结尾，后续所有内容都会被吞进代码块，导致页面布局彻底错乱。
2. **行内代码**：以反引号 `` ` `` 包裹。未闭合会导致后续文本全部变成代码样式。
3. **加粗与斜体**：以 `**`（加粗）、`__`（加粗）、`*`（斜体）或 `_`（斜体）包裹。未闭合会导致后续大段文字样式异常。
4. **删除线**：以 `~~` 包裹。
5. **数学公式**：以 `$`（行内公式）或 `$$`（块级公式）包裹。
6. **表格**：流式输出时，如果只有表头行而没有分割线（`|---|`），很多解析器不会将其渲染为表格。需要临时补全分割线和占位行。
7. **超链接与图片**：格式为 `[文本](链接` 或 `![alt](链接`。如果括号未闭合，会直接暴露源码。

#### 💻 详细的 `patchMarkdown` 函数实现

这个函数会在你每次接收到新的流式 `chunk` 并拼接到总文本后、交给 `markdown-it` 或 `marked` 解析**之前**被调用。

````javascript
/**
 * 对不完整的流式 Markdown 文本进行语法自动补全
 * @param {string} text - 当前累积的原始 Markdown 文本
 * @returns {string} - 补全后可安全交给解析器的文本
 */
const patchMarkdown = text => {
    if (!text) return '';
    let patchedText = text;

    // 1. 补全多行代码块 (```)
    // 统计 ``` 的数量，如果是奇数，说明有未闭合的代码块
    const codeBlockMatches = patchedText.match(/```/g);
    if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
        patchedText += '\n```';
    }

    // 2. 补全行内代码 (`)
    // 排除掉已经被包含在代码块里的反引号（简单处理：先不处理代码块内部的复杂情况）
    // 这里做一个简单的全局奇偶校验（生产环境建议用状态机排除代码块内的符号）
    const inlineCodeMatches = patchedText.match(/`/g);
    if (inlineCodeMatches && inlineCodeMatches.length % 2 !== 0) {
        patchedText += '`';
    }

    // 3. 补全加粗 (**) 和 删除线 (~~)
    const boldMatches = patchedText.match(/\*\*/g);
    if (boldMatches && boldMatches.length % 2 !== 0) {
        patchedText += '**';
    }
    const strikeMatches = patchedText.match(/~~/g);
    if (strikeMatches && strikeMatches.length % 2 !== 0) {
        patchedText += '~~';
    }

    // 4. 补全斜体 (*) 和 (_)
    // 注意：斜体的 * 很容易和列表的 - * 混淆，这里做最基础的奇偶补全
    // 严谨的做法需要判断 * 前面是否是空格或换行
    const italicStarMatches = patchedText.match(/(?<!\*)\*(?!\*)/g); // 匹配单个 *
    if (italicStarMatches && italicStarMatches.length % 2 !== 0) {
        patchedText += '*';
    }
    const italicUnderlineMatches = patchedText.match(/(?<!_)_(?!_)/g); // 匹配单个 _
    if (italicUnderlineMatches && italicUnderlineMatches.length % 2 !== 0) {
        patchedText += '_';
    }

    // 5. 补全数学公式 ($ 和 $$)
    // 优先匹配 $$ (块级公式)
    const blockMathMatches = patchedText.match(/\$\$/g);
    if (blockMathMatches && blockMathMatches.length % 2 !== 0) {
        patchedText += '$$';
    } else {
        // 如果没有未闭合的 $$，再检查单 $ (行内公式)
        // 同样需要排除掉 $$ 中的 $，这里简化处理，假设 $$ 已经配对
        const inlineMathMatches = patchedText.match(/\$/g);
        if (inlineMathMatches && inlineMathMatches.length % 2 !== 0) {
            patchedText += '$';
        }
    }

    // 6. 补全超链接或图片 [text](url
    // 匹配 [ 或 ![ 之后，有 ( 但没有对应的 )
    // 这是一个简化的正则，用于检测最后是否有一个未闭合的括号
    const lastOpenBracket = patchedText.lastIndexOf('[');
    const lastOpenParen = patchedText.lastIndexOf('(');
    const lastCloseParen = patchedText.lastIndexOf(')');

    // 如果存在未闭合的 (，且 ( 在 [ 之后，且没有闭合的 )
    if (lastOpenParen > lastOpenBracket && lastOpenParen > lastCloseParen) {
        patchedText += ')';
    }

    // 7. 补全表格
    // 如果文本以 "| ... |" 结尾，但后面没有分割线行，说明表格没写完
    // 检测最后一段是不是表格的表头（简单判断：包含 | 且不包含换行）
    const lines = patchedText.split('\n');
    const lastLine = lines[lines.length - 1].trim();
    const secondLastLine = lines.length > 1 ? lines[lines.length - 2].trim() : '';

    // 如果最后一行看起来像表格行（以 | 开头和结尾），且它不是分割线（不包含 ---）
    if (lastLine.startsWith('|') && lastLine.endsWith('|') && !lastLine.includes('---')) {
        // 并且上一行也不是分割线（防止重复补全）
        if (!secondLastLine.includes('---')) {
            // 构造一个临时的分割线，列数与最后一行保持一致
            const columnCount = (lastLine.match(/\|/g) || []).length - 1;
            const separator = '| ' + Array(columnCount).fill('---').join(' | ') + ' |';
            patchedText += `\n${separator}\n`;
        }
    }

    return patchedText;
};
````

#### ⚠️ 生产环境的进阶注意事项

上面的函数是一个通用的基础版本，在实际的高性能 AI 应用中，你还需要注意以下两点：

1. **避免“代码块内误伤”**：
   上面的逻辑是全局统计符号数量。如果 AI 正在写一段包含很多 `*` 或 `$` 的 Python/JS 代码，全局统计会误以为这些符号是 Markdown 语法并强行补全。
   _解决思路_：在检测行内符号（如 `*`, `_`, `$`）之前，先用正则把已经闭合的 ` ```...``` ` 代码块内容临时剔除或标记，只对代码块之外的文本进行奇偶校验。
2. **配合虚拟光标**：
   补全的符号（如末尾自动加上的 `**`）只是为了骗过解析器让它正常渲染样式。为了不让用户感到困惑，你可以在补全的位置加一个透明的占位符，或者配合一个闪烁的“虚拟光标”组件，让用户感觉到内容还在“生长中”。

### 🧩 方案三：采用“分块解析与独立渲染”策略

更进阶的做法是，不把所有流式文本当成一个整体去解析，而是按“块（Block）”来切分。

利用正则将 Markdown 文本按顶层块级元素（如段落、代码块、标题、表格等）拆分为独立的单元。每个块有自己完整的语法边界，可以独立解析并挂载到 DOM 上。当 AI 输出新字符时，你只需要更新当前正在“生长”的那个块，已经解析完成的块保持不变。

**这种策略的好处是：**

1. **避免全局闪烁**：不会因为末尾新增了一个字符，导致前面几百行的 DOM 全部重新渲染。
2. **性能极高**：配合 React 的 `memo` 或 Vue 的缓存机制，能极大减少重排重绘。
3. **容错性强**：即使当前块语法不完整，也不会影响其他已渲染块的展示。

### 💡 总结建议

- 如果你在使用 **React** 开发 AI 应用，直接无脑接入 **Streamdown**，它能帮你规避掉 99% 的流式渲染坑。
- 如果是**原生 JS 或其他框架**，可以先尝试引入 **Cherry Markdown**，或者手动写一个简单的**“奇偶校验补全函数”**（如方案二），就能极大改善用户的视觉体验。

## 前端如何判断 SSE 返回的文本是 Markdown 还是混合内容？

在前端开发中，**你不需要（也无法）通过技术手段去“判断”SSE 返回的数据是不是 Markdown**。

这背后的核心逻辑是：**SSE 传输的只是纯文本（Plain Text）**。无论是普通的聊天文字，还是带有 `#`、`**`、`-` 等符号的 Markdown 文本，在浏览器看来，它们本质上都是没有任何区别的字符串。

因此，判断一段文本是否需要被渲染成 Markdown，**完全取决于你的业务场景和前后端的接口约定**。

### 🎯 1. 核心原则：依赖业务约定，而非前端检测

在实际的 AI 对话或流式输出场景中，通常遵循以下两种约定之一：

- **场景一：整个接口默认返回 Markdown**
  绝大多数 AI 聊天接口（如 ChatGPT、文心一言等）默认都会以 Markdown 格式返回内容。在这种情况下，你**不需要做任何检测**，直接将接收到的流式文本拼接起来，丢给 `markdown-it` 或 `marked` 等解析库进行实时渲染即可。
- **场景二：通过 Prompt 或接口参数控制**
  如果你希望 AI 返回纯文本，或者返回特定的 JSON 格式，你需要在前端发起请求时，通过 **Prompt Engineering（提示词工程）** 明确告诉 AI（例如：“请只返回纯文本，不要使用任何 Markdown 格式”），或者在请求体中增加一个字段（如 `"format": "markdown"`）来告知后端。

### ⚠️ 2. 为什么不能靠“正则匹配”来检测？

你可能会想：“能不能用正则表达式去检测字符串里有没有 `#` 或 `*` 来判断？” **强烈不建议这样做**，原因如下：

- **误判率极高**：普通的日常对话中也会大量包含 `#`（比如“我的#话题”）、`*`（比如“5\*5等于25”）、`-`（比如“北京-上海”）等符号。如果靠符号检测，很容易把普通文本错误地渲染成 Markdown 标题或列表，导致页面排版错乱。
- **流式数据的碎片化**：SSE 是流式输出的，AI 返回的数据是逐字或逐块到达的。在输出的初期，你可能只拿到了 `#` 这个字符，此时根本无法判断它到底是一个 Markdown 标题的开始，还是用户仅仅想打一个井号。

### 💡 3. 真正的“检测”：如何优雅地处理混合内容？

在实际业务中，真正的挑战不是“检测是不是 Markdown”，而是**如何安全地渲染 Markdown**。因为 AI 返回的内容里，可能既有 Markdown 语法，又有普通的 HTML 标签，甚至还有代码块。

为了保证渲染的健壮性，你需要做好以下几点：

- **开启 Markdown 解析器的安全选项**：
  在使用 `markdown-it` 或 `marked` 时，确保开启防注入配置。例如 `markdown-it` 默认会转义 HTML 标签，防止 AI 返回恶意的 `<script>` 脚本。

    ```javascript
    const md = new MarkdownIt({
        html: false, // 禁止解析 HTML 标签，防止 XSS 攻击
        breaks: true, // 将单换行符转换为 <br>，保留 AI 输出的换行格式
        linkify: true, // 自动将网址转换为可点击的链接
    });
    ```

- **处理代码块的高亮**：
  AI 经常会返回带有语言标识的代码块（如 ` ```python `）。你需要配合 `highlight.js` 等库，在 Markdown 解析时自动识别并高亮代码块。

- **保留换行符**
  在流式输出中，AI 经常通过换行来控制排版。确保你的 Markdown 解析器配置了 `breaks: true`，并且在拼接 SSE 数据时，没有错误地使用 `.trim()` 过滤掉代表换行的空 `data:` 行。

**总结来说**：前端不需要去猜测或检测 SSE 的数据格式。你应该与后端或 AI 模型达成明确的协议——**如果这个接口是用来聊天的，那就默认它返回的是 Markdown，直接拿去渲染即可。**

## 其他 Markdown 相关

[解析嵌套的 Markdown 字符串](/interview/algorithm/interview/llm/parse-markdown-to-dom.html)
