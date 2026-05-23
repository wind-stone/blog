export default {
    '/frontend-fundamentals/css/': [
        {
            text: 'CSS 技能',
            children: [
                {
                    text: '布局',
                    prefix: '/frontend-fundamentals/css/skills',
                    children: ['line-boxes-truncation-style', 'dog-ear'],
                },
            ],
        },
        {
            text: '专题',
            prefix: '/frontend-fundamentals/css/topics',
            children: [
                {
                    text: 'Flex 布局',
                    prefix: 'flex/',
                    children: ['', 'flex-image/'],
                },
                {
                    text: '文本',
                    children: ['text/text-wrap-and-ellipsis/'],
                },
                {
                    text: '边框',
                    children: ['border/border-image'],
                },
                'position-fixed',
            ],
        },
        {
            text: '选择器',
            children: ['/frontend-fundamentals/css/selectors/'],
        },
        {
            text: '属性',
            prefix: '/frontend-fundamentals/css/properties',
            children: ['', 'properties-order'],
        },
        {
            text: '屏幕',
            children: ['/frontend-fundamentals/css/screen/'],
        },
        {
            text: '视口',
            prefix: '/frontend-fundamentals/css/viewport',
            children: ['a-tale-of-viewports-one', 'a-tale-of-viewports-two'],
        },
        {
            text: '布局',
            prefix: '/frontend-fundamentals/css/layouts',
            children: ['', 'ifc/'],
        },
        {
            text: '字体',
            prefix: '/frontend-fundamentals/css/font',
            children: ['', 'css-font-metrics-line-height-and-vertical-align'],
        },
        {
            text: '实践',
            prefix: '/frontend-fundamentals/css/practices',
            children: [''],
        },
        {
            text: '预处理器',
            prefix: '/frontend-fundamentals/css/preprocessor',
            children: ['less', 'stylus'],
        },
        {
            text: '工具集合',
            prefix: '/frontend-fundamentals/css/tools',
            children: ['safe-area', 'text-ellipsis'],
        },
        {
            text: 'CSS 2.2 规范',
            prefix: '/frontend-fundamentals/css/css-spec',
            children: ['css2.2/8-box-model/', 'css2.2/9-visual-formatting-model/'],
        },
        {
            text: '未分类',
            prefix: '/frontend-fundamentals/css/unclassified',
            children: ['user-experience', 'compatibility', 'skill-pitfall'],
        },
    ],
};
