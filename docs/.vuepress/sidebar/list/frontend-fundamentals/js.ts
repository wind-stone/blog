export default {
    '/frontend-fundamentals/js/': [
        {
            text: '数据类型',
            prefix: '/frontend-fundamentals/js/data-types',
            children: [
                '',
                'number/',
                'number/floating',
                'string/',
                'object/',
                'array/',
                'function/',
                'date/',
                'reg-exp/',
                'type-conversion',
            ],
        },
        {
            text: '执行机制',
            prefix: '/frontend-fundamentals/js/execution-mechanism',
            children: ['', 'execution-context', 'prototype', 'this', 'event-loop'],
        },
        {
            text: '错误处理/日志/调试',
            prefix: '/frontend-fundamentals/js/error-handling',
            children: [
                'debug/',
                'log',
                {
                    text: '错误处理',
                    children: ['', 'try-catch', 'browser-error-handling'],
                },

                {
                    text: '控制台方法',
                    prefix: 'debug/console',
                    children: ['', 'console-log-event'],
                },
            ],
        },
        {
            text: '运算符',
            prefix: '/frontend-fundamentals/js/operators',
            children: [''],
        },
        {
            text: 'WebAssemply',
            prefix: '/frontend-fundamentals/js/web-assembly',
            children: [''],
        },
        {
            text: '未分类内容',
            prefix: '/frontend-fundamentals/js/unclassified',
            children: ['', 'functional-programming', 'pitfall'],
        },
    ],
};
