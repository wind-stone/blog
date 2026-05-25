# ToolStrategy 原理示例

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

const modelWithTool = model.bindTools([
    {
        name: 'extract_scientist_info',
        description: '提取和结构化科学家的详细信息',
        schema: scientistSchema,
    },
]);

// 调用模型
const response = await modelWithTool.invoke('介绍一下爱因斯坦');

console.log('response.tool_calls:', response.tool_calls);

if (response.tool_calls?.[0]) {
    // 获取结构化结果
    const result = response.tool_calls[0].args;

    console.log('结构化结果:', JSON.stringify(result, null, 2));
    console.log(`\n姓名: ${result.name}`);
    console.log(`出生年份: ${result.birth_year}`);
    console.log(`国籍: ${result.nationality}`);
    console.log(`研究领域: ${result.fields.join(', ')}`);
}

// 打印结果

// response.tool_calls: [
//   {
//     name: 'extract_scientist_info',
//     args: {
//       name: '阿尔伯特·爱因斯坦',
//       birth_year: 1879,
//       nationality: '德国',
//       fields: [Array]
//     },
//     type: 'tool_call',
//     id: 'call_bnrsxm5e'
//   }
// ]
// 结构化结果: {
//   "name": "阿尔伯特·爱因斯坦",
//   "birth_year": 1879,
//   "nationality": "德国",
//   "fields": [
//     "理论物理",
//     "相对论",
//     "量子力学"
//   ]
// }

// 姓名: 阿尔伯特·爱因斯坦
// 出生年份: 1879
// 国籍: 德国
// 研究领域: 理论物理, 相对论, 量子力学
```
