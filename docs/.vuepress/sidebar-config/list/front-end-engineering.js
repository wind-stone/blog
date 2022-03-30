module.exports = {
    // 初始化阶段
    '/front-end-engineering/initialization': [
        {
            text: '代码仓库初始化',
            children: [
                '/front-end-engineering/initialization/repository/',
            ]
        },
        {
            text: '项目初始化',
            children: [
                '/front-end-engineering/initialization/project/',
            ]
        },
        {
            text: '编辑器初始化',
            children: [
                '/front-end-engineering/initialization/code-editors/vscode',
            ]
        },
        {
            text: '风格指南',
            children: [
                '/front-end-engineering/initialization/style-guide/naming-convention/naming.md',
                '/front-end-engineering/initialization/style-guide/naming-convention/js.md',
            ]
        },
        {
            text: '代码格式化 - ESLint',
            children: [
                '/front-end-engineering/initialization/code-formatter/eslint/',
                '/front-end-engineering/initialization/code-formatter/eslint/eslint-vscode',
                '/front-end-engineering/initialization/code-formatter/eslint/eslint-vue',
                '/front-end-engineering/initialization/code-formatter/eslint/eslint-prettier'
            ]
        },
    ],

    // 开发阶段
    '/front-end-engineering/development': [
        {
            text: 'h5 开发',
            children: [
                '/front-end-engineering/development/h5/',
                '/front-end-engineering/development/h5/style',
                '/front-end-engineering/development/h5/format',
            ]
        },
        {
            text: '后端 - Node',
            children: [
                '/front-end-engineering/development/server-node/',
                '/front-end-engineering/development/server-node/commonjs',
                '/front-end-engineering/development/server-node/koa/',
                '/front-end-engineering/development/server-node/server',
                '/front-end-engineering/development/server-node/api',
                '/front-end-engineering/development/server-node/pm2',
            ]
        },
        {
            text: '工具库',
            children: [
                '/front-end-engineering/development/tools-library/axios',
            ]
        },
        {
            text: 'NPM',
            children: [
                '/front-end-engineering/development/npm/semantic-version',
                '/front-end-engineering/development/npm/',
                '/front-end-engineering/development/npm/npm-command',
                '/front-end-engineering/development/npm/npmrc',
                '/front-end-engineering/development/npm/npm-config',
                '/front-end-engineering/development/npm/npm-scripts',
                '/front-end-engineering/development/npm/package.json',
                '/front-end-engineering/development/npm/package-lock.json',
                '/front-end-engineering/development/npm/third-party-package'
            ]
        },
    ],

    // 构建阶段
    '/front-end-engineering/build': [
        {
            text: 'Webpack',
            children: [
                '/front-end-engineering/build/webpack/',
                '/front-end-engineering/build/webpack/webpack-runtime',
                {
                    text: 'Webpack 配置',
                    children: [
                        '/front-end-engineering/build/webpack/config/whole-config',
                        '/front-end-engineering/build/webpack/config/practical-config',
                        '/front-end-engineering/build/webpack/config/config-tools',
                        '/front-end-engineering/build/webpack/config/dead-code',
                    ]
                },
                '/front-end-engineering/build/webpack/webpack4-import',
                {
                    text: 'Tapable',
                    children: [
                        '/front-end-engineering/build/webpack/tapable/',
                        '/front-end-engineering/build/webpack/tapable/tapable-readme',
                    ]
                },
            ]
        },
        '/front-end-engineering/build/rollup',
        '/front-end-engineering/build/source-map',
    ],
};
