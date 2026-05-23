# Memory

大模型是无状态的，如果不做 Memory 管理，大模型根本不知道之前回答过什么。

## Memory 分类

- 短期记忆（short-term memory），数据存放在内存中
- 长期记忆（long-term memory），数据存放在文件、（向量）数据库、Redis 里，可以持久化存储

## Memory 策略

- **截断**：根据总 token 数量来保留最近的 message
    - 根据消息条数截断，保留最近 n 条 message
    - 根据 token 数量截断，保留最近 n 个 token 内的 message
- **总结**：调用大模型对之前的 message 生成一个摘要
    - 总结的计算策略：
        - 保留最近 n 条 message，将之前的 m 条消息生成摘要
        - 保留最近 n 个 token 内的 message，将之前的所有 message 生成摘要
    - 实际上下文：摘要 + 最近 n 条 message（或最近 n 个 token 内的 message）+ 本次用户 message
    - cursor claude code 等就是采用 token 计数，达到上下文限制就会触发总结
- **检索向量数据库**：将之前的对话记录保存在向量数据库，通过向量检索搜出语义相近的 message
    - 将每轮对话格式化之后存到向量数据库，记录对话的时间、轮次等
    - 将此次用户 message 转成向量，并去向量数据库搜索最接近的 n 个对话
    - 实际上下文：相近的 n 个对话 + 本次用户 message

## 大模型的上下文窗口

| 模型名称                   | 厂商/国家      | 上下文窗口   |
| :------------------------- | :------------- | :----------- |
| Claude Opus 4.7            | Anthropic (美) | 200万 Token  |
| GPT-5.5 (标准版)           | OpenAI (美)    | 100万 Token  |
| Gemini 3.1 Pro / 3.5 Flash | Google (美)    | 100万 Token  |
| DeepSeek V4-Pro            | 深度求索 (中)  | 100万 Token  |
| 通义千问 Qwen 3.6 Max      | 阿里巴巴 (中)  | 100万 Token  |
| Kimi K2.6                  | 月之暗面 (中)  | 25.6万 Token |
| GPT-4o                     | OpenAI (美)    | 12.8万 Token |
