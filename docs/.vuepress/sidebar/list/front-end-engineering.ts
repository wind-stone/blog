export default {
    '/front-end-engineering/': [
        '/front-end-engineering/'
    ],
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
            prefix: '/front-end-engineering/initialization/style-guide',
            children: [
                'naming-convention/naming.md',
                'naming-convention/js.md',
            ]
        },
        {
            text: '代码格式化 - ESLint',
            prefix: '/front-end-engineering/initialization/code-formatter/eslint',
            children: [
                '',
                'eslint-vscode',
                'eslint-vue',
                'eslint-prettier',
                'how-to-write-a-custom-eslint-rule'
            ]
        },
    ],

    // 开发阶段
    '/front-end-engineering/development': [
        {
            text: 'h5 开发',
            prefix: '/front-end-engineering/development/h5',
            children: [
                '',
                'style',
                'local-mock',
            ]
        },
        {
            text: '后端 - Node',
            prefix: '/front-end-engineering/development/server-node',
            children: [
                '',
                'commonjs',
                'koa/',
                'server',
                'api',
                'pm2',
            ]
        },
        {
            text: '工具库',
            prefix: '/front-end-engineering/development/tools-library',
            children: [
                'axios',
            ]
        },
        {
            text: 'NPM',
            prefix: '/front-end-engineering/development/npm',
            children: [
                'semantic-version',
                '',
                'npm-command',
                'npmrc',
                'npm-config',
                'npm-scripts',
                'package.json',
                'package-lock.json',
                'third-party-package'
            ]
        },
        {
            text: 'pnpm',
            prefix: '/front-end-engineering/development/pnpm',
            children: [
                '',
            ]
        },
    ],

    // 构建阶段
    '/front-end-engineering/build': [
        {
            text: 'Webpack',
            prefix: '/front-end-engineering',
            children: [
                'build/webpack/',
                'build/webpack/webpack-runtime',
                {
                    text: 'Webpack 配置',
                    prefix: 'build/webpack/config',
                    children: [
                        'whole-config',
                        'practical-config',
                        'config-tools',
                        'dead-code',
                    ]
                },
                'build/webpack/webpack4-import',
                {
                    text: 'Tapable',
                    prefix: 'build/webpack/tapable',
                    children: [
                        '',
                        'tapable-readme',
                    ]
                },
            ]
        },
        '/front-end-engineering/build/rollup',
        '/front-end-engineering/build/source-map',
    ],

    // 发布阶段
    '/front-end-engineering/publish': [
        {
            text: 'ChangLog',
            children: [
                '/front-end-engineering/publish/changelog',
            ]
        },
    ],

    // 前端稳定性建设
    '/front-end-engineering/frontend-stability-construction': [
        '/front-end-engineering/frontend-stability-construction/',
        {
            text: '',
            prefix: '/front-end-engineering/frontend-stability-construction',
            children: [
                'observable-system/',
                'full-link-monitoring/',
                'high-availability-architecture/',
                'performance/',
                'risk-management/',
                'processs-mechanism/',
                'engineering-construction/',
                'summary'
            ]
        },
    ],
};
