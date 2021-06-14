module.exports = {
    // MVVM
    '/front-end/mvvm/': [
        {
            title: 'MVVM',
            collapsable: true,
            children: [
                'virtual-dom/'
            ]
        }
    ],

    // 工程化
    '/front-end/engineering/': [
        {
            title: '工程化',
            collapsable: true,
            children: [
                'project-init',
                'rollup'
            ]
        },
        {
            title: '命名规范',
            collapsable: true,
            children: [
                'naming-convention/js-naming'
            ]
        },
        {
            title: 'Axios',
            collapsable: true,
            children: [
                'axios/'
            ]
        },
        {
            title: 'ESLint',
            collapsable: true,
            children: [
                'eslint/',
                'eslint/vscode-eslint',
                'eslint/vue-eslint',
                'eslint/prettier-eslint'
            ]
        },
        {
            title: 'Webpack',
            collapsable: true,
            children: [
                'webpack/',
                'webpack/config',
                'webpack/webpack-runtime',
                'webpack/webpack4-import',
                'webpack/practices',
                'webpack/tapable/',
            ]
        },
        {
            title: 'Source Map',
            collapsable: true,
            children: [
                'source-map/',
            ]
        }
    ],

    '/front-end/interview/': [
        {
            title: '前端面试题',
            collapsable: true,
            children: [
                'js-interview',
                'browser-interview'
            ]
        }
    ]
};
