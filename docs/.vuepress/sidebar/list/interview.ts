export default {
    // 大模型
    '/interview/llm': [
        {
            text: '大模型-理论知识',
            prefix: '/interview/llm/knowledge',
            children: ['rag/'],
        },
        {
            text: '大模型-前端交互',
            prefix: '/interview/llm/frontend',
            children: [
                'frontend-skills-stack',
                'stream-response-and-abort',
                'multi-devices-context-sync',
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

        // {
        //     text: '面试题目',
        //     prefix: '/interview',
        //     children: ['algorithm/interview/', 'nodejs/'],
        // },
    ],

    // 浏览器
    '/interview/browser': [
        {
            text: '浏览器基础',
            prefix: '/interview/browser',
            children: ['inter-page-communication'],
        },
        {
            text: '浏览器渲染机制',
            prefix: '/interview/browser',
            children: [
                'the-process-of-input-an-url',
                'script-defer-async',
                'the-reason-for-the-position-of-css-and-js-in-html',
            ],
        },
        {
            text: 'HTML & DOM',
            prefix: '/interview/browser',
            children: ['the-difference-between-dom-property-and-html-attribute', 'event-delegation', 'flip-ul'],
        },
        {
            text: 'CSS',
            prefix: '/interview/browser/css',
            children: [
                {
                    text: '布局',
                    prefix: 'layout',
                    children: ['footer-attach-to-the-bottom', 'two-columns-layout'],
                },
                {
                    text: 'position 定位',
                    prefix: 'position',
                    children: ['position-question-1', 'position-question-2'],
                },
                'hide-elements-methods',
                'self-fit-square',
            ],
        },
        {
            text: '网络',
            prefix: '/interview/browser/network',
            children: [''],
        },
    ],

    // JavaScript
    '/interview/javascript': [
        {
            text: '性能优化',
            prefix: '/interview/javascript/performance-optimization',
            children: ['debounce-throttle/'],
        },
        {
            text: 'Node.js',
            prefix: '/interview/javascript/nodejs',
            children: [''],
        },
        {
            text: '专题',
            prefix: '/interview/javascript/topic',
            children: ['large-file-upload'],
        },
    ],

    // 前端工程化
    '/interview/front-end-engineering': [
        {
            text: '包管理',
            prefix: '/interview/front-end-engineering/package-management',
            children: ['pnpm'],
        },
        {
            text: '框架/库',
            prefix: '/interview/front-end-engineering/library',
            children: ['vue'],
        },
    ],

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
                    children: ['repeat-invoke-functions-with-times'],
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

    // 数据结构+算法
    '/interview/algorithm': [
        {
            text: '数据结构',
            prefix: '/interview/algorithm/data-structure',
            children: ['heap/', 'stack-queue/'],
        },
        {
            text: '基础算法',
            prefix: '/interview/algorithm',
            children: [
                {
                    text: '排序',
                    prefix: 'sorting-algorithm',
                    children: ['', 'bubble-sort/', 'selection-sort/', 'insertion-sort/', 'merge-sort/', 'quick-sort/'],
                },
            ],
        },
        {
            text: '算法题',
            prefix: '/interview/algorithm/interview',
            children: [
                {
                    text: '二分搜索',
                    prefix: 'binary-search',
                    children: ['', 'binary-search'],
                },
                'fibonacci-sequence',
                'the-all-nodes-of-binary-tree',
                'the-self-closing-string',
            ],
        },
        {
            text: 'LeetCode',
            prefix: '/interview/algorithm/interview/leetcode',
            children: ['kth-largest-element-in-an-array', 'partition-array-into-three-parts-with-equal-sum'],
        },
    ],
};
