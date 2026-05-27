# Prompt Template：组件化管理 prompt

## 常用 API

### PromptTemplate

提示词模版，可以填入占位符变量

```js
import { PromptTemplate } from '@langchain/core/prompts';

const naiveTemplate = PromptTemplate.fromTemplate(`
你是一名严谨但不失人情味的工程团队负责人，需要根据本周数据写一份周报。

公司名称：{company_name}
部门名称：{team_name}
...
`);

const prompt = await naiveTemplate.format({
    company_name: '星航科技',
    team_name: '数据智能平台组',
});

console.log('格式化后的提示词:', prompt);

// 调用时：
// const stream = await model.stream(prompt);
```

### PipelinePromptTemplate

合并多个 Prompt Template 成一个大的 Prompt Template

```js
import { PipelinePromptTemplate, PromptTemplate } from '@langchain/core/prompts';
// 人设模块
const personaPrompt = PromptTemplate.fromTemplate(`你是一名资深工程团队负责人，写作风格：{tone}。
你擅长把枯燥的技术细节写得既专业又有温度。\n`);

// 背景模块
const contextPrompt = PromptTemplate.fromTemplate(`
公司：{company_name}
部门：{team_name}
...
\n`);

// 最终组合 Prompt（把上面几个模块拼在一起）
const finalWeeklyPrompt = PromptTemplate.fromTemplate(`
{persona_block}
{context_block}
...

现在请生成本周的最终周报。`);

const pipelinePrompt = new PipelinePromptTemplate({
    pipelinePrompts: [
        { name: 'persona_block', prompt: personaPrompt },
        { name: 'context_block', prompt: contextPrompt },
    ],
    finalPrompt: finalWeeklyPrompt,
});

// 1、直接一次性填入所有变量
const pipelineFormatted = await pipelinePrompt.format({
    tone: '专业、清晰、略带幽默',
    company_name: '星航科技',
    team_name: 'AI 平台组',
});
console.log('PipelinePromptTemplate 组合后的 Prompt：', pipelineFormatted);

// 调用时：
// const stream = await model.stream(pipelineFormatted);

// 2、先填入部分变量，再填入剩下的
const pipelineWithPartial = await pipelinePrompt.partial({
    tone: '偏正式但不僵硬',
});
const partialFormatted = await pipelineWithPartial.format({
    company_name: '星航科技',
    team_name: 'AI 平台组',
});
```

### ChatPromptTemplate

对话形式（messages 数组）的提示词模版

```js
import { ChatPromptTemplate } from '@langchain/core/prompts';

const chatPrompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        `你是一名资深工程团队负责人，擅长用结构化、易读的方式写技术周报。
         写作风格要求：{tone}。
         请根据后续用户提供的信息，帮他生成一份适合给老板和团队同时抄送的周报草稿。`,
    ],
    [
        'human',
        `本周信息如下：

         公司名称：{company_name}
         团队名称：{team_name}`,
    ],
]);

const chatMessages = await chatPrompt.formatMessages({
    tone: '专业、清晰、略带鼓励',
    company_name: '星航科技',
    team_name: '智能应用平台组',
});

console.log('ChatPromptTemplate 生成的消息:', chatMessages);

// 调用时（chatMessages 是 message 数组）：
// const response = await model.invoke(chatMessages);
```

另一种写法：

```js
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';

const systemTemplate = SystemMessagePromptTemplate.fromTemplate(
    `你是一名资深工程团队负责人，擅长用结构化、易读的方式写技术周报。
     写作风格要求：{tone}。
     请根据后续用户提供的信息，帮他生成一份适合给老板和团队同时抄送的周报草稿。`
);

const humanTemplate = HumanMessagePromptTemplate.fromTemplate(
    `本周信息如下：

    公司名称：{company_name}
    团队名称：{team_name}
    ...


    语气专业但有人情味 ...`
);

const composedTemplate = ChatPromptTemplate.fromMessages([systemTemplate, humanTemplate]);

const chatMessages = await composedTemplate.formatMessages({
    tone: '专业、清晰、略带鼓励',
    company_name: '星航科技',
    team_name: '智能应用平台组',
});

console.log('使用 SystemMessagePromptTemplate / HumanMessagePromptTemplate 生成的消息:', chatMessages);

// 调用时（chatMessages 是 message 数组）：
// const response = await model.invoke(chatMessages);
```

### PromptTemplate + ChatPromptTemplate + PipelinePromptTemplate

```js
import { PipelinePromptTemplate, PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts';
// 假设从上面的文件里导出了这两个 prompt
import { personaPrompt, contextPrompt } from './pipeline-prompt-template.js';

const taskPrompt = PromptTemplate.fromTemplate(
    `以下是本周与你所在团队相关的关键事实与数据（Git / Jira / 运维等）：
    {dev_activities}
    请你基于这些信息，帮我生成一份【技术周报】，重点包含： ... 省略文案
    `
);

// 最终的 ChatPromptTemplate：接收由 Pipeline 拼好的几块内容
const finalChatPrompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        `你是一名资深工程团队负责人，擅长把复杂的技术细节总结成结构化、易读的周报。
         下面是一些已经预先整理好的信息块，请你综合理解后，再根据用户补充的信息生成周报。`,
    ],
    [
        'human',
        `人设与写作风格： {persona_block}
         团队与本周背景：{context_block}
         任务与输入数据：{task_block}
         输出格式要求：...
         现在请基于以上信息，直接输出最终的周报内容。`,
    ],
]);

const weeklyChatPipelinePrompt = new PipelinePromptTemplate({
    pipelinePrompts: [
        { name: 'persona_block', prompt: personaPrompt }, // 复用人设
        { name: 'context_block', prompt: contextPrompt }, // 复用背景
        { name: 'task_block', prompt: taskPrompt }, // 本文件自己的任务模块
    ],
    // 注意：这里的 finalPrompt 是 ChatPromptTemplate，而不是普通 PromptTemplate
    finalPrompt: finalChatPrompt,
});

// 示例：构造一份消息数组并喂给 Chat 模型，这里要用 formatPromptValue
const promptValue = await weeklyChatPipelinePrompt.formatPromptValue({
    tone: '专业、清晰、略带鼓励',
    company_name: '星航科技',
    team_name: 'AI 平台组',
    dev_activities:
        '- Git：本周合并 4 个主要特性分支，包含 Prompt 配置化和日志观测优化\n' +
        '- Jira：关闭 9 个 Story / 5 个 Bug，新增 2 个 TechDebt 任务\n' +
        '- 其他： ...',
});

console.log('Pipeline + ChatPromptTemplate 生成的消息:', promptValue.toChatMessages());

// 调用时（promptValue.toChatMessages() 是 message 数组）：
// const aiResponse = await model.invoke(promptValue.toChatMessages());
```

### MessagesPlaceholder

MessagesPlaceholder 用于在 ChatPromptTemplate 里占位，来承载「之前的多轮对话」，后面通过`formatPromptValue`来传入实际的对话数据

```js
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

// 定义一个包含 MessagesPlaceholder 的 ChatPromptTemplate
const chatPromptWithHistory = ChatPromptTemplate.fromMessages([
    ['system', `你是一名资深工程效率顾问，善于在多轮对话的上下文中给出具体、可执行的建议。`],

    // 这里用 MessagesPlaceholder 来承载「之前的多轮对话」
    new MessagesPlaceholder('history'),

    [
        'human',
        `这是用户本轮的新问题：{current_input}

        请结合上面的历史对话，一并给出你的建议。`,
    ],
]);

// 构造一个模拟的历史对话 + 当前输入
const historyMessages = [
    {
        role: 'human',
        content: '我们团队最近在做一个内部的周报自动生成工具。',
    },
    {
        role: 'ai',
        content: '听起来不错，可以先把数据源（Git / Jira / 运维）梳理清楚，再考虑 Prompt 模块化设计。',
    },
];

const formattedMessages = await chatPromptWithHistory.formatPromptValue({
    history: historyMessages,
    current_input: '现在我们想再优化一下多人协同编辑周报的流程，有什么建议？',
});

console.log('包含历史对话的消息数组：', formattedMessages.toChatMessages());
```

### FewShotPromptTemplate

生成带示例的提示词模版

```js
import { FewShotPromptTemplate, PromptTemplate } from '@langchain/core/prompts';

// 定义 few-shot 示例模板（单条示例长什么样）
const examplePrompt = PromptTemplate.fromTemplate(
    `用户输入：{user_requirement}
     期望周报结构：{expected_style}
     模型示例输出片段：{report_snippet}
     ------------------------------`
);

// 准备几条示例数据（few-shot examples）
const examples = [
    {
        user_requirement: '重点突出稳定性治理，本周主要在修 Bug 和清理技术债，适合发给偏关注风险的老板。',
        expected_style: '语气稳健、偏保守，多强调风险识别和已做的兜底动作。',
        report_snippet:
            `- 支付链路本周共处理线上 P1 Bug 2 个、P2 Bug 3 个，全部在 SLA 内完成修复；\n` +
            `- 针对历史高频超时问题，完成 3 个核心接口的超时阈值和重试策略优化；\n` +
            `- 清理 12 条重复/噪音告警，减少值班同学 30% 的告警打扰。`,
    },
    {
        user_requirement: '偏向对外展示成果，希望多写一些亮点，适合发给更大范围的跨部门同学。',
        expected_style: '语气积极、突出成果，对技术细节做适度抽象。',
        report_snippet:
            `- 新上线「订单实时看板」，业务侧可以实时查看核心转化漏斗；\n` +
            `- 首次打通埋点 → 数据仓库 → 实时服务链路，为后续精细化运营提供基础能力；\n` +
            `- 和产品、运营一起完成 2 场内部分享，会后收到 15 条正向反馈。`,
    },
];

// 把示例封装成 FewShotPromptTemplate
const fewShotPrompt = new FewShotPromptTemplate({
    examples,
    examplePrompt,
    prefix: `下面是几条已经写好的【周报示例】，你可以从中学习语气、结构和信息组织方式：\n`,
    suffix:
        `\n基于上面的示例风格，请帮我写一份新的周报。` +
        `\n如果用户有额外要求，请在满足要求的前提下，尽量保持示例中的结构和条理性。`,
    inputVariables: [],
});

const fewShotBlock = await fewShotPrompt.format({});
console.log(fewShotBlock); // fewShotBlock 是 string 类型
```

### FewShotPromptTemplate + LengthBasedExampleSelector

当示例特别多时，可以根据长度来限制选择的示例

```js
import { FewShotPromptTemplate, PromptTemplate } from '@langchain/core/prompts';
import { LengthBasedExampleSelector } from '@langchain/core/example_selectors';

// 定义单条示例的 Prompt 模板
const examplePrompt = PromptTemplate.fromTemplate(
    `用户需求：{user_requirement}
     周报片段示例：{report_snippet}
    -----------------------------`
);

// 构造一批「长度差异明显」的示例，方便观察选择效果
const examples = [
    {
        user_requirement: '本周主要在做基础设施稳定性治理，想突出风险控制。',
        report_snippet:
            `- 核心链路共处理 P1 级别故障 1 起，P2 故障 2 起，均在 SLA 内完成处置；\n` +
            `- 对 5 个高风险接口补充了限流与熔断策略，覆盖 80% 高峰流量；\n` +
            `- 新增 6 条针对延迟抖动的告警规则，减少漏报风险。`,
    },
    {
        user_requirement: '偏向对外展示成果，多写一些亮点和业务价值。',
        report_snippet:
            `- 上线「实时订单看板」，支持业务实时查看转化漏斗；\n` +
            `- 打通埋点 → 数据仓库 → 实时服务的闭环，支撑后续精细化运营；\n` +
            `- 完成 2 场内部分享，会后收到 15 条正向反馈。`,
    },
    {
        user_requirement: '只是想要一个非常简短的周报，两三句话就够了，主要告诉老板「一切稳定」即可。',
        report_snippet: `本周整体运行平稳，未发生重大事故，核心指标均在预期范围内。`,
    },
    {
        user_requirement: '需要一份比较详细的技术周报，涵盖研发、测试、上线、监控等各个环节，篇幅可以略长。',
        report_snippet:
            `- 研发：完成结算服务重构第一阶段，拆分出 3 个独立子服务，接口延迟较旧架构下降约 35%；\n` +
            `- 测试：补齐 20+ 条关键路径自动化用例，整体用例数量提升到 180 条，回归时间从 2 天缩短到 0.5 天；\n` +
            `- 上线：采用灰度 + Canary 策略，期间监控到 2 次轻微指标抖动，均在 5 分钟内回滚处理；\n` +
            `- 监控：新增 8 条核心告警和 3 个 SLO 指标，后续会结合值班反馈继续收敛噪音告警。`,
    },
];

// 创建 LengthBasedExampleSelector
const exampleSelector = await LengthBasedExampleSelector.fromExamples(examples, {
    examplePrompt,
    // 这里简单地用字符长度近似控制，真实项目中可以配合 token 估算
    maxLength: 700,
    getTextLength: text => text.length,
});

// 基于 selector 构建 FewShotPromptTemplate
const fewShotPrompt = new FewShotPromptTemplate({
    examplePrompt,
    exampleSelector,
    prefix: '下面是一些不同风格和长度的周报片段示例，你可以从中学习语气和结构：\n',
    suffix:
        '\n\n现在请根据上面的示例风格，为下面这个场景写一份新的周报：\n' +
        '场景描述：{current_requirement}\n' +
        '请输出一份适合发给老板和团队同步的 Markdown 周报草稿。',
    inputVariables: ['current_requirement'],
});

// 演示：给定一个较长/较复杂的需求，让 selector 自动选出合适的示例
const currentRequirement =
    '我们本周在做「内部 AI 助手」项目，既有稳定性保障（处理线上问题），' +
    '也有新功能上线（接入知识库、日志检索）。希望周报既能体现「把坑都兜住了」，' +
    '又能展示一部分业务侧能感知到的亮点。';

const finalPrompt = await fewShotPrompt.format({
    current_requirement: currentRequirement,
});

console.log(finalPrompt); // finalPrompt 是 string 类型
```

长度计算：maxLength 减去调用 format 后的所有字段的长度，剩下的就是示例的长度，根据这个来选择

### FewShotPromptTemplate + SemanticSimilarityExampleSelector

当示例特别多时，可以根据选择语音相近的示例来限制

```js
import { getLlmModel, getEmbeddingsModel } from '@llm/shared';
import { FewShotPromptTemplate, PromptTemplate } from '@langchain/core/prompts';
import { SemanticSimilarityExampleSelector } from '@langchain/core/example_selectors';
import { Milvus } from '@langchain/community/vectorstores/milvus';

// 演示：使用 SemanticSimilarityExampleSelector 基于「语义相似度」自动从 Milvus 中选择 few-shot 示例
// 这里省略往 Milvus 里插入数据的代码，插入的数据是这样的，再加上 id 和 vector 字段
//   {
//     scenario:
//       '支付系统稳定性治理，强调风险防控、告警收敛和应急预案完善。',
//     report_snippet:
//       `- 本周聚焦支付链路稳定性，共处理 P1 事故 1 起、P2 事故 2 起，均在 SLA 内完成修复；\n` +
//       `- 针对历史高频超时问题，完成 3 个关键接口的超时阈值和重试策略优化；\n` +
//       `- 优化告警策略，合并冗余告警 10 条，新增 5 条基于 SLO 的告警规则。`,
//   },

const COLLECTION_NAME = 'weekly_report_examples';
const VECTOR_DIM = 1024;

// 1. 初始化 Chat 模型
const model = getLlmModel({
    provider: 'ollama',
});

// 2. 初始化 embeddings
const embeddings = getEmbeddingsModel({
    provider: 'qwen',
    dimensions: VECTOR_DIM,
});

// 3. 定义单条示例 Prompt 模板
const examplePrompt = PromptTemplate.fromTemplate(
    `用户场景：{scenario}
    生成的周报片段：
    {report_snippet}
    ----------------`
);

// 4. 连接 Milvus，并基于已存在的集合创建向量库
const milvusAddress = 'localhost:19530';

const vectorStore = await Milvus.fromExistingCollection(embeddings, {
    collectionName: COLLECTION_NAME,
    clientConfig: {
        address: milvusAddress,
    },
    // 与 weekly-report-examples-writer-milvus.ts 中创建的索引保持一致
    indexCreateOptions: {
        index_type: 'IVF_FLAT',
        metric_type: 'COSINE',
        params: { nlist: 1024 },
        search_params: {
            nprobe: 10,
        },
    },
});

const exampleSelector = new SemanticSimilarityExampleSelector({
    vectorStore,
    k: 2, // 每次只选出语义上最相近的 2 条示例
});

// 5. 用 selector 构建 FewShotPromptTemplate
const fewShotPrompt = new FewShotPromptTemplate({
    examplePrompt,
    exampleSelector,
    prefix: '下面是一些不同类型的周报示例，你可以从中学习语气和结构（系统会自动从 Milvus 选出和当前场景最相近的示例）：\n',
    suffix:
        '\n\n现在请根据上面的示例风格，为下面这个场景写一份新的周报：\n' +
        '场景描述：{current_scenario}\n' +
        '请输出一份适合发给老板和团队同步的 Markdown 周报草稿。',
    inputVariables: ['current_scenario'],
});

// 6. 演示：给定几个不同的场景描述，让 selector 挑出语义上最接近的示例
const currentScenario1 =
    '我们本周主要是在清理历史技术债：重构老旧的订单模块、补齐核心接口的单测，' +
    '同时也完善了一些文档，方便后面新人接手。整体没有对外大范围发布的新功能。';

// 一个语义上明显不同的场景：偏「首发上线 + 对外宣传」
const currentScenario2 =
    '本周完成新一代运营看板的首批功能上线，重点打通埋点和实时数仓链路，' +
    '并面向运营和市场同学做了多场宣讲，希望更多同学开始使用新能力。';

console.log('\n===== 场景 1：技术债清理为主 =====\n');
const finalPrompt1 = await fewShotPrompt.format({
    current_scenario: currentScenario1,
});
console.log(finalPrompt1);

console.log('\n\n===== 场景 2：新功能首发 + 对外宣传 =====\n');
const finalPrompt2 = await fewShotPrompt.format({
    current_scenario: currentScenario2,
});
console.log(finalPrompt2);
```

疑问：这里使用 SemanticSimilarityExampleSelector 去查找 top 语义相近的示例时，语义比较的输入是什么（除了示例外的拼接好的完整 prompt 吗？）
解答：根据传入的变量即`inputVariables: ['current_scenario']`中的`current_scenario`去做语义化相似度对比的。

### FewShotChatTemplatePromptTemplate

有 FewShotPromptTemplate 自然就有 FewShotChatMessagePromptTemplate，生成带示例的提示词模版，对话形式

```js
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from '@langchain/core/prompts';

// few-shot 示例：每条示例是「human 问 + ai 答」的聊天片段
const EXAMPLES = [
    {
        input: '本周主要推进支付稳定性治理，做了事故处置、告警优化和演练。',
        output:
            '- 本周围绕支付链路稳定性开展治理工作：完成 1 起 P1 事故与 2 起 P2 事故的排查与修复，均在 SLA 内关闭；\n' +
            '- 梳理并合并冗余告警规则 8 条，新建 4 条基于 SLO 的告警，大幅降低无效告警噪音；\n' +
            '- 组织 1 次故障应急演练，验证支付核心链路的应急预案可行性。',
    },
    {
        input: '本周交付了新运营看板，并给业务同学做了多场分享。',
        output:
            '- 上线新一代「运营实时看板」，支持业务实时查看关键转化指标和漏斗数据；\n' +
            '- 衔接埋点、数据仓库与可视化链路，为后续精细化运营提供统一数据口径；\n' +
            '- 面向市场和运营团队组织 2 场产品培训，帮助非技术同学理解看板核心能力和使用场景。',
    },
];

// 把上面的结构映射为 FewShotChatMessagePromptTemplate 可用的 examples
const fewShotExamples = new FewShotChatMessagePromptTemplate({
    examplePrompt: ChatPromptTemplate.fromMessages([
        ['human', '下面是本周的工作概述：\n{input}\n\n请帮我整理成适合发在团队周报里的要点列表。'],
        ['ai', '{output}'],
    ]),
    examples: EXAMPLES,
    exampleSeparator: '\n\n', // 可选：示例之间的分隔符，仅影响 formatMessages 输出
    inputVariables: [], // 示例本身不依赖运行时变量
});

// 把 few-shot 示例和最终用户输入组合成一个完整的 ChatPromptTemplate
const chatPrompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        '你是一名资深技术负责人，请根据给定的工作内容，参考上面的示例，帮我写一段结构清晰、重点突出的周报片段（使用 Markdown 列表）。',
    ],
    ['system', '下面是若干参考示例，请重点学习它们的「表达方式和结构」，而不是照搬具体内容：'],
    fewShotExamples,
    ['human', '这是我本周的实际工作内容，请帮我整理成周报：\n{current_work}'],
]);

// 演示：给一个简单的当前工作内容，跑通整个链路
const currentWork =
    '本周完成了订单模块的一轮重构，拆分了历史遗留的大文件，并补齐了核心路径的单测；' +
    '同时修复了两起线上性能问题，并把指标接入统一监控看板。';

// 组装成消息
const messages = await chatPrompt.formatMessages({
    current_work: currentWork,
});

console.log('\n===== 发送给模型的消息 =====\n');
console.log(messages);
```

## 参考文档

更多内容，详见：

- 文章：[Prompt Template：组件化管理 prompt](https://mp.weixin.qq.com/s/DfZkn9c2PRO-lfMDvtkqpQ)
- 代码：[prompt-template-test](https://github.com/wind-stone/ai-agent-practice/tree/master/apps/prompt-template-test)
