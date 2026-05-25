# ProviderStrategy 原理示例

```ts
import chalk from 'chalk';
import { z } from 'zod';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getLlmModel } from '@llm/shared';

const scientistSchema = z
    .object({
        name: z.string().describe('科学家的全名'),
        birth_year: z.number().describe('出生年份'),
        field: z.string().describe('主要研究领域'),
        achievements: z.array(z.string()).describe('主要成就列表'),
    })
    .describe('科学家');

// 将 Zod 转换为原生的 JSON Schema 格式
const nativeJsonSchema = scientistSchema.toJSONSchema();

console.log('【nativeJsonSchema】', nativeJsonSchema);

const model = getLlmModel({
    provider: 'qwen',
    modelKwargs: {
        // 通过 modelKwargs 传入原生参数
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'scientist_info',
                strict: true,
                schema: nativeJsonSchema, // 这里的 nativeJsonSchema 就是转换后的对象
            },
        },
    },
});

async function testNativeJsonSchema() {
    console.log(chalk.bgMagenta('🧪 测试原生 JSON Schema 模式...\n'));

    const res = await model.invoke([
        new SystemMessage('你是一个信息提取助手，请直接返回 JSON 数据。'),
        new HumanMessage('介绍一下杨振宁'),
    ]);

    console.log(chalk.green('\n✅ 收到响应 (纯净 JSON):'));
    console.log(res.content);
    const data = JSON.parse(res.content as string);
    console.log(chalk.cyan('\n📋 解析后的对象:'));
    console.log(data);
}

testNativeJsonSchema().catch(console.error);

// 打印结果：

// 【nativeJsonSchema】 {
//   '$schema': 'https://json-schema.org/draft/2020-12/schema',
//   type: 'object',
//   properties: {
//     name: { type: 'string', description: '科学家的全名' },
//     birth_year: { type: 'number', description: '出生年份' },
//     field: { type: 'string', description: '主要研究领域' },
//     achievements: { type: 'array', items: [Object], description: '主要成就列表' }
//   },
//   required: [ 'name', 'birth_year', 'field', 'achievements' ],
//   additionalProperties: false,
//   description: '科学家'
// }
// 🧪 测试原生 JSON Schema 模式...

// ✅ 收到响应 (纯净 JSON):
// {
//   "achievements": [
//     "与李政道于1956年共同提出弱相互作用中宇称不守恒理论",
//     "1957年因此项工作与李政道共同获得诺贝尔物理学奖（时年35岁，是当时最年轻的诺奖物理学奖得主之一）",
//     "1967年与罗伯特·米尔斯合作提出杨-米尔斯规范场理论，成为粒子物理标准模型的数学基础",
//     "在规范场论、对称性破缺、统计力学（如杨-巴克斯特方程）等领域作出奠基性贡献"
//   ],
//   "birth_year": 1922,
//   "field": "理论物理学",
//   "name": "杨振宁"
// }

// 📋 解析后的对象:
// {
//   achievements: [
//     '与李政道于1956年共同提出弱相互作用中宇称不守恒理论',
//     '1957年因此项工作与李政道共同获得诺贝尔物理学奖（时年35岁，是当时最年轻的诺奖物理学奖得主之一）',
//     '1967年与罗伯特·米尔斯合作提出杨-米尔斯规范场理论，成为粒子物理标准模型的数学基础',
//     '在规范场论、对称性破缺、统计力学（如杨-巴克斯特方程）等领域作出奠基性贡献'
//   ],
//   birth_year: 1922,
//   field: '理论物理学',
//   name: '杨振宁'
// }
```
