export default {
    // 编码
    '/interview/coding': [
        {
            text: '基础 API 使用',
            prefix: '/interview/coding/basic-api-usage',
            children: [
                {
                    text: '数据类型',
                    prefix: 'data-type',
                    children: [
                        'typeof',
                        'the-value-of-the-params-passed-to-function',
                        {
                            text: '数组操作',
                            prefix: 'array-operation',
                            children: [
                                'array-elements-deduplication',
                                'flat-array-elements-and-deduplicate',
                                'merge-sorted-array',
                            ],
                        },
                    ],
                },
                {
                    text: '数据结构',
                    prefix: 'data-structure',
                    children: ['brackets-closed-in-string'],
                },
                {
                    text: '执行上下文',
                    prefix: 'execution-context',
                    children: [
                        {
                            text: '变量',
                            prefix: 'variables',
                            children: ['variable-promotion'],
                        },
                        {
                            text: '调用栈',
                            prefix: 'call-stack',
                            children: ['function-call-stack'],
                        },
                        {
                            text: '闭包',
                            prefix: 'closure',
                            children: ['closure-input', 'modify-closure'],
                        },
                        {
                            text: 'new 操作符',
                            prefix: 'new',
                            children: ['new-operator'],
                        },
                        {
                            text: '原型',
                            prefix: 'prototype',
                            children: [
                                'prototype-extend-input',
                                'prototype-input',
                                'the-relationship-between-and-constructor-prototype',
                            ],
                        },
                        {
                            text: '作用域',
                            prefix: 'scope',
                            children: ['concept', 'var-scope'],
                        },
                        {
                            text: 'this',
                            prefix: 'this',
                            children: ['this-input'],
                        },
                    ],
                },

                {
                    text: 'ES6',
                    prefix: 'es6',
                    children: ['synchronous-event-listener-with-proxy'],
                },
                {
                    text: '事件循环',
                    prefix: 'event-loop',
                    children: ['repeat-invoke-functions-with-times', 'microtask-by-await'],
                },
                {
                    text: 'polyfill',
                    prefix: 'polyfill',
                    children: ['array-prototype-flat', 'promise-race-and-allsettled'],
                },
                'create-a-random-valid-hex-color',
                'rgb-to-hex',
                'variable-naming-style',
            ],
        },
        {
            text: '编码设计',
            prefix: '/interview/coding/program-design',
            children: [
                'deep-clone',
                'event-emitter',
                {
                    text: '最大并发控制',
                    prefix: 'max-parallel-control',
                    children: ['max-parallel-fn-execute-control', 'max-parallel-request-count-control'],
                },
            ],
        },
    ],
};
