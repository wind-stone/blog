# AI 对话场景中，频繁的流式更新会导致 React 频繁重新渲染，有哪些优化手段？

这个问题确实是 AI 对话场景中最常见的性能瓶颈。流式更新（SSE）每秒可能推送几十甚至上百个 token，如果每个 token 都触发一次 React 渲染，界面很快就会卡顿。

结合当前前端社区的最佳实践，我把优化手段按**优先级**和**效果**整理成以下方案：

## 方案一：缓冲区 + 定时批量更新（最推荐，效果最明显）

核心思路是**把接收 token 的过程和渲染过程解耦**，用 `useRef` 做缓冲区，定时器做节流。

```javascript
import { useRef, useState, useEffect, useCallback } from 'react';

function useStreamBuffer(flushInterval = 50) {
    const [displayText, setDisplayText] = useState('');
    const bufferRef = useRef(''); // 缓冲区，不触发渲染
    const timerRef = useRef(null);

    // 追加 token 到缓冲区
    const append = useCallback(
        chunk => {
            bufferRef.current += chunk;

            // 如果定时器还没启动，启动它
            if (!timerRef.current) {
                timerRef.current = setTimeout(() => {
                    // 将缓冲区的内容一次性刷入状态
                    setDisplayText(prev => prev + bufferRef.current);
                    bufferRef.current = ''; // 清空缓冲区
                    timerRef.current = null;
                }, flushInterval);
            }
        },
        [flushInterval]
    );

    // 组件卸载时清理定时器
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return { displayText, append, reset: () => setDisplayText('') };
}
```

**效果**：将渲染频率从每 token 一次降低到每 50ms 一次，渲染次数减少 90% 以上。

### 方案二：使用 `requestAnimationFrame` 对齐浏览器绘制周期

比定时器更优雅的方式，将更新与浏览器的帧率（60fps）对齐。

```javascript
function useStreamRAF() {
    const [displayText, setDisplayText] = useState('');
    const bufferRef = useRef('');
    const rafIdRef = useRef(null);

    const append = useCallback(chunk => {
        bufferRef.current += chunk;

        if (!rafIdRef.current) {
            rafIdRef.current = requestAnimationFrame(() => {
                setDisplayText(prev => prev + bufferRef.current);
                bufferRef.current = '';
                rafIdRef.current = null;
            });
        }
    }, []);

    // 组件卸载时清理 raf
    useEffect(() => {
        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, []);

    return { displayText, append, reset: () => setDisplayText('') };
}
```

**优势**：更新时机与浏览器渲染周期同步，不会出现掉帧或撕裂感。

### 方案三：使用 React 并发特性（`useDeferredValue`）

React 18 引入的并发模式，可以将非紧急更新标记为“可延迟”。

```javascript
import { useState, useDeferredValue } from 'react';

function ChatMessage({ streamText }) {
    // streamText 是实时更新的（高频）
    // deferredText 是延迟版本（低频更新）
    const deferredText = useDeferredValue(streamText);
    const isStale = deferredText !== streamText;

    return (
        <div className={`message ${isStale ? 'stale' : ''}`}>
            {deferredText}
            {isStale && <span className="cursor">|</span>}
        </div>
    );
}
```

**原理**：React 会在浏览器空闲时才更新 `deferredText`，高优先级更新（如用户输入）不会被阻塞。

### 方案四：消息列表虚拟化（处理长对话）

当对话历史达到几百条时，即使流式更新优化了，整个列表的渲染也会变慢。

```javascript
import { useVirtualizer } from '@tanstack/react-virtual';

function ChatList({ messages }) {
    const parentRef = useRef(null);

    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80, // 每条消息预估高度
    });

    return (
        <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
            <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
                {virtualizer.getVirtualItems().map(virtualItem => (
                    <div
                        key={virtualItem.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            transform: `translateY(${virtualItem.start}px)`,
                        }}
                    >
                        <MessageItem message={messages[virtualItem.index]} />
                    </div>
                ))}
            </div>
        </div>
    );
}
```

**效果**：无论对话历史有多长，DOM 节点数始终保持在可视区域的数量（如 20-30 个）。

### 方案五：组件拆分 + `React.memo`

将消息列表和输入框拆成独立组件，避免流式更新导致整个页面重渲染。

```javascript
const MessageItem = React.memo(({ content }) => {
    return <div className="message">{content}</div>;
});

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    return (
        <div>
            <MessageList messages={messages} /> {/* 只有这里会频繁更新 */}
            <InputBox value={input} onChange={setInput} /> {/* 不受影响 */}
        </div>
    );
}
```

### 方案六：使用 Zustand 替代 useState（状态管理优化）

流式更新时，如果用 `useState` 存储整个消息列表，每次更新都会导致所有消息组件重渲染。用 Zustand 可以精确订阅。

```javascript
import { create } from 'zustand';

const useChatStore = create(set => ({
    messages: [],
    appendToLastMessage: chunk =>
        set(state => {
            const messages = [...state.messages];
            const last = messages[messages.length - 1];
            messages[messages.length - 1] = {
                ...last,
                content: last.content + chunk,
            };
            return { messages };
        }),
}));

// 组件只订阅最后一条消息
function LastMessage() {
    const lastMessage = useChatStore(state => state.messages[state.messages.length - 1]);

    return <div>{lastMessage?.content}</div>;
}
```

### 总结：推荐组合方案

对于大多数 AI 对话场景，我推荐**组合使用**以下方案：

| 优化手段              |   优先级   | 效果                   |
| :-------------------- | :--------: | :--------------------- |
| 缓冲区 + 定时批量更新 | ⭐⭐⭐⭐⭐ | 减少 90% 渲染次数      |
| 组件拆分 + React.memo |  ⭐⭐⭐⭐  | 隔离渲染范围           |
| 消息列表虚拟化        |  ⭐⭐⭐⭐  | 处理长对话历史         |
| useDeferredValue      |   ⭐⭐⭐   | 平滑低优先级更新       |
| Zustand 状态管理      |   ⭐⭐⭐   | 精确订阅，避免全量渲染 |

**最简实现**：如果项目刚起步，先用**方案一（缓冲区 + 定时器）**，效果立竿见影，代码量也最少。后续根据性能瓶颈再逐步叠加其他方案。
