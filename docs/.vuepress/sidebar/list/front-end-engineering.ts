export default {
    // 开发环境
    '/front-end-engineering/environment': [
        {
            text: 'IDE',
            prefix: 'ide',
            children: [
                'vscode',
                'code-sandbox'
            ]
        },
        {
            text: '代码仓库',
            prefix: 'repository',
            children: [
                'monorepo',
            ]
        },
        {
            text: '包管理工具',
            prefix: 'package-manager',
            children: [
                'semantic-version',
                {
                    text: 'npm',
                    prefix: 'npm',
                    children: [
                        '',
                        'npm-command',
                        'npmrc',
                        'npm-config',
                        'npm-scripts',
                        'package.json',
                        'package-lock.json',
                    ]
                },
                {
                    text: 'pnpm',
                    prefix: 'pnpm',
                    children: [
                        '',
                    ]
                },
                {
                    text: '第三方包',
                    prefix: 'third-party-packages',
                    children: [
                        '',
                        {
                            text: '包环境管理',
                            prefix: 'package-env-management',
                            children: [
                                'nvm',
                                'nrm',
                                'npx',
                                'cross-env'
                            ]
                        },
                        'koa'
                    ]
                },
            ]
        },
    ],

    // 开发工具
    '/front-end-engineering/tools': [
        {
            text: '构建工具',
            prefix: 'build',
            children: [
                'source-map',
                'rollup',
                {
                    text: 'Webpack',
                    prefix: 'webpack',
                    children: [
                        '',
                        'webpack-runtime',
                        {
                            text: 'Webpack 配置',
                            prefix: 'config',
                            children: [
                                'whole-config',
                                'practical-config',
                                'config-tools',
                                'dead-code',
                            ]
                        },
                        'webpack4-import',
                        {
                            text: 'Tapable',
                            prefix: 'tapable',
                            children: [
                                '',
                                'tapable-readme',
                            ]
                        },
                    ]
                },
            ]
        },
        {
            text: '运行时工具',
            prefix: 'runtime',
            children: [
                'axios'
            ]
        },
        {
            text: '发布相关工具',
            children: [
                'publish/changelog',
            ]
        },
        {
            text: '风格指南',
            prefix: 'style-guide',
            children: [
                {
                    text: '命名规范',
                    prefix: 'naming-conventions',
                    children: [
                        'naming-references.md',
                        'js.md',
                    ]
                },
                {
                    text: 'ESLint',
                    prefix: 'code-formatter/eslint',
                    children: [
                        '',
                        'eslint-vscode',
                        'eslint-vue',
                        'eslint-prettier',
                        'how-to-write-a-custom-eslint-rule'
                    ]
                },
            ]
        }
    ],

    // 开发阶段
    '/front-end-engineering/development-skills': [
        {
            text: 'H5 开发',
            prefix: 'h5',
            children: [
                '',
                'css-style',
                'local-mock',
            ]
        },
        {
            text: 'Node 开发',
            prefix: 'nodejs',
            children: [
                '',
                'commonjs',
                'koa/',
                'server',
                'api',
                'pm2',
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
                {
                    text: '',
                    prefix: 'engineering-construction',
                    children: [
                        'automated-testing'
                    ]
                },
                'summary'
            ]
        },
    ],
};
