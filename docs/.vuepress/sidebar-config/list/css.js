module.exports = {
    '/css/': [
        {
            text: 'CSS 专题',
            children: [
                {
                    text: 'Flex 布局',
                    children: [
                        '/css/topics/flex/',
                        '/css/topics/flex/flex-image/',
                    ]
                },
                {
                    text: '文本',
                    children: [
                        '/css/topics/text/text-wrap-and-ellipsis/',
                    ]
                },
                '/css/topics/position-fixed',
            ]
        },
        {
            text: '选择器',
            children: [
                '/css/selectors/'
            ]
        },
        {
            text: '属性',
            children: [
                '/css/properties/',
                '/css/properties/properties-order'
            ]
        },
        {
            text: '屏幕',
            children: [
                '/css/screen/'
            ]
        },
        {
            text: '视口',
            children: [
                '/css/viewport/a-tale-of-viewports-one',
                '/css/viewport/a-tale-of-viewports-two'
            ]
        },
        {
            text: '布局',
            children: [
                '/css/layouts/',
                '/css/layouts/ifc/'
            ]
        },
        {
            text: '字体',
            children: [
                '/css/font/',
                '/css/font/css-font-metrics-line-height-and-vertical-align'
            ]
        },
        {
            text: '实践',
            children: [
                '/css/practices/'
            ]
        },
        {
            text: '预处理器',
            children: [
                '/css/preprocessor/less',
                '/css/preprocessor/stylus',
            ]
        },
        {
            text: '工具集合',
            children: [
                '/css/tools/safe-area',
                '/css/tools/text-ellipsis',
            ]
        },
        {
            text: 'CSS 2.2 规范',
            children: [
                '/css/css-spec/css2.2/8-box-model/',
                '/css/css-spec/css2.2/9-visual-formatting-model/'
            ]
        },
        {
            text: '未分类',
            children: [
                '/css/unclassified/user-experience',
                '/css/unclassified/compatibility',
                '/css/unclassified/skill-pitfall'
            ]
        }
    ],
};
