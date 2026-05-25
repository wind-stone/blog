# 传统兜底方案：提示词工程 + 输出解析器原理示例

````ts
import { getLlmModel } from '@llm/shared';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

// 初始化模型
const model = getLlmModel({
    provider: 'ollama',
});

// 使用 zod 定义复杂的输出结构
const scientistSchema = z.object({
    name: z.string().describe('科学家的全名'),
    birth_year: z.number().describe('出生年份'),
    death_year: z.number().optional().describe('去世年份，如果还在世则不填'),
    nationality: z.string().describe('国籍'),
    fields: z.array(z.string()).describe('研究领域列表'),
    awards: z
        .array(
            z.object({
                name: z.string().describe('奖项名称'),
                year: z.number().describe('获奖年份'),
                reason: z.string().optional().describe('获奖原因'),
            })
        )
        .describe('获得的重要奖项列表'),
    major_achievements: z.array(z.string()).describe('主要成就列表'),
    famous_theories: z
        .array(
            z.object({
                name: z.string().describe('理论名称'),
                year: z.number().optional().describe('提出年份'),
                description: z.string().describe('理论简要描述'),
            })
        )
        .describe('著名理论列表'),
    education: z
        .object({
            university: z.string().describe('主要毕业院校'),
            degree: z.string().describe('学位'),
            graduation_year: z.number().optional().describe('毕业年份'),
        })
        .optional()
        .describe('教育背景'),
    biography: z.string().describe('简短传记，100字以内'),
});

// 从 zod schema 创建 parser
const parser = StructuredOutputParser.fromZodSchema(scientistSchema);

const question = `请介绍一下居里夫人（Marie Curie）的详细信息，包括她的教育背景、研究领域、获得的奖项、主要成就和著名理论。

    ${parser.getFormatInstructions()}`;

console.log('📋 生成的提示词:\n');
console.log(question);

try {
    console.log('🤔 正在调用大模型（使用 Zod Schema）...\n');

    const response = await model.invoke(question);

    console.log('📤 模型原始响应:\n');
    console.log(response.content);

    const result = await parser.parse(response.content as string);

    console.log('✅ StructuredOutputParser 自动解析并验证的结果:\n');
    console.log(JSON.stringify(result, null, 2));

    console.log('📊 格式化展示:\n');
    console.log(`👤 姓名: ${result.name}`);
    console.log(`📅 出生年份: ${result.birth_year}`);
    if (result.death_year) {
        console.log(`⚰️  去世年份: ${result.death_year}`);
    }
    console.log(`🌍 国籍: ${result.nationality}`);
    console.log(`🔬 研究领域: ${result.fields.join(', ')}`);

    console.log(`\n🎓 教育背景:`);
    if (result.education) {
        console.log(`   院校: ${result.education.university}`);
        console.log(`   学位: ${result.education.degree}`);
        if (result.education.graduation_year) {
            console.log(`   毕业年份: ${result.education.graduation_year}`);
        }
    }

    console.log(`\n🏆 获得的奖项 (${result.awards.length}个):`);
    result.awards.forEach((award, index) => {
        console.log(`   ${index + 1}. ${award.name} (${award.year})`);
        if (award.reason) {
            console.log(`      原因: ${award.reason}`);
        }
    });

    console.log(`\n💡 著名理论 (${result.famous_theories.length}个):`);
    result.famous_theories.forEach((theory, index) => {
        console.log(`   ${index + 1}. ${theory.name}${theory.year ? ` (${theory.year})` : ''}`);
        console.log(`      ${theory.description}`);
    });

    console.log(`\n🌟 主要成就 (${result.major_achievements.length}个):`);
    result.major_achievements.forEach((achievement, index) => {
        console.log(`   ${index + 1}. ${achievement}`);
    });

    console.log(`\n📖 传记:`);
    console.log(`   ${result.biography}`);
} catch (error) {
    if (error instanceof Error) {
        console.error('❌ 错误:', error.message);
        if (error.name === 'ZodError') {
            // @ts-expect-error
            console.error('验证错误详情:', error.errors);
        }
    }
}

// 打印结果：

// 📋 生成的提示词:

// 请介绍一下居里夫人（Marie Curie）的详细信息，包括她的教育背景、研究领域、获得的奖项、主要成就和著名理论。

//     You must format your output as a JSON value that adheres to a given "JSON Schema" instance.

// "JSON Schema" is a declarative language that allows you to annotate and validate JSON documents.

// For example, the example "JSON Schema" instance {{"properties": {{"foo": {{"description": "a list of test words", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}
// would match an object with one required property, "foo". The "type" property specifies "foo" must be an "array", and the "description" property semantically describes it as "a list of test words". The items within "foo" must be strings.
// Thus, the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of this example "JSON Schema". The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

// Your output will be parsed and type-checked according to the provided schema instance, so make sure all fields in your output match the schema exactly and there are no trailing commas!

// Here is the JSON Schema instance your output must adhere to. Include the enclosing markdown codeblock:
// ```json
// {"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object","properties":{"name":{"type":"string","description":"科学家的全名"},"birth_year":{"type":"number","description":"出生年份"},"death_year":{"description":"去世年份，如果还在世则不填","type":"number"},"nationality":{"type":"string","description":"国籍"},"fields":{"type":"array","items":{"type":"string"},"description":"研究领域列表"},"awards":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string","description":"奖项名称"},"year":{"type":"number","description":"获奖年份"},"reason":{"description":"获奖原因","type":"string"}},"required":["name","year"],"additionalProperties":false},"description":"获得的重要奖项列表"},"major_achievements":{"type":"array","items":{"type":"string"},"description":"主要成就列表"},"famous_theories":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string","description":"理论名称"},"year":{"description":"提出年份","type":"number"},"description":{"type":"string","description":"理论简要描述"}},"required":["name","description"],"additionalProperties":false},"description":"著名理论列表"},"education":{"description":"教育背景","type":"object","properties":{"university":{"type":"string","description":"主要毕业院校"},"degree":{"type":"string","description":"学位"},"graduation_year":{"description":"毕业年份","type":"number"}},"required":["university","degree"],"additionalProperties":false},"biography":{"type":"string","description":"简短传记，100字以内"}},"required":["name","birth_year","nationality","fields","awards","major_achievements","famous_theories","biography"],"additionalProperties":false}
// ```

// 🤔 正在调用大模型（使用 Zod Schema）...

// 📤 模型原始响应:

// ```json
// {
//   "name": "Marie Curie",
//   "birth_year": 1867,
//   "death_year": 1934,
//   "nationality": "French",
//   "fields": ["Physics", "Chemistry", "Radioactivity"],
//   "awards": [
//     {
//       "name": "Nobel Prize in Physics",
//       "year": 1903,
//       "reason": "Research on radioactivity and discovery of polonium and radium"
//     },
//     {
//       "name": "Nobel Prize in Chemistry",
//       "year": 1911,
//       "reason": "Discovery of radium and its isolation in metallic form"
//     }
//   ],
//   "major_achievements": [
//     "First woman to win a Nobel Prize",
//     "First person to win Nobel Prizes in two different scientific fields",
//     "Discovery of polonium and radium",
//     "Pioneered techniques for isolating radioactive isotopes",
//     "Developed mobile X-ray units for World War I medical use"
//   ],
//   "famous_theories": [
//     {
//       "name": "Radioactive Decay Theory",
//       "year": 1898,
//       "description": "Established the concept of radioactive elements and their spontaneous decay"
//     },
//     {
//       "name": "Atomic Emanation Theory",
//       "year": 1903,
//       "description": "Proposed that radioactivity results from atomic transformations"
//     }
//   ],
//   "education": {
//     "university": "Sorbonne University (Paris)",
//     "degree": "Doctor of Science in Mathematics",
//     "graduation_year": 1897
//   },
//   "biography": "Pioneering physicist and chemist who conducted groundbreaking research on radioactivity. First woman to win a Nobel Prize and the first person to win two Nobel Prizes in different scientific fields."
// }
// ```
// ✅ StructuredOutputParser 自动解析并验证的结果:

// {
//   "name": "Marie Curie",
//   "birth_year": 1867,
//   "death_year": 1934,
//   "nationality": "French",
//   "fields": [
//     "Physics",
//     "Chemistry",
//     "Radioactivity"
//   ],
//   "awards": [
//     {
//       "name": "Nobel Prize in Physics",
//       "year": 1903,
//       "reason": "Research on radioactivity and discovery of polonium and radium"
//     },
//     {
//       "name": "Nobel Prize in Chemistry",
//       "year": 1911,
//       "reason": "Discovery of radium and its isolation in metallic form"
//     }
//   ],
//   "major_achievements": [
//     "First woman to win a Nobel Prize",
//     "First person to win Nobel Prizes in two different scientific fields",
//     "Discovery of polonium and radium",
//     "Pioneered techniques for isolating radioactive isotopes",
//     "Developed mobile X-ray units for World War I medical use"
//   ],
//   "famous_theories": [
//     {
//       "name": "Radioactive Decay Theory",
//       "year": 1898,
//       "description": "Established the concept of radioactive elements and their spontaneous decay"
//     },
//     {
//       "name": "Atomic Emanation Theory",
//       "year": 1903,
//       "description": "Proposed that radioactivity results from atomic transformations"
//     }
//   ],
//   "education": {
//     "university": "Sorbonne University (Paris)",
//     "degree": "Doctor of Science in Mathematics",
//     "graduation_year": 1897
//   },
//   "biography": "Pioneering physicist and chemist who conducted groundbreaking research on radioactivity. First woman to win a Nobel Prize and the first person to win two Nobel Prizes in different scientific fields."
// }
// 📊 格式化展示:

// 👤 姓名: Marie Curie
// 📅 出生年份: 1867
// ⚰️  去世年份: 1934
// 🌍 国籍: French
// 🔬 研究领域: Physics, Chemistry, Radioactivity

// 🎓 教育背景:
//    院校: Sorbonne University (Paris)
//    学位: Doctor of Science in Mathematics
//    毕业年份: 1897

// 🏆 获得的奖项 (2个):
//    1. Nobel Prize in Physics (1903)
//       原因: Research on radioactivity and discovery of polonium and radium
//    2. Nobel Prize in Chemistry (1911)
//       原因: Discovery of radium and its isolation in metallic form

// 💡 著名理论 (2个):
//    1. Radioactive Decay Theory (1898)
//       Established the concept of radioactive elements and their spontaneous decay
//    2. Atomic Emanation Theory (1903)
//       Proposed that radioactivity results from atomic transformations

// 🌟 主要成就 (5个):
//    1. First woman to win a Nobel Prize
//    2. First person to win Nobel Prizes in two different scientific fields
//    3. Discovery of polonium and radium
//    4. Pioneered techniques for isolating radioactive isotopes
//    5. Developed mobile X-ray units for World War I medical use

// 📖 传记:
//    Pioneering physicist and chemist who conducted groundbreaking research on radioactivity. First woman to win a Nobel Prize and the first person to win two Nobel Prizes in different scientific fields.
````
