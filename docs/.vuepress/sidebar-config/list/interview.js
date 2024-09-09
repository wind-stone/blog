module.exports = {
    '/interview': [
        {
            text: '面试题目',
            children: [
                '/interview/browser/',
                '/interview/css/',
                '/interview/algorithm/interview/',
                '/interview/nodejs/'
            ]
        },
        {
            text: 'JS 面试题',
            children: [
                {
                    text: '前端基础',
                    children: [
                        '/interview/javascript/foundation/data-type',
                        '/interview/javascript/foundation/execution-context',
                        '/interview/javascript/foundation/execution-mechanism',
                    ]
                },
                {
                    text: '前端编码',
                    children: [
                        '/interview/javascript/coding/basic-api-usage/',
                        '/interview/javascript/coding/program-design/',
                    ]
                },
                {
                    text: '性能优化',
                    children: [
                        '/interview/javascript/performance-optimization/debounce-throttle/',
                    ]
                },
            ]
        },
        {
            text: '专题',
            children: [
                '/interview/topic/large-file-upload',
            ]
        },
        {
            text: '数据结构',
            children: [
                '/interview/data-structure/binary-tree',
                '/interview/data-structure/heap/',
            ]
        },
        {
            text: '算法',
            children: [
                {
                    text: '排序',
                    children: [
                        '/interview/algorithm/sorting-algorithm/',
                        '/interview/algorithm/sorting-algorithm/bubble-sort/',
                        '/interview/algorithm/sorting-algorithm/selection-sort/',
                        '/interview/algorithm/sorting-algorithm/insertion-sort/',
                        '/interview/algorithm/sorting-algorithm/merge-sort/',
                        '/interview/algorithm/sorting-algorithm/quick-sort/'
                    ]
                },
                {
                    text: '其他',
                    children: [
                        '/interview/algorithm/others/binary-search/',
                        '/interview/algorithm/others/fibonacci-sequence',
                    ]
                },
            ]
        },
    ]
};
