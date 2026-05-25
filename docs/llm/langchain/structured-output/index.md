# 结构化输出 withStructuredOutput

在 LangChain Node.js（TypeScript）版本中，`withStructuredOutput` 的底层实现核心在于**根据模型的能力自动选择最优的执行策略**。它本质上是通过将开发者定义的数据结构（如 Zod Schema）转换为模型能够理解的指令，从而强制大模型输出机器可直接解析的结构化数据。

## 主要执行策略

其底层主要通过以下 3 种策略来实现：

### 1. ProviderStrategy（原生结构化输出策略）

这是最推荐且最可靠的方案。当检测到当前使用的大模型提供商（如 OpenAI、Anthropic Claude、Google Gemini 等）的原生 API 支持结构化输出时，LangChain 会优先采用此策略。

- **实现原理**：LangChain 会将你定义的 Zod Schema 转换为标准的 JSON Schema，并通过模型 API 原生的 `response_format` 参数直接传递给大模型。
- **效果**：大模型会在底层通过“约束解码”的方式，严格生成符合该 Schema 的 JSON 数据，无需额外的后处理，准确率极高。

### 2. ToolStrategy（工具调用/Function Calling 策略）

对于不支持原生结构化输出的模型，或者作为兜底方案，LangChain 会使用工具调用策略。这适用于绝大多数支持 Function Calling 的现代大模型。

- **实现原理**：LangChain 会在后台悄悄地将你的 Zod Schema 包装成一个虚拟的“工具（Tool）”或“函数（Function）”。该工具的参数定义就是你要求的输出结构。
- **执行流程**：
    1. 调用模型时，LangChain 将这个虚拟工具放入可用工具列表中传给大模型。
    2. 引导大模型去“调用”这个工具，并将需要提取或生成的信息填入工具的参数中。
    3. LangChain 拦截模型的这次工具调用请求，提取出其中的参数，并将其反序列化为你最初定义的 Zod 对象。

### 3. 传统兜底方案

如果遇到的模型既不支持原生结构化输出，也不支持工具调用（通常是较老的模型），LangChain 还可以退回到最传统的“提示词工程 + 输出解析器”模式。即通过在 System Prompt 中注入严格的 JSON 格式说明（`format_instructions`），让模型输出包含 JSON 的纯文本，再通过正则或解析器强行提取和校验。不过在现代开发中，前两种策略已经能覆盖 90% 以上的场景。

## withStructuredOutput 使用示例

```ts
import { getLlmModel } from '@llm/shared';
import { z } from 'zod';

// 初始化模型
const model = getLlmModel({
    provider: 'ollama',
});

// 定义结构化输出的 schema
const scientistSchema = z.object({
    name: z.string().describe('科学家的全名'),
    birth_year: z.number().describe('出生年份'),
    nationality: z.string().describe('国籍'),
    fields: z.array(z.string()).describe('研究领域列表'),
});

// 使用 withStructuredOutput 方法
const structuredModel = model.withStructuredOutput(scientistSchema);

// 调用模型
const result = await structuredModel.invoke('介绍一下爱因斯坦');

console.log('结构化结果:', JSON.stringify(result, null, 2));
console.log(`\n姓名: ${result.name}`);
console.log(`出生年份: ${result.birth_year}`);
console.log(`国籍: ${result.nationality}`);
console.log(`研究领域: ${result.fields.join(', ')}`);

// 打印结果：

// 结构化结果: {
//   "name": "阿尔伯特·爱因斯坦",
//   "birth_year": 1879,
//   "nationality": "瑞士（后加入美国国籍）",
//   "fields": [
//     "理论物理学",
//     "哲学",
//     "社会活动"
//   ]
// }

// 姓名: 阿尔伯特·爱因斯坦
// 出生年份: 1879
// 国籍: 瑞士（后加入美国国籍）
// 研究领域: 理论物理学, 哲学, 社会活动
```

更多关于结构化输出的内容，请参考：

- [转型 Agent 全栈工程师：企业级知识库项目](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzYzNzI2MTI2Nw==&action=getalbum&album_id=4306749160512208899&scene=126&sessionid=1779082302&from=singlemessage&subscene=10000&ascene=1&realreporttime=1779090208241&clicktime=1778748228&enterid=1778748228&forceh5=1)
    - [12. 结构化大模型输出：output parser 还是 tool？](https://mp.weixin.qq.com/s/T8-sXTbSpjjv0XizgmSgIg)
    - [13. Output Parser 实战：智能录入 + 流式版 mini cursor](https://mp.weixin.qq.com/s/OsgcA2qYJk0i4TxWPxCiWw)
- 对应代码库：[output-parser](https://github.com/wind-stone/ai-agent-practice/tree/master/apps/output-parser)
    - 代码里包含了流式的结构化输出
