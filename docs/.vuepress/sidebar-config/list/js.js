module.exports = {
    '/js/': [
        {
            title: '数据类型',
            collapsable: false,
            children: [
                'data-types/',
                'data-types/number/',
                'data-types/number/floating',
                'data-types/string/',
                'data-types/object/',
                'data-types/array/',
                'data-types/function/',
                'data-types/date/',
                'data-types/reg-exp/',
                'data-types/type-conversion',
            ]
        },
        {
            title: '执行机制',
            collapsable: false,
            children: [
                'execution-mechanism/',
                'execution-mechanism/execution-context',
                'execution-mechanism/prototype',
                'execution-mechanism/this',
                'execution-mechanism/event-loop'
            ]
        },
        {
            title: '错误处理/日志/调试',
            collapsable: false,
            children: [
                'error-handling/',
                'error-handling/try-catch',
                'error-handling/browser-error-handling',
                'error-handling/debug/',
                'error-handling/debug/console/',
                'error-handling/log',
            ]
        },
        {
            title: '运算符',
            collapsable: false,
            children: [
                'operators/'
            ]
        },
        {
            title: 'TypeScript',
            collapsable: false,
            children: [
                'typescript/',
                'typescript/data-type',
                'typescript/module',
                'typescript/declaration-files',
                'typescript/tsconfig-json',
                'typescript/complition',
                'typescript/practice'
            ]
        },
        {
            title: 'JS 代码片段',
            collapsable: false,
            children: [
                'code-snippet/',
                'code-snippet/browser/',
                'code-snippet/browser/url',
                'code-snippet/server/',
                'code-snippet/validate/'
            ]
        },
        {
            title: '未分类内容',
            collapsable: false,
            children: [
                'unclassified/',
                'unclassified/functional-programming',
                'unclassified/pitfall'
            ]
        },
    ],
};
