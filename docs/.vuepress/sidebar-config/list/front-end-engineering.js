module.exports = {
    // MVVM
    '/front-end-engineering/': [
        {
            text: '前端工程化',
            children: [
                '/front-end-engineering/'
            ]
        },
        {
            text: '初始化阶段',
            children: [
                '/front-end-engineering/project/repository',
                '/front-end-engineering/project/init',
                '/front-end-engineering/project/h5-project',
            ]
        },
        {
            text: '风格指南',
            children: [
                '/front-end-engineering/style-guide/naming-convention/naming.md',
                '/front-end-engineering/style-guide/naming-convention/js.md',
            ]
        },
        {
            text: '开发阶段 - Client',
            children: [
                '/front-end-engineering/client/axios',
                '/front-end-engineering/client/virtual-dom'
            ]
        },
        {
            text: '开发阶段 - Serve',
            children: [
                {
                    text: 'Node',
                    children: [
                        '/front-end-engineering/server/node/',
                        '/front-end-engineering/server/node/commonjs',
                        '/front-end-engineering/server/node/koa/',
                        '/front-end-engineering/server/node/server',
                        '/front-end-engineering/server/node/pm2',
                    ]
                },
            ]
        },
        {
            text: '开发阶段 - 辅助工具',
            children: [
                {
                    text: '代码编辑器',
                    children: [
                        '/front-end-engineering/development-help-tools/code-editors/vscode',
                    ]
                },
                {
                    text: '代码格式化 - ESLint',
                    children: [
                        '/front-end-engineering/development-help-tools/code-formatter/eslint/',
                        '/front-end-engineering/development-help-tools/code-formatter/eslint/eslint-vscode',
                        '/front-end-engineering/development-help-tools/code-formatter/eslint/eslint-vue',
                        '/front-end-engineering/development-help-tools/code-formatter/eslint/eslint-prettier'
                    ]
                },
                {
                    text: 'NPM',
                    children: [
                        '/front-end-engineering/development-help-tools/npm/',
                        '/front-end-engineering/development-help-tools/npm/npm-command',
                        '/front-end-engineering/development-help-tools/npm/npmrc',
                        '/front-end-engineering/development-help-tools/npm/npm-config',
                        '/front-end-engineering/development-help-tools/npm/npm-scripts',
                        '/front-end-engineering/development-help-tools/npm/package.json',
                        '/front-end-engineering/development-help-tools/npm/package-lock.json',
                        '/front-end-engineering/development-help-tools/npm/third-party-package'
                    ]
                },
            ]
        },
        {
            text: '构建阶段',
            children: [
                {
                    text: 'Webpack',
                    children: [
                        '/front-end-engineering/build-tools/webpack/',
                        '/front-end-engineering/build-tools/webpack/config',
                        '/front-end-engineering/build-tools/webpack/webpack-runtime',
                        '/front-end-engineering/build-tools/webpack/webpack4-import',
                        '/front-end-engineering/build-tools/webpack/practices',
                        '/front-end-engineering/build-tools/webpack/tapable/',
                        '/front-end-engineering/build-tools/webpack/tapable/tapable-readme',
                    ]
                },
                '/front-end-engineering/build-tools/rollup',
                '/front-end-engineering/build-tools/source-map',
            ]
        }
    ]
};
