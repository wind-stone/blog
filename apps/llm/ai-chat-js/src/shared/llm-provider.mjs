import dotenv from 'dotenv';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

export const AI_PROVIDERS = {
    deepseek: {
        type: 'openai-compatible',
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
        defaultModel: 'deepseek-chat',
    },
    openai: {
        type: 'openai-compatible',
        baseURL: 'https://api.openai.com/v1',
        apiKey: process.env.OPENAI_API_KEY,
        defaultModel: 'gpt-4o-mini',
    },
    qwen: {
        type: 'openai-compatible',
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        apiKey: process.env.QWEN_API_KEY,
        defaultModel: 'qwen-plus',
    },
    ollama: {
        type: 'openai-compatible',
        baseURL: 'http://localhost:11434/v1',
        apiKey: 'ollama',
        defaultModel: 'qwen2.5',
    },
    claude: {
        type: 'anthropic',
        apiKey: process.env.CLAUDE_API_KEY,
        defaultModel: 'claude-sonnet-4-20250514',
    },
};

const clientCache = new Map();

function getClient(provider) {
    if (clientCache.has(provider)) return clientCache.get(provider);
    const config = AI_PROVIDERS[provider];
    const client =
        config.type === 'anthropic'
            ? new Anthropic({ apiKey: config.apiKey })
            : new OpenAI({ baseURL: config.baseURL, apiKey: config.apiKey });
    clientCache.set(provider, client);
    return client;
}

export async function callAI({
    provider = 'deepseek',
    model = '',
    messages,
    system = '',
    temperature = 0.7,
    maxTokens = 2048,
    stream = false,
}) {
    const config = AI_PROVIDERS[provider];
    const client = getClient(provider);
    const modelName = model || config.defaultModel;

    // claude
    if (config.type === 'anthropic') {
        const response = await client.messages.create({
            model: modelName,
            max_tokens: maxTokens,
            temperature,
            system: system || undefined,
            messages,
            stream,
        });
        if (stream) {
            return response;
        } else {
            return response.content[0].text;
        }
    }

    // openai-compatible
    const fullMessages = system ? [{ role: 'system', content: system }, ...messages] : messages;

    const response = await client.chat.completions.create({
        model: modelName,
        messages: fullMessages,
        temperature,
        max_tokens: maxTokens,
        stream,
    });

    if (stream) {
        return response;
    } else {
        return response.choices[0].message.content;
    }
}

export async function callAIWithFallback({
    providers = ['deepseek', 'qwen', 'ollama'],
    messages,
    system = '',
    temperature = 0.7,
    maxTokens = 2048,
    stream = false,
}) {
    for (const provider of providers) {
        try {
            return await callAI({ provider, messages, system, temperature, maxTokens, stream });
        } catch (err) {
            console.warn(`[${provider}] 调用失败: ${err.message}，尝试下一个...`);
        }
    }
    throw new Error('所有 AI 厂商均不可用');
}
