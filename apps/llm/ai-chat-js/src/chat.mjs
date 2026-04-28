import { readFileSync } from 'fs';
import { createInterface } from 'readline';

// 加载 .env
const env = Object.fromEntries(
    readFileSync('.env', 'utf-8')
        .split('\n')
        .filter(line => line.includes('='))
        .map(line => line.split('=').map(s => s.trim()))
);

const API_KEY = env.DEEPSEEK_API_KEY;

const BASE_URL = 'https://api.deepseek.com';

async function callAI(messages) {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages,
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`API 请求失败 (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
}

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
            const reply = await callAI(messages);
            console.log(`\nAI: ${reply}`);
            messages.push({ role: 'assistant', content: reply });
        } catch (err) {
            console.error(`\n错误: ${err.message}`);
        }

        ask();
    });
}

console.log('AI 聊天机器人（输入 exit 退出）');
ask();
