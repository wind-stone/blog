# MCP 处理流程

为了让你彻底看清 MCP 协议下大模型与外部工具的完整交互链路，我将整个流程拆解为 6 个核心步骤。

在这个架构中，我们需要明确四个核心参与方：

- **用户**：发出自然语言指令的人。
- **MCP Host（宿主应用）**：如 Claude Desktop、Cursor 或你的自定义 AI 应用，负责编排整体逻辑。
- **MCP Client（客户端）**：内嵌在 Host 中，专门负责与 MCP Server 进行底层通信和协议转换的“翻译官”。
- **MCP Server（服务端）**：提供具体工具、资源或提示词的轻量级服务程序。
- **LLM（大模型）**：只负责推理和决策，不直接触碰 MCP 协议。

以下是完整的交互流程及每一步的数据格式：

## 📝 阶段一：能力发现与同步（建立连接）

### 步骤 1：初始化握手 (Initialize)

- **参与方**：MCP Client ➡️ MCP Server
- **动作**：当 Host 启动时，其内部的 MCP Client 会主动连接配置好的 MCP Server，并发起握手，协商协议版本和能力。
- **通信数据格式 (JSON-RPC 2.0)**：
    - **请求 (Request)**：
        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2025-06-18",
                "capabilities": {},
                "clientInfo": { "name": "MyAIHost", "version": "1.0.0" }
            }
        }
        ```
    - **响应 (Response)**：
        ```json
        {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "protocolVersion": "2025-06-18",
                "capabilities": { "tools": {} },
                "serverInfo": { "name": "WeatherServer", "version": "1.2.0" }
            }
        }
        ```

### 步骤 2：获取工具列表 (Tools Discovery)

- **参与方**：MCP Client ➡️ MCP Server
- **动作**：握手成功后，MCP Client 向 Server 询问：“你有哪些工具可以提供？”
- **通信数据格式**：
    - **请求**：
        ```json
        { "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
        ```
    - **响应**：Server 返回标准的 MCP 工具描述（包含 `inputSchema`）。
        ```json
        {
            "jsonrpc": "2.0",
            "id": 2,
            "result": {
                "tools": [
                    {
                        "name": "get_weather",
                        "description": "查询天气",
                        "inputSchema": {
                            "type": "object",
                            "properties": { "city": { "type": "string" } },
                            "required": ["city"]
                        }
                    }
                ]
            }
        }
        ```

## 🔄 阶段二：格式转换与大模型推理

### 步骤 3：格式转换与注入上下文 (Translation & Injection)

- **参与方**：MCP Host / Client ➡️ LLM
- **动作**：这是 MCP 最核心的“翻译”环节。MCP Client 拿到上述标准 JSON 后，将其**转换**成当前 LLM 能够理解的私有格式（例如 OpenAI 的 Function Calling 格式），并将其作为系统上下文（System Prompt）的一部分发送给 LLM。
- **通信数据格式**（以转换为 OpenAI 格式为例）：
    - **发送给 LLM 的请求体**：
        ```json
        {
            "model": "gpt-4o",
            "messages": [{ "role": "user", "content": "帮我查一下北京的天气" }],
            "tools": [
                // 经过转换后的格式
                {
                    "type": "function",
                    "function": {
                        "name": "get_weather",
                        "parameters": { "type": "object", "properties": { "city": { "type": "string" } } }
                    }
                }
            ]
        }
        ```

### 步骤 4：大模型推理与决策 (Reasoning)

- **参与方**：LLM（内部计算）
- **动作**：LLM 接收到用户指令和可用的工具列表，进行语义分析。它判断出需要调用 `get_weather` 工具，并提取出参数 `city="北京"`。

## ⚙️ 阶段三：工具执行与结果反馈

### 步骤 5：解析响应并触发工具调用 (Tool Execution)

- **参与方**：LLM ➡️ MCP Host ➡️ MCP Client ➡️ MCP Server
- **动作**：
    1. LLM 返回带有 `tool_calls` 的响应给 Host。
    2. Host/MCP Client 解析出 LLM 想要调用的工具名和参数。
    3. MCP Client 将这些信息**重新封装**回标准的 MCP `tools/call` 请求，发送给 MCP Server。
- **通信数据格式**：
    - **LLM 返回给 Host 的原始响应**：
        ```json
        {
            "role": "assistant",
            "tool_calls": [
                { "id": "call_abc", "function": { "name": "get_weather", "arguments": "{\"city\": \"北京\"}" } }
            ]
        }
        ```
    - **MCP Client 发给 MCP Server 的请求**：
        ```json
        {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": { "name": "get_weather", "arguments": { "city": "北京" } }
        }
        ```
    - **MCP Server 执行后返回的结果**：
        ```json
        {
            "jsonrpc": "2.0",
            "id": 3,
            "result": { "content": [{ "type": "text", "text": "北京今天晴，气温 25°C" }], "isError": false }
        }
        ```

### 步骤 6：结果回填与最终生成 (Result Feedback & Final Generation)

- **参与方**：MCP Client ➡️ LLM ➡️ 用户
- **动作**：
    1. MCP Client 拿到工具执行结果后，Host 将其组装成一条 `role: "tool"` 的消息，追加到之前的对话历史中。
    2. 再次将包含“问题 + 工具调用记录 + 工具执行结果”的完整对话历史发送给 LLM。
    3. LLM 结合真实数据，生成最终的自然语言回复呈现给用户。
- **通信数据格式**（第二次请求 LLM）：
    ```json
    {
      "model": "gpt-4o",
      "messages": [
        { "role": "user", "content": "帮我查一下北京的天气" },
        { "role": "assistant", "tool_calls": [...] }, // 上一步模型的决策
        { "role": "tool", "tool_call_id": "call_abc", "name": "get_weather", "content": "北京今天晴，气温 25°C" } // 填入的真实结果
      ]
    }
    ```

## 💡 总结

在整个流程中，**大模型（LLM）始终被隔离在 MCP 协议之外**。它只负责用自然语言和私有的 Function Call 格式做“大脑决策”，而所有底层的标准化通信（握手、发现、调用、传输）全部由 **MCP Client** 默默完成。这种设计完美解耦了模型与应用，让开发者可以随意更换底层的大模型，而无需修改任何工具侧的代码。

从上述阶段和步骤上来看，接入 MCP 只需要 **MCP Host（宿主应用）** 和 **工具提供方（MCP Server）** 去做适配工作，大模型（LLM）本身是完全不需要做任何更改的。

我们可以把这三者的分工再明确一下：

- **🔌 工具提供方 (MCP Server)**：负责把自己的私有 API、数据库或本地能力，按照 MCP 的标准格式“包装”并暴露出来。
- **💻 MCP Host（宿主应用）/大模型应用开发者 (集成 MCP Client)**：负责在 AI 应用中内置一个“通用翻译官”（MCP Client）。它的工作是去发现这些标准工具，并把它们翻译成当前使用的大模型能听懂的私有格式（比如 OpenAI 的 Function Calling 格式）。
- **🧠 大模型 (LLM)**：它就像一个只管思考的大脑，只负责接收翻译好的指令、做决策并返回结果。**它对底层的 MCP 协议一无所知，也不需要知道**。无论底层接的是 MCP、私有插件还是其他协议，大模型接收到的永远是自己熟悉的调用格式。

正因为这种完美的解耦设计，带来了两个巨大的好处：

1. **对大模型厂商来说**：他们不需要为市面上成千上万的新工具去单独开发适配器，只要 MCP Host（宿主应用）端做好了翻译，任何支持 Function Calling 的模型都能无缝使用 MCP 工具。
2. **对开发者/用户来说**：你可以随意更换底层的大模型（比如今天用 GPT-4o，明天换成 Claude 3.5），而无需修改任何工具侧的代码，因为 MCP Client 会自动帮你完成不同模型的格式转换。

所以，MCP 本质上就是一个**专门为开发者和应用层设计的“万能插座”**，它把所有的兼容性脏活累活都揽在了自己手里，从而让大模型能够专心地做它最擅长的推理工作。
