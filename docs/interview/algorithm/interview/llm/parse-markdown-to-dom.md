# 解析嵌套的 Markdown 字符串

题目：给定一个字符串，包含简单的嵌套结构如 加粗、斜体、链接，请解析出标签结构（简化版 DOM 树构建）

思路：使用栈（Stack）结构。遇到开始标记入栈，遇到结束标记出栈，并建立父子关系。

## 核心思路

这道题的核心在于利用 **栈** 来处理嵌套关系，这正是浏览器解析 HTML 构建 DOM 树的原理。我们可以用 JavaScript 来模拟这个过程，将 Markdown 字符串解析为 JSON 格式的树结构。

1. **定义语法**：为了演示，我们假设支持以下语法：
    - `**text**`：加粗
    - `*text*`：斜体
    - `[text](url)`：链接
    - 普通文本：作为叶子节点

2. **正则解析**：使用正则表达式将字符串切割成 Token（标记），区分出普通文本和特殊标记（开始标记或结束标记）。

3. **栈操作**：
    - 维护一个根节点 `root` 和一个当前路径栈 `stack`。
    - 遇到 **开始标记**（如 `**`）：创建新节点，将其作为当前栈顶节点的子节点，然后将新节点压入栈顶（成为新的当前节点）。
    - 遇到 **结束标记**（如 `**`）：将栈顶节点弹出（回到上一层级）。
    - 遇到 **普通文本**：将其作为文本节点添加到当前栈顶节点的子节点中。

## JavaScript 代码实现

下面是具体的代码实现：

```javascript
/**
 * 解析简单的 Markdown 字符串为简化版 DOM 树
 * @param {string} str - 输入的 Markdown 字符串
 * @returns {Object} - 解析后的树结构
 */
function parseMarkdownToDOM(str) {
    // 1. 初始化根节点和栈
    // 根节点是一个虚拟节点，用于容纳所有顶层元素
    const root = { type: 'root', children: [] };
    // 栈中存放的是当前的上下文节点，初始时只有根节点
    const stack = [root];

    // 2. 定义 Token 匹配规则
    // 匹配: ** (加粗), * (斜体), [ (链接开始), ](url) (链接结束), 或者普通文本
    const tokenRegex = /(\*\*|\*|\[|\]\([^)]+\))|([^*\[\]]+)/g;
    // 正则表达式拆解：
    // /
    // (
    //     \*\*
    //     |
    //     \*
    //     |
    //     \[
    //     |
    //     \]\([^)]+\)        匹配： ](内容)
    // )
    // |
    // (
    //     [^*\[\]]+          匹配：不包含 * [ ] 的普通文本
    // )
    // /g

    let match;

    // 3. 遍历所有匹配项
    while ((match = tokenRegex.exec(str)) !== null) {
        const marker = match[1]; // 特殊符号 (**, *, [, ](...))
        const text = match[2]; // 普通文本

        // --- 处理普通文本 ---
        if (text) {
            const currentNode = stack[stack.length - 1];
            // 创建文本节点并添加到当前父节点的 children
            currentNode.children.push({
                type: 'text',
                value: text,
            });
            continue;
        }

        // --- 处理特殊标记 ---
        const currentNode = stack[stack.length - 1];

        // A. 遇到加粗或斜体的开始标记 (** 或 *)
        if (marker === '**' || marker === '*') {
            // 检查栈顶是否已经有相同的标记（意味着这是结束标记）
            if (currentNode.marker === marker) {
                // 如果是相同的，说明闭合了，出栈
                stack.pop();
            } else {
                // 如果是不同的，说明是新层级，入栈
                const newNode = {
                    type: marker === '**' ? 'bold' : 'italic',
                    marker: marker, // 记录标记类型以便后续匹配闭合
                    children: [],
                };
                currentNode.children.push(newNode);
                stack.push(newNode);
            }
        }
        // B. 遇到链接开始标记 ([)
        else if (marker === '[') {
            const newNode = {
                type: 'link',
                url: '', // 稍后填充
                children: [],
            };
            currentNode.children.push(newNode);
            stack.push(newNode);
        }
        // C. 遇到链接结束标记 (](url))
        else if (marker.startsWith('](')) {
            // 提取 URL: 去掉开头的 '](' 和结尾的 ')'
            const url = marker.slice(2, -1);

            // 栈顶应该是刚才创建的 link 节点
            if (stack.length > 0) {
                const linkNode = stack.pop(); // 结束链接，出栈
                linkNode.url = url;
                // 注意：这里不需要再 push 回去，因为链接已经闭合
            }
        }
    }

    return root;
}

// --- 测试 ---
const input = '这是 **[一个链接](https://example.com) 和 *斜体* 文本** 结束。';
const result = parseMarkdownToDOM(input);

console.log(JSON.stringify(result, null, 2));
```

## 代码逻辑详解

1. **初始化**：
    - 创建一个 `root` 节点作为树的根基。
    - `stack` 数组用来模拟“当前正在编辑的位置”。最开始我们在 `root` 下。

2. **正则解析 (`tokenRegex`)**：
    - 我们使用 `|` (或) 操作符将字符串分为两类：特殊符号（分隔符）和普通文本。
    - 这样我们可以顺序处理字符串，不会遗漏任何字符。

3. **处理嵌套（栈的核心作用）**：
    - **入栈**：当遇到 `**` 或 `[` 时，意味着一个新的格式开始了。我们创建对应的节点（如 `{type: 'bold', children: []}`），把它挂在当前栈顶节点的 `children` 里，然后把它自己推入栈顶。这表示“接下来的内容属于这个加粗节点”。
    - **出栈**：当再次遇到 `**` 或 `]` 时，意味着当前格式结束了。我们把栈顶元素弹出，表示“回到了上一层”。
    - **链接的特殊处理**：链接的结束符 `](url)` 包含了数据（URL）。我们在出栈的同时，利用正则提取 URL 并赋值给节点。

4. **文本处理**：
    - 如果匹配到的是普通文本，直接把它作为一个文本节点，添加到当前栈顶元素的 `children` 中即可。

### 输出结果示例

对于输入字符串 `"这是 **[链接](url)**"`，上述代码会生成如下 JSON 结构：

```json
{
    "type": "root",
    "children": [
        { "type": "text", "value": "这是 " },
        {
            "type": "bold",
            "marker": "**",
            "children": [
                {
                    "type": "link",
                    "url": "https://example.com",
                    "children": [{ "type": "text", "value": "链接" }]
                }
            ]
        }
    ]
}
```

这个结构清晰地展示了“链接”是“加粗”的子节点，而“加粗”和前面的文本是“根节点”的子节点。
