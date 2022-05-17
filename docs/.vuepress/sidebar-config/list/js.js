module.exports = {
    '/js/': [
        {
            text: '数据类型',
            children: [
                '/js/data-types/',
                '/js/data-types/number/',
                '/js/data-types/number/floating',
                '/js/data-types/string/',
                '/js/data-types/object/',
                '/js/data-types/array/',
                '/js/data-types/function/',
                '/js/data-types/date/',
                '/js/data-types/reg-exp/',
                '/js/data-types/type-conversion',
            ]
        },
        {
            text: '执行机制',
            children: [
                '/js/execution-mechanism/',
                '/js/execution-mechanism/execution-context',
                '/js/execution-mechanism/prototype',
                '/js/execution-mechanism/this',
                '/js/execution-mechanism/event-loop'
            ]
        },
        {
            text: '错误处理/日志/调试',
            children: [

                '/js/error-handling/debug/',
                '/js/error-handling/log',

                {
                    text: '错误处理',
                    children: [
                        '/js/error-handling/',
                        '/js/error-handling/try-catch',
                        '/js/error-handling/browser-error-handling',
                    ]
                },

                {
                    text: '控制台方法',
                    children: [
                        '/js/error-handling/debug/console/',
                        '/js/error-handling/debug/console/console-log-event',
                    ]
                },
            ]
        },
        {
            text: '运算符',
            children: [
                '/js/operators/'
            ]
        },
        {
            text: 'WebAssemply',
            children: [
                '/js/web-assembly/',
            ]
        },
        {
            text: '未分类内容',
            children: [
                '/js/unclassified/',
                '/js/unclassified/functional-programming',
                '/js/unclassified/pitfall',
                '/js/unclassified/react'
            ]
        },
    ],
};
