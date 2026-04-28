import { createInterface } from 'readline';
import { callAI, callAIWithFallback } from './shared/llm-provider.mjs';

// 交互式聊天
const rl = createInterface({ input: process.stdin, output: process.stdout });
const messages = [{ role: 'system', content: '你是一个有帮助的 AI 助手。' }];

function ask() {
    rl.question('\n你: ', async input => {
        if (!input.trim() || input === 'exit') {
            console.log('再见！');
            rl.close();
            return;
        }

        messages.push({ role: 'user', content: input });

        try {
            const stream = true;
            const reply = await callAIWithFallback({
                messages,
                stream,
            });

            if (stream) {
                let isFirst = true;
                for await (const chunk of reply) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        if (isFirst) {
                            isFirst = false;
                            process.stdout.write(`\nAI: ${content}`); // 逐字输出，不换行
                        } else {
                            process.stdout.write(`${content}`);
                        }
                    }
                }
            } else {
                console.log(`\nAI: ${reply}`);
                messages.push({ role: 'assistant', content: reply });
            }
        } catch (err) {
            console.error(`\n错误: ${err.message}`);
        }

        ask();
    });
}

console.log('AI 聊天机器人（输入 exit 退出）');
ask();
