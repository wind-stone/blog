# 如何开发自定义的 ESLint 规则

[[toc]]

## 创建插件和规则

详见：[开发属于自己的eslint插件，入门级别教程](https://www.kelen.cc/posts/eslint-plugin-development)

根据上文，可以创建一个简单的 ESLint 规则。

## 如何写规则

详见：[Custom Rules](https://eslint.org/docs/latest/extend/custom-rules)

### meta 规则的元数据

```js
// customRule.js
module.exports = {
    // 包含规则的元数据
    meta: {
        /**
         * 表示规则的类型，是 "problem""suggestion" 或 "layout" 之一：
         * - "problem"：规则用于识别会导致错误或可能导致混淆行为的代码。开发人员应将此问题视为需要解决的高度优先事项。
         * - "suggestion"：规则是确定可以以更好的方式完成的事情，但如果不更改代码，也不会发生错误。
         * - "layout"：该规则主要关心空格、分号、逗号和括号等所有决定代码外观（而不是代码的执行方式）的那部分。这些规则适用于 AST 中未指定的代码部分。
         */
        type: "suggestion",

        /**
         * 通常用于文档生成和工具的属性。对于核心规则是必需的，对于自定义规则是可选的。自定义规则可以根据需要在此处包含其他属性。
         */
        docs: {
            // 提供规则的简短说明。对于核心规则，这在【规则索引】中使用
            description: "Description of the rule",
            // 对于核心规则，这指定了 @eslint/js 中 recommended 的配置是否启用了规则。
            recommended: true,
            // 指定可以访问完整文档的 URL。代码编辑器经常使用它来提供有关突出显示的规则冲突的有用链接。
            url: ""
        },

        /**
         * 明确规则的可修复性。fixable 属性对于可修复规则是必需的。如果未指定此属性，则每当规则尝试生成修复时，ESLint 都会引发错误。如果规则不可修复，则省略 fixable 属性。
         * - 如果想要通过命令行上的 --fix 选项来自动修复规则报告的问题，则 fixable 的值应该为："code" 或 "whitespace"。
         */
        fixable: "code",

        /**
         * 指定规则是否可以返回建议（如果省略，则默认为 false）。
         * hasSuggestions 属性对于提供建议的规则是必需的。如果此属性未设置为 true，则每当规则尝试生成建议时，ESLint 都会引发错误。如果规则不提供建议，则省略 hasSuggestions 属性。
         */
        hasSuggestions: true,

        /**
         * 指定规则的配置，以便 ESLint 可以防止无效的规则配置，该选项的值的类型可以是 object | array | false。当规则具有选项时，这是必需的。
         */
        schema: [], // no options

        /**
         * 【可选】指示规则是否已被弃用。 如果规则尚未被弃用，则可以省略 deprecated 属性。
         */
        deprecated: false,

        /**
         * 【可选】如果规则已弃用，请指定替换规则。
         */
        replacedBy: [],

        /**
         * 【可选】定义规则的违规消息，用在 context.report() 方法里
         */
        messages: {
            // 提供规则的错误消息
            avoidName: "Avoid using variables named '{{ name }}'"
        }
    },
    create: function(context) {
        return {
            // callback functions
        };
    }
};
```

#### meta.schema

带有选项的规则必须指定`meta.schema`属性，该属性是规则选项的 JSON Schema 格式描述，ESLint 将使用它来验证配置选项并防止无效或意外的输入，然后再将它们传递给 `context.options`中的规则。

如果规则具有选项，则强烈建议您指定`meta.schema`用于验证选项。但是，可以通过设置`schema: false`来选择忽略选项验证，但不建议这样做，因为它会增加出现 bug 和错误的机会。

对于未指定`meta.schema`属性的规则，当传递任何选项时，ESLint 会引发错误。如果您的规则没有选项，请不要设置`schema: false`，而只需省略`schema`属性或使用 `schema: []`，这两者都会阻止传递任何选项。

验证规则的配置时，有五个步骤：

1. 如果规则配置不是数组，则值被包装到数组中（例如`"off"`变为`["off"]`）;如果规则配置是一个数组，则直接使用它。
2. ESLint 将规则配置数组的第一个元素验证为严重性（`"off"`/`"warn"`/`"error"`或`0`/`1`/`2`）
3. 如果严重性为`off`或`0`，则规则将被禁用并停止验证，同时忽略规则配置数组的任何其他元素。
4. 如果启用了该规则，则严重性之后数组的任何元素都将复制到`context.options`数组中（例如，`["warn", "never", { someOption: 5 }]`会导致`context.options = ["never", { someOption: 5 }]）`
5. The rule’s schema validation is run on the context.options array.

注意：这意味着规则的`schema`无法验证严重性。规则`schema`仅在规则配置中的严重性之后验证数组元素。规则无法知道它配置的严重性。

规则的`schema`有两种格式：

- JSON Schema 对象的数组
  - 每个元素都将针对`context.options`数组中的相同位置进行检查。
  - 如果`context.options`数组的元素少于`schema`，则忽略不匹配的`schema`
  - 如果`context.options`数组的元素多于`schema`，则验证将失败
  - 使用此格式有两个重要后果：
    - 用户不向你的规则提供选项，也是始终有效的（超出严重性）。
    - 如果指定一个空数组，则用户向规则提供任何选项（超出严重性）始终是错误的
- 一个完整的 JSON Schema 对象，用于验证`context.options`数组
  - `schema`应假定有一组选项进行验证，即使您的规则只接受一个选项也是如此。
  - 该`schema`可以任意复杂，因此您可以通过 oneOf、anyOf 等验证完全不同的潜在选项集。
  - 受支持的 JSON 模式版本是 Draft-04，因此一些较新的功能（如 if 或 $data）不可用。

例如，yoda 规则接受 "always" 或 "never" 的主要模式参数，以及带有可选属性 exceptRange 的额外选项对象：

```js
// Valid configuration:
// "yoda": "warn"
// "yoda": ["error"]
// "yoda": ["error", "always"]
// "yoda": ["error", "never", { "exceptRange": true }]
// Invalid configuration:
// "yoda": ["warn", "never", { "exceptRange": true }, 5]
// "yoda": ["error", { "exceptRange": true }, "never"]
module.exports = {
    meta: {
        schema: [
            {
                enum: ["always", "never"]
            },
            {
                type: "object",
                properties: {
                    exceptRange: { type: "boolean" }
                },
                additionalProperties: false
            }
        ]
    }
};
```

下面是等效的基于对象的`schema`：

```js
// Valid configuration:
// "yoda": "warn"
// "yoda": ["error"]
// "yoda": ["error", "always"]
// "yoda": ["error", "never", { "exceptRange": true }]
// Invalid configuration:
// "yoda": ["warn", "never", { "exceptRange": true }, 5]
// "yoda": ["error", { "exceptRange": true }, "never"]
module.exports = {
    meta: {
        schema: {
            type: "array",
            minItems: 0,
            maxItems: 2,
            items: [
                {
                    enum: ["always", "never"]
                },
                {
                    type: "object",
                    properties: {
                        exceptRange: { type: "boolean" }
                    },
                    additionalProperties: false
                }
            ]
        }
    }
};
```

对象格式的`schema`在允许的内容上可以更精确和更严格。例如，以下`schema`始终要求指定第一个选项（介于 0 和 10 之间的数字），但第二个选项是可选的，可以是显式设置了某些选项的对象，也可以是"off"或"strict"。

```js
// Valid configuration:
// "someRule": ["error", 6]
// "someRule": ["error", 5, "strict"]
// "someRule": ["warn", 10, { someNonOptionalProperty: true }]
// Invalid configuration:
// "someRule": "warn"
// "someRule": ["error"]
// "someRule": ["warn", 15]
// "someRule": ["warn", 7, { }]
// "someRule": ["error", 3, "on"]
// "someRule": ["warn", 7, { someOtherProperty: 5 }]
// "someRule": ["warn", 7, { someNonOptionalProperty: false, someOtherProperty: 5 }]
module.exports = {
    meta: {
        schema: {
            type: "array",
            minItems: 1, // Can't specify only severity!
            maxItems: 2,
            items: [
                {
                    type: "number",
                    minimum: 0,
                    maximum: 10
                },
                {
                    anyOf: [
                        {
                            type: "object",
                            properties: {
                                someNonOptionalProperty: { type: "boolean" }
                            },
                            required: ["someNonOptionalProperty"],
                            additionalProperties: false
                        },
                        {
                            enum: ["off", "strict"]
                        }
                    ]
                }
            ]
        }
    }
}
```

请记住，规则选项始终是一个数组，因此请注意不要在顶层为非数组类型指定`schema`。如果你的`schema`未在顶层指定数组，则用户永远无法启用您的规则，因为在启用规则时，他们的配置将始终无效。

下面是一个始终无法通过验证的示例架构：

```js
// Possibly trying to validate ["error", { someOptionalProperty: true }]
// but when the rule is enabled, config will always fail validation because the options are an array which doesn't match "object"
module.exports = {
    meta: {
        schema: {
            type: "object",
            properties: {
                someOptionalProperty: {
                    type: "boolean"
                }
            },
            additionalProperties: false
        }
    }
}
```

Note: If your rule schema uses JSON schema $ref properties, you must use the full JSON Schema object rather than the array of positional property schemas. This is because ESLint transforms the array shorthand into a single schema without updating references that makes them incorrect (they are ignored).

To learn more about JSON Schema, we recommend looking at some examples on the [JSON Schema website](https://json-schema.org/learn/miscellaneous-examples), or reading the free [Understanding JSON Schema](https://json-schema.org/understanding-json-schema) ebook.

### create 函数及参数 context

```js
// customRule.js
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Description of the rule",
            recommended: true,
            url: ""
        },
        ...
    },
    /**
     * create 方法返回一个包含了很多方法的对象，ESLint 在遍历 JavaScript 代码的抽象语法树（由 ESTree 定义的 AST）时会调用这些方法来“访问”遍历到的节点。
     * 规则可以使用当前节点及其周围的树来报告或修复问题。
     */
    create: function(context) {
        /**
         * context 对象具有如下属性：
         *
         * - id: string, 规则 ID
         * - filename: string， 与源码关联的文件名
         * - physicalFilename: string，当对文件进行 linting 时，它提供文件在磁盘上的完整路径，而不提供任何代码块信息。当对文本进行 linting 时，它会提供传递给 —stdin-filename 的值，如果未指定 -stdin-filename，则值为文本本身。
         * - cwd: string，传递给 Linter 的 cwd 选项（当前工作目录）。
         * - options: array，为此规则配置的选项的数组。此数组不包括规则的严重性
         * - sourceCode: object，一个 SourceCode 对象，可用于处理传递给 ESLint 的源代码（请参阅访问源代码）。
         * - settings: object，配置中的共享设置
         * - languageOptions: object，该对象每个属性的更多详细信息，详见：https://eslint.org/docs/latest/use/configure/language-options
         *      - sourceType: 'script' | 'module' | 'commonjs'，当前文件的模式。
         *      - ecmaVersion: number，用于解析当前文件的 ECMA 版本。
         *      - parser: object|string，eslint.config.js 里配置的用于解析当前文件的解析器或遗留配置的解析器名称。（在 .eslintrc.js 之类遗留的配置里，指的是解析器的名字）
         *      - parserOptions: object，为此文件配置的解析器选项。
         *      - globals: object，指定的全局变量。
         * - parserPath/parserOptions 都已弃用，请直接使用 languageOptions.parser/parserOptions
         *
         *
         * context 对象具有如下方法：
         *
         * - report: 报告代码中的问题，详见：https://eslint.org/docs/latest/extend/custom-rules#reporting-problems
         * - getCwd/getFilename/getPhysicalFilename/getSourceCode 都已弃用，请使用 context 下对应的属性
         *
         */
        return {
            /**
             * - 如果 key 是节点类型或选择器，则 ESLint 会在沿着 ESTree 向下移动时调用该访问函数。
             * - 如果 key 是节点类型或选择器再加上 :exit，则 ESLint 会在沿着 ESTree 向上移动时调用该访问函数。
             * - 如果 key 是事件名称，则 ESLint 将调用该处理程序函数 fn 进行代码路径分析。
             */
            key: function fn() {
                // 具体的处理逻辑及报告错误、修复及建议（见下节）
            }
        };
    }
};
```

### context.report 报告错误、修复及建议

#### 报告错误

```js
// customRule.js
module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Description of the rule",
            recommended: true,
            url: ""
        },
        fixable: "code",
        hasSuggestions: true,
        schema: [],
        messages: {
            avoidName: "Avoid using variables named '{{ name }}'"
        }
    },
    create: function(context) {
        return {
            key: function fn(node) {
                // ... 具体的判断逻辑


                // 编写自定义规则时使用的主要方法是 context.report()，它会发布警告或错误（取决于所使用的配置）。此方法接受单个参数，该参数是包含以下属性的对象：
                // 提示：最简单的示例是仅使用 node 和 message
                context.report({
                    messageId: "avoidName", // 消息的 ID，需要事先定义在 meta.messages 里

                    message: "Unexpected identifier: {{ identifier }}", // 问题消息，推荐使用 messageId 代替 message
                    data?: { // 定义 message 或 meta.messages 里可能用到的占位符数据。
                        identifier: node.name, // 供 message 里使用
                        name: node.name // 供 meta.messages 里使用
                    },

                    /**
                     * 指定问题的位置对象。如果同时指定了 loc 和 node，则使用 loc 而不是 node。注意，loc 和 node 必须要有一个
                     */
                    loc?: {
                        start: { // 问题起始位置的对象
                            line: number, // 问题开始的行号，从 1 开始
                            column: number, // 问题开始的列号，从 0 开始
                        },
                        end: { // 问题结束位置的对象
                            line: number, // 问题结束的行号，从 1 开始
                            column: number, // 问题技术的列号，从 0 开始
                        },
                    },

                    node?: object, // 可选，与问题相关的 AST 节点。如果 present 和 loc 都没指定，则将节点的的起始位置用作问题的位置。

                    /**
                     * 修复问题的函数
                     * 注意：meta.fixable 属性对于可修复规则是必需的。如果实现 fix 函数的规则未导出 meta.fixable 属性，则 ESLint 将抛出错误。
                     */
                    fix?: (fixer) => {
                        /**
                         * 修复问题的函数
                         * 注意：meta.fixable 属性对于可修复规则是必需的。如果实现 fix 函数的规则未导出 meta.fixable 属性，则 ESLint 将抛出错误。
                         *
                         * fixer 参数对象具有如下方法：
                         * - insertTextBefore(nodeOrToken, text)：在给定的节点或 token 之前插入文本
                         * - insertTextAfter(nodeOrToken, text)：在给定的节点或 token 之后插入文本。
                         * - insertTextBeforeRange(range, text)：在给定范围之前插入文本。
                         * - insertTextAfterRange(range, text)：在给定范围之后插入文本。
                         * - remove(nodeOrToken)：删除给定的节点或 token。
                         * - removeRange(range)：删除给定范围内的文本。
                         * - replaceText(nodeOrToken, text)：替换给定节点或 token 中的文本。
                         * - replaceTextRange(range, text)：替换给定范围内的文本。
                         *
                         * range 是包含两个子项的数组，包含了源码里的字符索引。第一个子项是 range 的开始索引（含），第二个子项是 range 的结束索引（不含）。每个节点或 token 都有一个 range 属性，用于标志他们所代表的源码范围。
                         */


                        /**
                         * fix() 函数可以返回以下值：
                         * - 一个 fixing 对象
                         * - 一个包含 fixing 对象的数组
                         * - 一个可枚举 fixing 对象的可迭代对象。也就是说 fix 函数可以是一个生成器。
                         *
                         * 如果创建一个返回多个 fixing 对象的 fix() 函数，则这些 fixing 对象不得重叠。
                         *
                         * 最佳的修复方法：
                         * 1. 避免任何可能【更改代码运行时行为并导致其停止工作】的修复。
                         * 2. 使修复尽可能小。不必要的大修复可能会与其他修复冲突，并阻止它们被应用。
                         * 3. 每条消息只能进行一次修复。这一条之所以是强制的，是因为您必须从 fix() 返回修复程序操作的结果。
                         * 4. 由于在应用第一轮修复后所有规则会再次运行，因此规则无需检查修复后的代码样式是否会导致另一个规则报告错误。比如，如果某一个修复是希望将对象的 key 用引号括起来，但不确定用户是更喜欢单引号还是双引号，则该修复可以选择任意一种，如果它猜错了，修复后的代码会自动报告错误并使用 引号规则 再次进行修复。
                         */
                        return ...;
                    },
                })
            }
        };
    }
};
```

#### 修复

```js
// customRule.js
module.exports = {
    meta: {
        // ...
        fixable: "code",
    },
    create: function(context) {
        return {
            key: function fn(node) {
                // ... 具体的判断逻辑
                context.report({
                    /**
                     * 修复问题的函数
                     * 注意：meta.fixable 属性对于可修复规则是必需的。如果实现 fix 函数的规则未导出 meta.fixable 属性，则 ESLint 将抛出错误。
                     */
                    fix?: (fixer) => {
                        /**
                         * 修复问题的函数
                         * 注意：meta.fixable 属性对于可修复规则是必需的。如果实现 fix 函数的规则未导出 meta.fixable 属性，则 ESLint 将抛出错误。
                         *
                         * fixer 参数对象具有如下方法：
                         * - insertTextBefore(nodeOrToken, text)：在给定的节点或 token 之前插入文本
                         * - insertTextAfter(nodeOrToken, text)：在给定的节点或 token 之后插入文本。
                         * - insertTextBeforeRange(range, text)：在给定范围之前插入文本。
                         * - insertTextAfterRange(range, text)：在给定范围之后插入文本。
                         * - remove(nodeOrToken)：删除给定的节点或 token。
                         * - removeRange(range)：删除给定范围内的文本。
                         * - replaceText(nodeOrToken, text)：替换给定节点或 token 中的文本。
                         * - replaceTextRange(range, text)：替换给定范围内的文本。
                         *
                         * range 是包含两个子项的数组，包含了源码里的字符索引。第一个子项是 range 的开始索引（含），第二个子项是 range 的结束索引（不含）。每个节点或 token 都有一个 range 属性，用于标志他们所代表的源码范围。
                         */


                        /**
                         * fix() 函数可以返回以下值：
                         * - 一个 fixing 对象
                         * - 一个包含 fixing 对象的数组
                         * - 一个可枚举 fixing 对象的可迭代对象。也就是说 fix 函数可以是一个生成器。
                         *
                         * 如果创建一个返回多个 fixing 对象的 fix() 函数，则这些 fixing 对象不得重叠。
                         *
                         * 最佳的修复方法：
                         * 1. 避免任何可能【更改代码运行时行为并导致其停止工作】的修复。
                         * 2. 使修复尽可能小。不必要的大修复可能会与其他修复冲突，并阻止它们被应用。
                         * 3. 每条消息只能进行一次修复。这一条之所以是强制的，是因为您必须从 fix() 返回修复程序操作的结果。
                         * 4. 由于在应用第一轮修复后所有规则会再次运行，因此规则无需检查修复后的代码样式是否会导致另一个规则报告错误。比如，如果某一个修复是希望将对象的 key 用引号括起来，但不确定用户是更喜欢单引号还是双引号，则该修复可以选择任意一种，如果它猜错了，修复后的代码会自动报告错误并使用 引号规则 再次进行修复。
                         */
                        return ...;
                    },
                })
            }
        };
    }
};
```

#### 建议

```js
// customRule.js
module.exports = {
    meta: {
        // ...
        messages: {
            unnecessaryEscape: "Unnecessary escape character: \\{{character}}.",
            removeEscape: "Remove the `\\`. This maintains the current functionality.",
            removeEscapeWithPlaceholder: "Remove `\\` before {{character}}.",
            escapeBackslash: "Replace the `\\` with `\\\\` to include the actual backslash character."
        },
        hasSuggestions: true
    },
    create: function(context) {
        return {
            key: function fn(node) {
                // ... 具体的判断逻辑
                context.report({
                    node: node,
                    message: "Unnecessary escape character: \\{{character}}.",
                    data: { character }, // data for the unnecessaryEscape overall message
                    /**
                     * 提供修复建议
                     * 重要：meta.hasSuggestions 属性对于提供建议的规则是必需的。如果规则尝试生成建议但未导出此属性，则 ESLint 将引发错误。
                     *
                     * 在某些情况下，修复不适合自动应用，例如，如果修复可能会更改功能，或者根据实现意图有多种有效的方法来修复规则（请参阅上面列出的应用修复的最佳实践）。在这些情况下，context.report() 上有一个可选的 suggest 选项，它允许其他工具（如编辑器）公开帮助用户手动应用建议。
                     *
                     * 若要提供建议，请在 report 参数中使用 suggest 选项，其值是个建议对象数组。建议对象表示可以应用的单个建议，并且需要一个描述应用建议将执行什么操作的 desc 键字符串或一个 messageId 的 key，以及一个 fix 键，该键是定义建议结果的函数。此 fix 函数遵循与常规修复相同的 API（如上一节修复中所述）。
                     *
                     * 注意：建议将作为“独立更改”应用，而不会触发多通道修复。每个建议都应侧重于代码中的单一更改，并且不应尝试遵循用户定义的样式。例如，如果建议将新语句添加到代码库中，则它不应尝试匹配正确的缩进或符合用户对分号是否存在/不存在的偏好。当用户触发多通道自动修复时，所有这些都可以通过多通道自动修复来纠正。
                     *
                     * 建议的最佳做法：
                     * 1. 不要试图做太多事情，并建议进行大规模的重构，这可能会引入很多重大变化。
                     * 2. 如上所述，不要试图遵循用户定义的样式。
                     */
                    suggest: [
                        {
                            desc: 'Remove the `\\`. This maintains the current functionality.',
                            fix: function(fixer) {
                                return fixer.removeRange(range);
                            }
                        },
                        {
                            desc: "Replace the `\\` with `\\\\` to include the actual backslash character.",
                            fix: function(fixer) {
                                return fixer.insertTextBeforeRange(range, "\\");
                            }
                        }

                        // 可以改用 messageId，而不是使用 desc 键来提供建议。
                        {
                            messageId: "removeEscape", // suggestion messageId
                            fix: function(fixer) {
                                return fixer.removeRange(range);
                            }
                        },
                        {
                            messageId: "escapeBackslash",
                            fix: function(fixer) {
                                return fixer.insertTextBeforeRange(range, "\\");
                            }
                        }
                        {
                            messageId: "removeEscapeWithPlaceholder",
                            // 你还可以在建议消息中使用占位符。请注意，您必须在建议对象里单独提供 data。建议消息不能使用整个错误 data 中的属性。
                            data: { character }, // data for the removeEscapeWithPlaceholder suggestion message
                            fix: function(fixer) {
                                return fixer.removeRange(range);
                            }
                        },
                    ]
                })
            }
        };
    }
};
```

### 访问传递给规则的选项

某些规则需要选项才能正常运行。这些选项显示在配置（`.eslintrc`、命令行界面或注释）中。例如：

```js
{
    "quotes": ["error", "double"]
}
```

此示例中的`quotes`规则有一个选项`"double"`（`"error"`是错误级别）。您可以使用`context.options`检索规则的选项，`context.options`是一个数组，包含规则的每个已配置选项。在这种情况下，`context.options[0]`将包含`"double"`：

```js
module.exports = {
    meta: {
        schema: [
            {
                enum: ["single", "double", "backtick"]
            }
        ]
    },
    create: function(context) {
        var isDouble = (context.options[0] === "double");

        // ...
    }
};
```

由于`context.options`只是一个数组，因此您可以使用它来确定已传递的选项数量，以及检索实际选项本身。请记住，错误级别不是`context.options`的一部分，因为无法从规则内部知道或修改错误级别。

使用选项时，请确保您的规则具有一些逻辑默认值，以防未提供这些选项。

带有选项的规则必须指定`meta.schema`。

### 访问源代码

SourceCode 对象是用于获取正在 lint 检查的源代码更多信息的主要对象。您可以随时使用`context.sourceCode`属性检索 SourceCode 对象：

```js
module.exports = {
    create: function(context) {
        var sourceCode = context.sourceCode;

        // ...
    }
};
```

有了 SourceCode 的实例后，可以对其使用如下这些方法来处理代码（不包含之后要说明的访问 token、访问原文本、访问注释等方法）。

- `isSpaceBetween(nodeOrToken, nodeOrToken)`：满足以下任一条件，则返回 true，返回第一个节点的最后一个标记和第二个节点的第一个标记。
  - 如果两个参数都是 token，则他们之间存在空格字符
  - 如果两个参数都是 node，则第一个 node 的最后一个 token 和 第二个 node 的第一个 token 之间存在空格字符
  - 如果第一个参数是 token，第二个参数是 node，则 token 和 node 的第一个 token 之间存在空格字符
  - 如果第一个参数是 node，第二个参数是 token，则 node 的最后一个 token 与第二个参数 token 之间存在空格字符
- `getNodeByRangeIndex(index)`：Returns the deepest node in the AST containing the given source index.
- `getLocFromIndex(index)`: Returns an object with line and column properties, corresponding to the location of the given source index. line is 1-based and column is 0-based.
- `getIndexFromLoc(loc)`: Returns the index of a given location in the source code, where loc is an object with a 1-based line key and a 0-based column key.
- `commentsExistBetween(nodeOrToken1, nodeOrToken2)`：如果两个节点或 token 之间存在注释，则返回`true`。
- `getAncestors(node)`：返回给定节点的祖先数组，从 AST 的根开始，一直到给定节点的直接父节点。此数组不包括给定节点本身。
- `getDeclaredVariables(node)`：返回给定节点声明的变量列表。此信息可用于跟踪对变量的引用。
  - 如果节点是 VariableDeclaration，则返回声明中声明的所有变量。
  - 如果节点是 VariableDeclarator，则返回在声明器中声明的所有变量。
  - 如果节点是 FunctionDeclaration 或 FunctionExpression，则除了函数参数的变量外，还将返回函数名称的变量。
  - 如果节点是 ArrowFunctionExpression，则返回参数的变量。
  - 如果节点是 ClassDeclaration 或 ClassExpression，则返回类名的变量。
  - 如果节点是 CatchClause，则返回异常的变量。
  - 如果节点是 ImportDeclaration，则返回其所有说明符的变量。
  - 如果节点是 ImportSpecifier、ImportDefaultSpecifier 或 ImportNamespaceSpecifier，则返回声明的变量。
  - 否则，如果节点未声明任何变量，则返回一个空数组。
- `getScope(node)`: Returns the scope of the given node. This information can be used to track references to variables.
- `markVariableAsUsed(name, refNode)`: Marks a variable with the given name in a scope indicated by the given reference node as used. This affects the no-unused-vars rule. Returns true if a variable with the given name was found and marked as used, otherwise false.

除了以上的方法（以及之后要说明的访问 token、访问原文本、访问注释等方法），你还可以访问一些属性：

- `hasBOM`：（boolean） 指示源代码是否具有 Unicode BOM 的标志。
- `text`：（string） 正在被 lint 的代码的全部文本。Unicode BOM 已从此文本中删除。
- `ast`：（object） Program node of the AST for the code being linted.
- `scopeManager`: ScopeManager object of the code.
- `visitorKeys`: (object) Visitor keys to traverse this AST.
- `parserServices`: (object) Contains parser-provided services for rules. The default parser does not provide any services. However, if a rule is intended to be used with a custom parser, it could use parserServices to access anything provided by that parser. (For example, a TypeScript parser could provide the ability to get the computed type of a given node.)
- `lines`: (array) Array of lines, split according to the specification’s definition of line breaks.

每当需要获取有关正在检查的代码的更多信息时，都应使用 SourceCode 对象。

#### 访问 token

- `getFirstToken(node, skipOptions)`：返回代表给定节点的第一个 token。
- `getFirstTokens(node, countOptions)`：返回代表给定节点的前 count 个 token。
- `getLastToken(node, skipOptions)`：返回代表给定节点的最后一个 token。
- `getLastTokens(node, countOptions)`：返回代表给定节点的最后 count 个 token。
- `getTokenBefore(nodeOrToken, skipOptions)`：返回给定节点或 token 之前的第一个 token。
- `getTokenAfter(nodeOrToken, skipOptions)`：返回给定节点或 token 之后的第一个 token。
- `getTokensBefore(nodeOrToken, countOptions)`：返回给定节点或 token 之前的 count 个 token。
- `getTokensAfter(nodeOrToken, countOptions)`：返回给定节点或 token 之后的 count 个 token。
- `getFirstTokenBetween(nodeOrToken1, nodeOrToken2, skipOptions)`：返回两个节点或 token 之间的第一个 token。
- `getLastTokenBetween(nodeOrToken1, nodeOrToken2, skipOptions)`：返回两个节点或 toekn 之间的最后一个 token。
- `getFirstTokensBetween(nodeOrToken1, nodeOrToken2, countOptions)`：返回两个节点或 token 之间的前 count 个 token。
- `getLastTokensBetween(nodeOrToken1, nodeOrToken2, countOptions)`：返回两个节点或 token 之间的最后 count 个 token。
- `getTokens(node)`：返回给定节点的所有 token。
- `getTokensBetween(nodeOrToken1, nodeOrToken2)`返回两个节点之间的所有 token。
- `getTokenByRangeStart(index, rangeOptions)`：Returns the token whose range starts at the given index in the source.

`skipOptions`是一个有 3 个属性的对象，`skip`、`includeComments`和`filter`。默认值为`{ skip: 0, includeComments: false, filter: null }`。

- `skip`：（number）正整数，跳过的 token 数量。如果同时给出`filter`选项，则它不会将过滤的 token 计为跳过的 token。
- `includeComments`：（boolean）结果中的 token 是否包含注释 token。
- `filter(token)`：筛选函数，函数的第一个参数是要判断的 token。如果函数返回`false`，则结果将排除该 token。

`countOptions`是一个具有 3 个属性的对象，`count`、`includeComments`和`filter`。默认值为`{ count: 0, includeComments: false, filter: null }`。

- `count`：（number）正整数，返回 token 的最大数量。
- `includeComments`：（boolean）结果中的 token 是否包含注释 token。
- `filter(token)`：筛选函数，函数的第一个参数是要判断的 token。如果函数返回`false`，则结果将排除该 token。

`rangeOptions`是一个具有 1 个属性`includeComments`的对象。默认值为`{ includeComments: false }`。

- `includeComments`：（boolean）结果中的 token 是否包含注释 token。

#### 访问原文本

- `sourceCode.getText(node)`：返回给定节点的源代码。省略 node 参数可以获取整个源代码。

如果你的规则需要获取要使用的实际 JavaScript 源代码，请使用`sourceCode.getText()`方法。此方法的工作原理如下：

```js
// get all source
var source = sourceCode.getText();

// get source for just this AST node
var nodeSource = sourceCode.getText(node);

// get source for AST node plus previous two characters
var nodeSourceWithPrev = sourceCode.getText(node, 2);

// get source for AST node plus following two characters
var nodeSourceWithFollowing = sourceCode.getText(node, 0, 2);
```

通过这种方式，当 AST 没有提供适当的数据（例如逗号、分号、括号等的位置）时，您可以在 JavaScript 文本本身中查找模式。

#### 访问注释

虽然从技术上讲，注释不是 AST 的一部分，但 ESLint 提供了如下方法来访问注释。

- `sourceCode.getAllComments()`：返回源代码中所有注释的数组。
- `sourceCode.getCommentsBefore(nodeOrToken)`：返回一个注释 token 数组，这些注释 token 直接出现在给定节点或 token 之前。
- `sourceCode.getCommentsAfter(nodeOrToken)`：返回一个注释 token 数组，这些注释 token 直接出现在给定节点或 token 之后。
- `sourceCode.getCommentsInside(node)`：返回给定节点内所有注释 token 的数组。

`sourceCode.getCommentsInside()`对于需要检查与给定节点或 token 相关的注释的规则非常有用。

请记住，这些方法的结果是按需计算的。

您还可以使用`includeComments`选项通过 sourceCode 的许多访问 token 的方法来访问注释。

#### 访问变量作用域

`sourceCode.getScope(node)`方法返回给定节点的作用域。它是一种有用的方法，用于查找给定范围内的变量的信息以及它们如何在其他作用域中使用。

##### 作用域类型

下表包含 AST 节点类型列表以及它们对应的作用域类型。有关作用域类型的更多信息，请参阅[Scope 对象文档](https://eslint.org/docs/latest/extend/scope-manager-interface#scope-interface)。

| AST Node Type           | Scope Type范围类型 |
| ----------------------- | ------------------ |
| Program                 | global             |
| FunctionDeclaration     | function           |
| FunctionExpression      | function           |
| ArrowFunctionExpression | function           |
| ClassDeclaration        | class              |
| ClassExpression         | class              |
| BlockStatement ※1       | block              |
| SwitchStatement ※1      | switch             |
| ForStatement ※2         | for                |
| ForInStatement ※2       | for                |
| ForOfStatement ※2       | for                |
| WithStatement           | with               |
| CatchClause             | catch              |
| others                  | ※3                 |

※1 仅当配置的解析器提供块作用域的功能时。如果`parserOptions.ecmaVersion`不小于 6，则默认解析器提供块作用域功能。

※2 仅当 for 语句将迭代变量定义为块作用域的变量 （例如，`for (let i = 0;;) {}`）。

※3 （具有自己的作用域的）最近祖先节点的作用域。如果最近的祖先节点有多个作用域，则选择最内层的作用域（例如，如果 Program.sourceType 为 "module"，则 Program 节点具有 global 作用域和 module 作用域。最内层的作用域是 module 作用域。）

##### 作用域变量

`scope.variables`属性是一个包含了[变量对象](https://eslint.org/docs/latest/extend/scope-manager-interface#variable-interface)的数组。这些是在当前作用域中声明的变量。你可以使用这些变量对象来跟踪整个模块中对变量的引用。

在每个变量对象内部，`variable.references`属性都包含了一个[Reference 对象](https://eslint.org/docs/latest/extend/scope-manager-interface#reference-interface)的数组。Reference 对象数组包含了在模块的源代码中引用变量的所有位置。

此外，在每个变量对象内部，`variable.defs`属性包含了一个[Definition 对象](https://eslint.org/docs/latest/extend/scope-manager-interface#definition-interface)数组。你可以使用 Definitions 来查找定义变量的位置。

全局变量具有以下额外的属性：

- `variable.writeable`：（boolean | undefined） 如果为`true`，则可以为此全局变量分配任意值。如果`false`，则此全局变量是只读的。
- `variable.eslintExplicitGlobal`：（boolean | undefined）如果为`true`，则此全局变量由源代码文件中的`/* globals */`指令注释定义。
- `variable.eslintExplicitGlobalComments`：（Comment[] | undefined） 在源代码文件中定义此全局变量的`/* globals */`指令注释数组。如果没有`/* globals */`指令注释，则此属性为`undefined`。
- `variable.eslintImplicitGlobalSetting`：（"readonly" | "writable" | undefined）配置文件中配置的值。如果有`/* globals */`指令注释，这可能与 `variable.writeable`不同。

有关使用`sourceCode.getScope()`跟踪变量的示例，请参阅以下内置规则的源代码：

- [no-shadow](https://github.com/eslint/eslint/blob/main/lib/rules/no-shadow.js)：在 Program 节点调用`sourceCode.getScope()`并检查所有子作用域，以确保变量名称不会在较低作用域中重复使用。
- [no-redeclare](https://github.com/eslint/eslint/blob/main/lib/rules/no-redeclare.js)：在每个作用域调用`sourceCode.getScope()`以确保变量不会在同一作用域中声明两次。

#### 将变量标记为已使用

某些 ESLint 规则（例如[no-unused-vars](https://eslint.org/docs/latest/rules/no-unused-vars)）会检查是否已使用变量。ESLint 本身只知道变量访问的标准规则，因此自定义访问变量的方式可能不会注册为“已使用”。

为了帮助解决这个问题，你可以使用`sourceCode.markVariableAsUsed()`方法。此方法有两个参数：要标记为已使用的变量的名称和一个可选的引用节点，该节点指示你正在使用的范围。下面是一个示例：

```js
module.exports = {
    create: function(context) {
        var sourceCode = context.sourceCode;

        return {
            ReturnStatement(node) {

                // look in the scope of the function for myCustomVar and mark as used
                sourceCode.markVariableAsUsed("myCustomVar", node);

                // or: look in the global scope for myCustomVar and mark as used
                sourceCode.markVariableAsUsed("myCustomVar");
            }
        }
        // ...
    }
};
```

在这里，`myCustomVar`变量被标记为相对于 ReturnStatement 节点使用，这意味着 ESLint 将从最接近该节点的作用域开始搜索。如果省略第二个参数，则使用顶级作用域。（对于 ESM 文件，顶级作用域是模块作用域；对于 CommonJS 文件，顶级作用域是第一个函数作用域。）

#### 访问代码路径

ESLint 在遍历 AST 时会分析代码路径。你可以通过与代码路径有关的七个事件来访问代码路径对象。有关详细信息，请参阅[代码路径分析](https://eslint.org/docs/latest/extend/code-path-analysis)。
