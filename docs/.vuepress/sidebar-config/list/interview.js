module.exports = {
    '/interview': [
        {
            text: 'JS 面试题',
            children: [
                {
                    text: '性能优化',
                    children: [
                        '/interview/javascript/performance-optimization/debounce-throttle/',
                    ]
                },

                {
                    text: '工具函数',
                    children: [
                        '/interview/javascript/utils/format',
                    ]
                },
            ]
        },


        {
            text: 'Node.js 专属面试题',
            children: [
                '/interview/nodejs/'
            ]
        },


        // {
        //     text: 'CSS 面试题',
        //     children: [
        //         {
        //             text: '工具函数',
        //             children: [
        //                 '/interview/js/utils/data-type',
        //             ]
        //         },
        //     ]
        // },

        // {
        //     text: 'HMLT/DOM 面试题',
        //     children: [
        //         {
        //             text: '工具函数',
        //             children: [
        //                 '/interview/js/utils/data-type',
        //             ]
        //         },
        //     ]
        // }

        {
            text: '数据结构',
            children: [
                '/interview/data-structure/binary-tree'
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
