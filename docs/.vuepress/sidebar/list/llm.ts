export default {
    // 大模型
    '/llm': [
        {
            text: 'claude code',
            prefix: '/llm/claude-code',
            children: [
                'best-practices',
                {
                    text: '命令',
                    collapsable: false,
                    prefix: 'commands',
                    children: ['compact'],
                },
                {
                    text: 'Features',
                    collapsable: false,
                    prefix: 'features',
                    children: ['sub-agents'],
                },
            ],
        },
        {
            text: '大模型-理论知识',
            prefix: '/llm/knowledge',
            children: [
                {
                    text: 'MCP',
                    collapsable: false,
                    prefix: 'mcp',
                    children: ['models-private-function-calling', 'mcp-process'],
                },
                'rag/',
                'memory/',
            ],
        },
        {
            text: '大模型-前端交互',
            prefix: '/llm/frontend',
            children: [
                {
                    text: '前端技术选型',
                    collapsable: false,
                    prefix: 'frontend-skills-stack',
                    children: ['sse', 'markdown'],
                },
                'stream-response-and-abort',
                'multi-devices-context-sync',
                'prompt-engineering',
                'rag-integration',
                {
                    text: '前端实现效果',
                    collapsable: false,
                    prefix: 'effects',
                    children: ['sse-printer-effect/'],
                },
                {
                    text: '前端性能优化',
                    collapsable: false,
                    prefix: 'performance',
                    children: ['fast-rendering'],
                },
            ],
        },
        {
            text: 'LangChain',
            prefix: '/llm/langchain',
            children: [
                {
                    text: '结构化输出',
                    collapsable: false,
                    prefix: 'structured-output',
                    children: [
                        '',
                        'provider-strategy-example',
                        'tool-strategy-example',
                        'fallback-prompt-parse-example',
                    ],
                },
                'prompt-template/',
            ],
        },
    ],
};
