<template>
    <div class="container">
        <div class="input-row">
            <input v-model="query" type="text" placeholder="请输入内容..." @keyup.enter="handleClick" />
            <button :disabled="isStreaming" @click="handleClick">
                {{ isStreaming ? '输出中...' : '查询' }}
            </button>
        </div>
        <div class="content">
            <span>{{ displayText }}</span>
            <span v-if="isStreaming" class="cursor">|</span>
        </div>
        <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const query = ref('SSE 是一种轻量级的服务器推送技术，非常适合实现这种打字机效果。🚀');
const displayText = ref('');
const isStreaming = ref(false);
const errorMsg = ref('');

const handleClick = async () => {
    if (isStreaming.value) return;
    errorMsg.value = '';
    displayText.value = '';
    isStreaming.value = true;

    // 注意：想要看到效果，先启动同目录下的 nodejs-backend 项目，进入项目后执行 node index.js

    try {
        const response = await fetch('http://localhost:3000/sse', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({ query: query.value }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.json();
            // 3. 手动抛出包含详细信息的错误
            throw {
                status: response.status,
                message: response.statusText,
                data: errorBody,
            };
        }
        return streamResponse(response);
    } catch (err) {
        errorMsg.value = err?.data?.error || '连接失败，请确认后端服务已启动';
        isStreaming.value = false;
    }
};

const streamResponse = (response: Response) => {
    if (!response.body) {
        errorMsg.value = '无法读取响应流，请检查 CORS 配置';
        isStreaming.value = false;
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    function read() {
        reader
            .read()
            .then(({ done, value }) => {
                if (done) {
                    console.log('[SSE] 流结束');
                    isStreaming.value = false;
                    return;
                }

                const chunk = decoder.decode(value, { stream: true });
                console.log('[SSE] 收到数据:', JSON.stringify(chunk));

                buffer += chunk;
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const payload = line.slice(6);

                    if (payload === '[DONE]') {
                        console.log('[SSE] 收到结束信号');
                        isStreaming.value = false;
                        return;
                    }

                    try {
                        const { char } = JSON.parse(payload);
                        displayText.value += char;
                    } catch {
                        console.log('[SSE] 跳过非 JSON 行:', payload);
                    }
                }

                read();
            })
            .catch(err => {
                console.log('[SSE] 流读取错误:', err);
                errorMsg.value = '流读取中断';
                isStreaming.value = false;
            });
    }

    read();
};
</script>

<style lang="less" scoped>
.container {
    padding: 20px;

    .input-row {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;

        input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            font-size: 14px;
            outline: none;

            &:focus {
                border-color: #409eff;
            }
        }

        button {
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            background: #409eff;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            white-space: nowrap;

            &:disabled {
                background: #a0cfff;
                cursor: not-allowed;
            }
        }
    }

    .content {
        min-height: 24px;
        padding: 12px 16px;
        background: #f5f7fa;
        border-radius: 4px;
        font-size: 15px;
        line-height: 1.8;
        white-space: pre-wrap;
        word-break: break-all;
        height: 300px;
        overflow-y: auto;
    }

    .cursor {
        display: inline-block;
        color: #409eff;
        font-weight: bold;
        animation: blink 0.8s infinite;
    }

    .error {
        margin-top: 12px;
        color: #f56c6c;
        font-size: 13px;
    }
}

@keyframes blink {
    0%,
    50% {
        opacity: 1;
    }
    51%,
    100% {
        opacity: 0;
    }
}
</style>
