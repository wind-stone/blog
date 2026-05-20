# 模型私有 Function calling 示例

在 MCP 出现之前，各大模型厂商（如 OpenAI、Google、Anthropic 等）都有自己私有的 Function Calling 标准，参数结构和返回格式各不相同。

虽然各大厂商在定义工具（Function/Tool）时，底层的参数描述都采用了通用的 **JSON Schema** 标准（即如何描述一个字符串、数字或枚举），但在**请求（Request）**和**响应（Response）**的 API 结构上，OpenAI、Anthropic (Claude) 和 Google (Gemini) 确实有着明显的差异。

为了让你直观地感受到这些不同，我们以同一个“查询天气”的工具为例，看看这三大厂商具体的格式区别：

### 1. OpenAI：`tools` 数组与 `tool_calls` 响应

OpenAI 目前采用标准的 `tools` 数组来传入工具定义，并在响应中通过 `tool_calls` 返回调用指令。

- **请求时（定义工具）：** 必须包裹在 `type: "function"` 的外壳中。

```json
// OpenAI 的请求格式
{
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "获取指定城市的天气",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": { "type": "string", "description": "城市名称" }
                    },
                    "required": ["city"]
                }
            }
        }
    ]
}
```

- **响应时（模型返回）：** 返回一个 `tool_calls` 数组，且参数 `arguments` 是一个**转义后的 JSON 字符串**。

```json
// OpenAI 的响应格式
{
    "role": "assistant",
    "content": null,
    "tool_calls": [
        {
            "id": "call_abc123",
            "type": "function",
            "function": {
                "name": "get_weather",
                "arguments": "{\"city\": \"北京\"}" // 注意：这里是字符串，需要手动 JSON.parse
            }
        }
    ]
}
```

### 2. Anthropic (Claude)：`input_schema` 与 `tool_use` 内容块

Claude 的格式更加扁平化，去掉了 `type: "function"` 的嵌套，并且响应结构与 OpenAI 完全不同。

- **请求时（定义工具）：** 直接使用 `input_schema` 字段，而不是 `parameters`。

```json
// Claude 的请求格式
{
    "tools": [
        {
            "name": "get_weather",
            "description": "获取指定城市的天气",
            "input_schema": {
                // 注意：字段名是 input_schema
                "type": "object",
                "properties": {
                    "city": { "type": "string", "description": "城市名称" }
                },
                "required": ["city"]
            }
        }
    ]
}
```

- **响应时（模型返回）：** 工具调用作为 `content` 数组中的一个独立对象存在，类型为 `tool_use`，且参数 `input` 直接就是一个**原生的 JSON 对象**。

```json
// Claude 的响应格式
{
    "role": "assistant",
    "content": [
        {
            "type": "tool_use", // 注意：类型标识在这里
            "id": "toolu_xyz789",
            "name": "get_weather",
            "input": { "city": "北京" } // 注意：这里直接是对象，不需要 JSON.parse
        }
    ]
}
```

### 3. Google (Gemini)：`functionDeclarations`

Google 在术语上与其他两家略有不同，它通常使用 `functionDeclarations` 来定义工具。

- **请求时（定义工具）：** 核心字段是 `functionDeclarations`。

```json
// Gemini 的请求格式
{
    "tools": [
        {
            "functionDeclarations": [
                // 注意：字段名是 functionDeclarations
                {
                    "name": "get_weather",
                    "description": "获取指定城市的天气",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "city": { "type": "string", "description": "城市名称" }
                        },
                        "required": ["city"]
                    }
                }
            ]
        }
    ]
}
```

### 总结对比

| 维度           | OpenAI (GPT)                  | Anthropic (Claude)     | Google (Gemini)                |
| :------------- | :---------------------------- | :--------------------- | :----------------------------- |
| **请求字段名** | `tools[].function.parameters` | `tools[].input_schema` | `tools[].functionDeclarations` |
| **响应结构**   | `message.tool_calls[]`        | `content[].tool_use`   | `candidates[].functionCall`    |
| **参数格式**   | **JSON 字符串** (需解析)      | **原生 JSON 对象**     | 通常为原生对象                 |

正是因为这些在字段命名、嵌套层级以及数据类型上的不一致，导致开发者如果想同时兼容这三家模型，就需要写大量的适配代码（胶水代码）。而 MCP 的出现，正是为了抹平这些底层协议差异，让开发者用一套标准就能对接所有大模型。
